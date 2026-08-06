// Content-based spam scoring for the contact form.
//
// The honeypot and timing checks only catch dumb bots. Lead-gen / cold-outreach
// spam is submitted by a real browser (or a person) with every field filled in
// correctly, so it has to be caught on what it actually says.
//
// Two distinct spam shapes are handled here:
//   1. Sales pitches — coherent English selling SEO/review/AI services. Caught
//      by the operator, link, and sales-vocabulary rules.
//   2. Random noise — a script filling every field with junk. Caught by the
//      gibberish rules near the bottom, which look at whether the text is
//      language at all rather than at what it says.

export type SpamVerdict = {
  score: number
  reasons: string[]
  isSpam: boolean
  /** Matched the hard blocklist — drop outright, don't even quarantine. */
  isBlocked: boolean
}

// Flag at 5. Any single strong signal is enough; weak signals need to stack.
export const SPAM_THRESHOLD = 5

// --- Hard blocklist -------------------------------------------------------
// Identifiers we are certain about. A match here is dropped on the floor with
// no email at all, so entries must be specific enough that a real customer
// could never trip one. Deliberately excludes the bare word "dandy" (a real
// person or street could be named that) — that stays a scoring signal only.

const BLOCKED_EMAIL_DOMAINS = [
  "getdandy.com",
  "getdandynow.com",
  "reviewvio.com",
  "review-iq.com",
  "farnorthreview.com",
  "dandyreviewremoval.com",
  "dandyreviewai.com",
]

// Last 10 digits. ReviewVio/GetDandy numbers seen in submissions and on file.
const BLOCKED_PHONES = ["9495909895", "9499797488", "9496494042"]

const BLOCKED_PATTERNS = [
  /getdandy/i,
  /reviewvio/i,
  /review-?iq\b/i,
  /farnorthreview/i,
  /9891\s+irvine\s+center/i,
]

// How this business gets addressed in a templated blast: either the domain or
// the business name. Real customers write "you" or "you guys", not either one.
const OWN_IDENTIFIERS = [/fallen[\s-]?timber(?:\.com)?/i]

// Known contact-form spam operators. ReviewVio Inc. (Irvine, CA) does business
// as Dandy/GetDandy and blasts local-business forms; it also trades under
// several aliases, so match on the recognizable stems.
const KNOWN_SPAM_OPERATORS = [
  /getdandy/i,
  /reviewvio/i,
  /review-?iq/i,
  /farnorthreview/i,
  /9891\s+irvine\s+center/i,
]

// Ambiguous stems: suggestive, but "Bill Dandy" and "doing just dandy" are both
// things a real customer might write. Scored low so they can never flag alone.
const WEAK_OPERATOR_STEMS = [/\bdandy\b/i]

// Explicit URLs, plus bare domains like "getdandy.com" that skip the protocol.
const URL_RE = /\b(?:https?:\/\/|www\.)\S+/i
const BARE_DOMAIN_RE =
  /\b[a-z0-9][a-z0-9-]*\.(?:com|net|org|io|co|ai|biz|info|xyz|shop|online|site|club|link|us)\b/i

// Shorteners hide the destination — no reason for one in a tree quote request.
const SHORTENER_RE =
  /\b(?:bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|buff\.ly|rebrand\.ly|cutt\.ly|is\.gd|shorturl\.at|lnkd\.in)\b/i

// Cyrillic, Greek, CJK, Arabic, Hebrew — never appears in a real local lead.
const NON_LATIN_RE = /[Ѐ-ӿͰ-Ͽ一-鿿぀-ヿ؀-ۿ֐-׿]/

// Indiana is 46xxx–47xxx. Neighbors: MI 48–49, OH 43–45, IL 60–62, KY 40–42.
const REGIONAL_ZIP_RE = /^(4[0-9]|6[0-2])/
const REGIONAL_STATES = new Set(["in", "mi", "oh", "il", "ky"])

const SALES_PHRASES = [
  "ai employee",
  "ai agent",
  "ai receptionist",
  "seo",
  "search engine optimi",
  "digital marketing",
  "marketing agency",
  "increase leads",
  "more leads",
  "capture leads",
  "generate leads",
  "lead generation",
  "book a call",
  "quick call",
  "sales call",
  "hop on a call",
  "walkthrough",
  "demo",
  "schedule a time",
  "my calendar",
  "growth advisor",
  "account executive",
  "backlink",
  "guest post",
  "web design services",
  "redesign your website",
  "rank higher",
  "first page of google",
  "google business profile",
  "bad reviews",
  "no obligation",
  "free consultation",
  "free trial",
  "free audit",
  "unsubscribe",
  "opt out of future",
  "money back",
  "full refund",
  "times your money",
  "grab a time",
  "reach me directly",
  "15 minutes",
  "20 minutes",
  "minute demo",
  "implementation advisor",
  "answer your phone",
  "potential customers",
  "your business from your website",
  "i can set this up for you",
  "crypto",
  "bitcoin",
  "investment opportunity",
  "business loan",
  "casino",
  "viagra",
  "our clients",
  "our customers save",
  "per week",
  "on average",
]

const CONSUMER_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "comcast.net",
  "msn.com",
  "live.com",
  "att.net",
  "sbcglobal.net",
  "verizon.net",
  "frontier.com",
  "protonmail.com",
  "me.com",
])

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// --- Gibberish detection --------------------------------------------------
// Catches submissions where the fields aren't language at all — a name like
// "SpxXVZVYihpLvqcyaleRNM", a location of "Vjtvdhiq", details of "3469342019".
// None of the rules above look at coherence, so this shape scores a clean zero
// on them.
//
// The whole risk here is flagging a real customer with an unusual name, so
// every threshold below is calibrated against consonant-heavy Slavic surnames,
// which are the worst realistic case: "Szczepanski" (4-consonant run, 27%
// vowels) and "Krzysztof" (9 chars, 22% vowels) must both score zero.

// "y" counts as a vowel — treating it as a consonant flags ordinary surnames.
const VOWELS = new Set(["a", "e", "i", "o", "u", "y"])

/** Letter-only tokens, so digits and punctuation in an address don't count. */
function tokenize(value: string): string[] {
  return value.split(/[^A-Za-z]+/).filter(Boolean)
}

function longestConsonantRun(lower: string): number {
  let best = 0
  let run = 0
  for (const ch of lower) {
    if (VOWELS.has(ch)) {
      run = 0
      continue
    }
    run += 1
    if (run > best) best = run
  }
  return best
}

function vowelRatio(lower: string): number {
  let vowels = 0
  for (const ch of lower) if (VOWELS.has(ch)) vowels += 1
  return vowels / lower.length
}

/**
 * Lowercase→uppercase transitions inside a token. "McDonald" and "DeAngelo"
 * score 1; an all-caps name scores 0, which is why this counts transitions
 * rather than uppercase letters.
 */
function caseTransitions(token: string): number {
  let count = 0
  for (let i = 1; i < token.length; i += 1) {
    if (/[a-z]/.test(token[i - 1]) && /[A-Z]/.test(token[i])) count += 1
  }
  return count
}

/**
 * Which independent gibberish signals a single token trips. Length gates are
 * per-signal: six consecutive consonants is damning even in a short token,
 * while vowel ratio and capitalization need real length before they mean
 * anything.
 */
function gibberishSignals(token: string): string[] {
  const lower = token.toLowerCase()
  const signals: string[] = []
  if (lower.length >= 8 && longestConsonantRun(lower) >= 6) signals.push("6+ consonants in a row")
  if (lower.length >= 10 && vowelRatio(lower) < 0.22) signals.push("almost no vowels")
  const flips = caseTransitions(token)
  if (token.length >= 12 && flips >= 3) signals.push("random capitalization")
  // Sustained alternation ("aBcDeFgHiJkLmNoP") is its own signal, so a name
  // that does nothing else wrong still gets flagged. No human types this.
  if (token.length >= 12 && flips >= 6) signals.push("caps alternate throughout")
  return signals
}

/** The worst token in a field — spam only needs one to give itself away. */
function fieldGibberish(value: string): string[] {
  let worst: string[] = []
  for (const token of tokenize(value ?? "")) {
    const signals = gibberishSignals(token)
    if (signals.length > worst.length) worst = signals
  }
  return worst
}

/**
 * Details carrying no language at all. Returns the reason, or null if the text
 * is at least word-shaped. Kept separate from the token rules because the
 * failure is the absence of words, not the shape of them.
 */
function nonLinguisticDetails(details: string): string | null {
  const trimmed = (details ?? "").trim()
  if (trimmed.length < 6) return null

  if (!/[A-Za-z]/.test(trimmed) && /\d/.test(trimmed)) {
    return "no words at all, just digits"
  }

  const letters = trimmed.toLowerCase().replace(/[^a-z]/g, "")
  if (letters.length >= 6 && ![...letters].some((ch) => VOWELS.has(ch))) {
    return "letters but no vowels"
  }

  return null
}

export type SubmissionFields = {
  name: string
  phone: string
  email: string
  address: string
  details: string
}

/**
 * Hard blocklist check. Returns the matching reason, or null if clean.
 * Matches on email domain (including subdomains), phone, or a text pattern
 * anywhere in the submission.
 */
export function checkBlocklist(fields: SubmissionFields): string | null {
  const emailDomain = (fields.email ?? "").split("@")[1]?.toLowerCase().trim()
  if (emailDomain) {
    const hit = BLOCKED_EMAIL_DOMAINS.find(
      (d) => emailDomain === d || emailDomain.endsWith(`.${d}`),
    )
    if (hit) return `blocklisted email domain: ${hit}`
  }

  const digits = (fields.phone ?? "").replace(/\D/g, "").slice(-10)
  if (digits.length === 10 && BLOCKED_PHONES.includes(digits)) {
    return `blocklisted phone: ${digits}`
  }

  const haystack = [fields.name, fields.email, fields.address, fields.details]
    .filter(Boolean)
    .join(" ")
  const pattern = BLOCKED_PATTERNS.find((re) => re.test(haystack))
  if (pattern) return `blocklisted pattern: ${pattern.source}`

  return null
}

export function scoreSubmission(fields: SubmissionFields): SpamVerdict {
  const reasons: string[] = []
  let score = 0

  const add = (points: number, reason: string) => {
    score += points
    reasons.push(`${reason} (+${points})`)
  }

  const details = fields.details ?? ""
  const name = fields.name ?? ""
  const address = fields.address ?? ""
  const detailsLower = details.toLowerCase()

  // 1. Links. A homeowner asking about a dead maple does not paste URLs.
  const detailsHasLink = URL_RE.test(details) || BARE_DOMAIN_RE.test(details)
  if (detailsHasLink) add(4, "link in details")
  if (URL_RE.test(name) || BARE_DOMAIN_RE.test(name)) add(5, "link in name")
  if (URL_RE.test(address) || BARE_DOMAIN_RE.test(address)) add(5, "link in address")

  // 2. Known operator. Single strongest signal — flags on its own.
  const haystack = `${name} ${fields.email ?? ""} ${address} ${details}`
  const operator = KNOWN_SPAM_OPERATORS.find((re) => re.test(haystack))
  if (operator) {
    add(6, `known spam operator (matched ${operator.source})`)
  } else {
    const weak = WEAK_OPERATOR_STEMS.find((re) => re.test(haystack))
    if (weak) add(2, `possible spam operator (matched ${weak.source})`)
  }

  // 3. Addresses us by domain or business name — the tell of a templated
  // "Hi {{business}}" blast. Customers say "you", not "Fallen Timber".
  if (OWN_IDENTIFIERS.some((re) => re.test(details))) {
    add(3, "addresses us by our own name/domain")
  }

  // 4. Link shortener hiding a destination.
  if (SHORTENER_RE.test(details)) add(3, "shortened link")

  // 5. Sales / outreach vocabulary. Capped so a chatty customer can't trip it alone.
  const hits = SALES_PHRASES.filter((phrase) =>
    new RegExp(`\\b${escapeRe(phrase)}`, "i").test(detailsLower),
  )
  if (hits.length > 0) {
    add(Math.min(hits.length * 2, 6), `sales phrases: ${hits.slice(0, 6).join(", ")}`)
  }

  // 6. Non-Latin script.
  if (NON_LATIN_RE.test(`${name} ${details} ${address}`)) add(5, "non-Latin characters")

  // 7. Outside the service area. Warsaw IN is a local, drive-a-truck-there business.
  const zip = address.match(/\b(\d{5})(?:-\d{4})?\b/)?.[1]
  const stateCode = address.match(/,\s*([A-Za-z]{2})\b(?!\w)/)?.[1]?.toLowerCase()
  if (zip && !REGIONAL_ZIP_RE.test(zip)) {
    add(3, `ZIP ${zip} is far outside the service area`)
  } else if (stateCode && !REGIONAL_STATES.has(stateCode)) {
    add(3, `state ${stateCode.toUpperCase()} is outside the service area`)
  }

  // 8. Business email domain paired with a link — vendor pitching, not a customer.
  const emailDomain = (fields.email ?? "").split("@")[1]?.toLowerCase()
  if (detailsHasLink && emailDomain && !CONSUMER_EMAIL_DOMAINS.has(emailDomain)) {
    add(2, `business email domain (${emailDomain}) alongside a link`)
  }

  // 9. Wall of text. Real requests are a few sentences.
  if (details.length > 900) add(2, `unusually long details (${details.length} chars)`)

  // 10. Gibberish. Two signals in one field is conclusive on its own; one is
  // only suggestive, and is scored so it can never flag a submission alone.
  const nameSignals = fieldGibberish(name)
  if (nameSignals.length >= 2) {
    add(5, `name is gibberish (${nameSignals.join(", ")})`)
  } else if (nameSignals.length === 1) {
    add(3, `name may be gibberish (${nameSignals[0]})`)
  }

  const addressSignals = fieldGibberish(address)
  if (addressSignals.length >= 2) {
    add(4, `address is gibberish (${addressSignals.join(", ")})`)
  } else if (addressSignals.length === 1) {
    add(2, `address may be gibberish (${addressSignals[0]})`)
  }

  const detailsSignals = fieldGibberish(details)
  if (detailsSignals.length >= 2) {
    add(4, `details are gibberish (${detailsSignals.join(", ")})`)
  } else if (detailsSignals.length === 1) {
    add(2, `details may be gibberish (${detailsSignals[0]})`)
  }

  const nonLinguistic = nonLinguisticDetails(details)
  if (nonLinguistic) add(4, `details contain ${nonLinguistic}`)

  const blocked = checkBlocklist(fields)
  if (blocked) {
    reasons.unshift(`HARD BLOCK — ${blocked}`)
  }

  return {
    score,
    reasons,
    isSpam: score >= SPAM_THRESHOLD || blocked !== null,
    isBlocked: blocked !== null,
  }
}

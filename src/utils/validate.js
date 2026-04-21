/**
 * Lightweight field-level validation helpers.
 * Each rule is a function: (value) => errorString | null
 */

export const rules = {
  required: (v) => (!String(v ?? '').trim() ? 'Required' : null),

  email: (v) =>
    /^\S+@\S+\.\S+$/.test(String(v).trim()) ? null : 'Enter a valid email address',

  minLen: (n) => (v) =>
    String(v).length >= n ? null : `Must be at least ${n} characters`,

  maxLen: (n) => (v) =>
    String(v).length <= n ? null : `Maximum ${n} characters`,

  match: (other) => (v) =>
    v === other ? null : 'Passwords do not match',

  /** Strip common script-injection patterns */
  noHtml: (v) =>
    /<[a-z][\s\S]*>/i.test(String(v)) ? 'Invalid characters' : null,

  safeName: (v) =>
    /[<>"'`&]/.test(String(v)) ? 'Name contains invalid characters' : null,
}

/**
 * Run a map of { fieldName: [value, [rule, rule, ...]] } through all rules.
 * Returns { fieldName: firstErrorString } for every invalid field.
 * Empty result = valid.
 */
export function validate(fields) {
  const errors = {}
  for (const [key, [value, fieldRules]] of Object.entries(fields)) {
    for (const rule of fieldRules) {
      const err = rule(value)
      if (err) {
        errors[key] = err
        break
      }
    }
  }
  return errors
}

/**
 * Returns 'weak' | 'fair' | 'strong' for password strength display.
 */
export function passwordStrength(password) {
  if (!password || password.length < 6) return 'weak'
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  const score = [password.length >= 8, hasUpper && hasLower, hasNumber, hasSpecial].filter(Boolean).length
  if (score >= 4) return 'strong'
  if (score >= 2) return 'fair'
  return 'weak'
}

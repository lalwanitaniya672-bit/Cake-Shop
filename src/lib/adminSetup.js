const ADMIN_EMAILS = ['admin@gmail.com']

export function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(email?.toLowerCase())
}

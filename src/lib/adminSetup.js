export const ADMIN_EMAIL = 'admin@gmail.com'

export function isAdminEmail(email) {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

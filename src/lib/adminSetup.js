export const ADMIN_EMAIL = 'admin@thevelvetcrumb.com'

export function isAdminEmail(email) {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

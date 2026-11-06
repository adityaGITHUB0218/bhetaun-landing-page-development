export type AppRole = 'customer' | 'vendor' | 'admin'

export function normalizeRole(role: string | null | undefined): AppRole {
  const value = (role ?? '').trim().toLowerCase()
  if (value === 'admin') return 'admin'
  if (value === 'vendor' || value.includes('business')) return 'vendor'
  return 'customer'
}

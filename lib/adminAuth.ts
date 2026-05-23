/**
 * Check if user is authenticated as admin
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = sessionStorage.getItem('adminAuth');
  return !!token;
}

/**
 * Logout admin user
 */
export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem('adminAuth');
}

/**
 * Get admin auth token
 */
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  return sessionStorage.getItem('adminAuth');
}

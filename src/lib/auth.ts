export function isAdmin(appMetadata: unknown): boolean {
  return typeof appMetadata === 'object'
    && appMetadata !== null
    && 'role' in appMetadata
    && appMetadata.role === 'admin';
}

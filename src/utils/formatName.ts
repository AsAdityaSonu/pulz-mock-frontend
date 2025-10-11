// Utility to format a name for avatar: show first char, or truncate and add ... if too long
export function formatAvatarInitial(name: string, maxLength: number = 1): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (trimmed.length <= maxLength) return trimmed.charAt(0).toUpperCase();
  return trimmed.slice(0, maxLength).toUpperCase() + '...';
}

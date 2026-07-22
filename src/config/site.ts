const fallbackContactEmail = 'chinajpq@outlook.com';

export function getContactEmail(configuredEmail: string | undefined): string {
  return configuredEmail?.trim() || fallbackContactEmail;
}

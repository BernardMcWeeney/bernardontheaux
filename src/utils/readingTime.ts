const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string): number {
  // Strip HTML tags if any
  const text = content.replace(/<[^>]*>/g, '');

  // Count words
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  // Calculate reading time in minutes
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);

  return Math.max(1, minutes);
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

export const formatDate = (value: string | Date | undefined | null) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatRating = (value?: number | null) => {
  if (value === undefined || value === null) return '';
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

export const slugifyTag = (tag: string) =>
  tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

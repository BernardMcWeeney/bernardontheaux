import { getCollection } from 'astro:content';

export interface TaggedPost {
  title: string;
  slug: string;
  href: string;
  collection: string;
  date: Date;
  excerpt?: string;
  artist?: string;
  tags: string[];
}

export async function getAllPosts(): Promise<TaggedPost[]> {
  const isPublished = (entry: any) => entry.data.published !== false;

  const [reviews, gigs, deepDives, playlists, notes] = await Promise.all([
    getCollection('reviews'),
    getCollection('gigs'),
    getCollection('deep-dives'),
    getCollection('playlists'),
    getCollection('notes'),
  ]);

  const posts: TaggedPost[] = [
    ...reviews.filter(isPublished).map((entry) => ({
      title: entry.data.artist ? `${entry.data.artist} — ${entry.data.title}` : entry.data.title,
      slug: entry.id,
      href: `/reviews/${entry.id}/`,
      collection: 'reviews',
      date: entry.data.review_date,
      excerpt: entry.data.excerpt,
      artist: entry.data.artist,
      tags: entry.data.tags ?? [],
    })),
    ...gigs.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      slug: entry.id,
      href: `/gigs/${entry.id}/`,
      collection: 'gigs',
      date: entry.data.event_date,
      excerpt: entry.data.excerpt,
      artist: entry.data.artist,
      tags: entry.data.tags ?? [],
    })),
    ...deepDives.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      slug: entry.id,
      href: `/deep-dives/${entry.id}/`,
      collection: 'deep-dives',
      date: entry.data.published_on,
      excerpt: entry.data.excerpt,
      tags: entry.data.tags ?? [],
    })),
    ...playlists.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      slug: entry.id,
      href: `/playlists/${entry.id}/`,
      collection: 'playlists',
      date: entry.data.published_on,
      excerpt: entry.data.excerpt,
      tags: entry.data.tags ?? [],
    })),
    ...notes.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      slug: entry.id,
      href: `/notes/${entry.id}/`,
      collection: 'notes',
      date: entry.data.listened_on,
      excerpt: entry.data.excerpt,
      artist: entry.data.artist,
      tags: entry.data.tags ?? [],
    })),
  ];

  return posts.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts();
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const normalizedTag = tag.trim();
      tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) ?? 0) + 1);
    }
  }

  return tagCounts;
}

export async function getPostsByTag(tag: string): Promise<TaggedPost[]> {
  const posts = await getAllPosts();
  const normalizedTag = tag.toLowerCase();

  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === normalizedTag)
  );
}

export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getTagFromSlug(slug: string, tags: string[]): string | undefined {
  return tags.find((tag) => slugifyTag(tag) === slug);
}

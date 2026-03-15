import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const isPublished = (entry: any) => entry.data.published !== false;

  const [reviews, gigs, deepDives, playlists, notes] = await Promise.all([
    getCollection('reviews'),
    getCollection('gigs'),
    getCollection('deep-dives'),
    getCollection('playlists'),
    getCollection('notes'),
  ]);

  const searchIndex = [
    ...reviews.filter(isPublished).map((entry) => ({
      title: `${entry.data.artist} — ${entry.data.title}`,
      slug: entry.id,
      href: `/reviews/${entry.id}/`,
      collection: 'reviews',
      collectionLabel: 'Review',
      excerpt: entry.data.excerpt ?? '',
      artist: entry.data.artist,
      tags: entry.data.tags ?? [],
      date: entry.data.review_date.toISOString(),
    })),
    ...gigs.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      slug: entry.id,
      href: `/gigs/${entry.id}/`,
      collection: 'gigs',
      collectionLabel: 'Gig diary',
      excerpt: entry.data.excerpt ?? '',
      artist: entry.data.artist,
      tags: entry.data.tags ?? [],
      date: entry.data.event_date.toISOString(),
    })),
    ...deepDives.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      slug: entry.id,
      href: `/deep-dives/${entry.id}/`,
      collection: 'deep-dives',
      collectionLabel: 'Deep dive',
      excerpt: entry.data.excerpt ?? '',
      artist: entry.data.topic ?? '',
      tags: entry.data.tags ?? [],
      date: entry.data.published_on.toISOString(),
    })),
    ...playlists.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      slug: entry.id,
      href: `/playlists/${entry.id}/`,
      collection: 'playlists',
      collectionLabel: 'Playlist',
      excerpt: entry.data.excerpt ?? '',
      artist: '',
      tags: entry.data.tags ?? [],
      date: entry.data.published_on.toISOString(),
    })),
    ...notes.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      slug: entry.id,
      href: `/notes/${entry.id}/`,
      collection: 'notes',
      collectionLabel: 'Listening note',
      excerpt: entry.data.excerpt ?? '',
      artist: entry.data.artist ?? '',
      tags: entry.data.tags ?? [],
      date: entry.data.listened_on.toISOString(),
    })),
  ].sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

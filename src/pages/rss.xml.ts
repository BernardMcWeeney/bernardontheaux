import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const isPublished = (entry: any) => entry.data.published !== false;

  const [reviews, gigs, deepDives, playlists, notes] = await Promise.all([
    getCollection('reviews'),
    getCollection('gigs'),
    getCollection('deep-dives'),
    getCollection('playlists'),
    getCollection('notes'),
  ]);

  const items = [
    ...reviews.filter(isPublished).map((entry) => ({
      title: `${entry.data.artist} — ${entry.data.title}`,
      pubDate: entry.data.review_date,
      description: entry.data.excerpt ?? '',
      link: `/reviews/${entry.id}/`,
    })),
    ...gigs.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.event_date,
      description: entry.data.excerpt ?? '',
      link: `/gigs/${entry.id}/`,
    })),
    ...deepDives.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.published_on,
      description: entry.data.excerpt ?? '',
      link: `/deep-dives/${entry.id}/`,
    })),
    ...playlists.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.published_on,
      description: entry.data.excerpt ?? '',
      link: `/playlists/${entry.id}/`,
    })),
    ...notes.filter(isPublished).map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.listened_on,
      description: entry.data.excerpt ?? '',
      link: `/notes/${entry.id}/`,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'Bernard On The Aux',
    description: 'A personal, passion-driven music review and listening log. Album reviews, gig diaries, deep dives, and listening notes.',
    site: context.site ?? 'https://bernardontheaux.com',
    items,
    customData: '<language>en-us</language>',
  });
}

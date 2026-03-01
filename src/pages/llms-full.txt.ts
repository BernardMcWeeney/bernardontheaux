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

  const lines: string[] = [];

  lines.push('# Bernard On The Aux — Full Content Index');
  lines.push('');
  lines.push('> A personal, passion-driven music review and listening log.');
  lines.push('> Album reviews, gig diaries, deep dives, playlists, and listening notes.');
  lines.push('');

  // Reviews
  const pubReviews = reviews.filter(isPublished).sort((a, b) => b.data.review_date.valueOf() - a.data.review_date.valueOf());
  lines.push(`## Album Reviews (${pubReviews.length})`);
  lines.push('');
  for (const entry of pubReviews) {
    const d = entry.data;
    lines.push(`### ${d.artist} — ${d.title}`);
    lines.push(`- URL: https://bernardontheaux.com/reviews/${entry.slug}/`);
    lines.push(`- Rating: ${d.rating}/10`);
    lines.push(`- Review Date: ${d.review_date.toISOString().split('T')[0]}`);
    if (d.release_year) lines.push(`- Release Year: ${d.release_year}`);
    if (d.format) lines.push(`- Format: ${d.format}`);
    if (d.label) lines.push(`- Label: ${d.label}`);
    if (d.standout_tracks) lines.push(`- Standout Tracks: ${d.standout_tracks}`);
    if (d.tags?.length) lines.push(`- Tags: ${d.tags.join(', ')}`);
    if (d.excerpt) lines.push(`- Summary: ${d.excerpt}`);
    lines.push('');
  }

  // Gigs
  const pubGigs = gigs.filter(isPublished).sort((a, b) => b.data.event_date.valueOf() - a.data.event_date.valueOf());
  lines.push(`## Gig Diaries (${pubGigs.length})`);
  lines.push('');
  for (const entry of pubGigs) {
    const d = entry.data;
    lines.push(`### ${d.title}`);
    lines.push(`- URL: https://bernardontheaux.com/gigs/${entry.slug}/`);
    lines.push(`- Artist: ${d.artist}`);
    lines.push(`- Venue: ${d.venue}, ${d.city}`);
    lines.push(`- Date: ${d.event_date.toISOString().split('T')[0]}`);
    if (d.tour) lines.push(`- Tour: ${d.tour}`);
    if (d.support) lines.push(`- Support: ${d.support}`);
    if (d.highlights) lines.push(`- Highlights: ${d.highlights}`);
    if (d.tags?.length) lines.push(`- Tags: ${d.tags.join(', ')}`);
    if (d.excerpt) lines.push(`- Summary: ${d.excerpt}`);
    lines.push('');
  }

  // Deep Dives
  const pubDives = deepDives.filter(isPublished).sort((a, b) => b.data.published_on.valueOf() - a.data.published_on.valueOf());
  lines.push(`## Deep Dives (${pubDives.length})`);
  lines.push('');
  for (const entry of pubDives) {
    const d = entry.data;
    lines.push(`### ${d.title}`);
    lines.push(`- URL: https://bernardontheaux.com/deep-dives/${entry.slug}/`);
    lines.push(`- Published: ${d.published_on.toISOString().split('T')[0]}`);
    if (d.topic) lines.push(`- Topic: ${d.topic}`);
    if (d.era) lines.push(`- Era: ${d.era}`);
    if (d.tags?.length) lines.push(`- Tags: ${d.tags.join(', ')}`);
    if (d.excerpt) lines.push(`- Summary: ${d.excerpt}`);
    lines.push('');
  }

  // Playlists
  const pubPlaylists = playlists.filter(isPublished).sort((a, b) => b.data.published_on.valueOf() - a.data.published_on.valueOf());
  lines.push(`## Playlists (${pubPlaylists.length})`);
  lines.push('');
  for (const entry of pubPlaylists) {
    const d = entry.data;
    lines.push(`### ${d.title}`);
    lines.push(`- URL: https://bernardontheaux.com/playlists/${entry.slug}/`);
    lines.push(`- Platform: ${d.platform}`);
    lines.push(`- Playlist Link: ${d.playlist_url}`);
    lines.push(`- Published: ${d.published_on.toISOString().split('T')[0]}`);
    if (d.mood) lines.push(`- Mood: ${d.mood}`);
    if (d.duration) lines.push(`- Duration: ${d.duration} min`);
    if (d.tags?.length) lines.push(`- Tags: ${d.tags.join(', ')}`);
    if (d.excerpt) lines.push(`- Summary: ${d.excerpt}`);
    lines.push('');
  }

  // Notes
  const pubNotes = notes.filter(isPublished).sort((a, b) => b.data.listened_on.valueOf() - a.data.listened_on.valueOf());
  lines.push(`## Listening Notes (${pubNotes.length})`);
  lines.push('');
  for (const entry of pubNotes) {
    const d = entry.data;
    lines.push(`### ${d.title}`);
    lines.push(`- URL: https://bernardontheaux.com/notes/${entry.slug}/`);
    lines.push(`- Listened: ${d.listened_on.toISOString().split('T')[0]}`);
    if (d.artist) lines.push(`- Artist: ${d.artist}`);
    if (d.source) lines.push(`- Source: ${d.source}`);
    if (d.tags?.length) lines.push(`- Tags: ${d.tags.join(', ')}`);
    if (d.excerpt) lines.push(`- Summary: ${d.excerpt}`);
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

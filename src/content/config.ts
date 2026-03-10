import { defineCollection, z } from 'astro:content';

const reviews = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    review_type: z.enum(['album', 'gig', 'artist', 'single', 'ep', 'film', 'other']).default('album'),
    artist: z.string().optional(),
    review_date: z.date(),
    listened_on: z.date().optional(),
    rating: z.number().min(0).max(10),
    format: z.enum(['Vinyl', 'CD', 'Digital', 'Stream', 'Cassette', 'Other']).optional(),
    label: z.string().optional(),
    release_year: z.number().optional(),
    standout_tracks: z.string().optional(),
    // Gig-specific fields (when review_type is 'gig')
    venue: z.string().optional(),
    city: z.string().optional(),
    event_date: z.date().optional(),
    // Media attachments
    images: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    audio: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
    pinned: z.boolean().optional(),
  }),
});

const gigs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    venue: z.string(),
    city: z.string(),
    event_date: z.date(),
    tour: z.string().optional(),
    support: z.string().optional(),
    highlights: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

const deepDives = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    published_on: z.date(),
    topic: z.string().optional(),
    era: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

const playlists = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    published_on: z.date(),
    platform: z.enum(['Spotify', 'Apple Music', 'YouTube', 'Tidal', 'Bandcamp', 'Other']),
    playlist_url: z.string(),
    embed_url: z.string().optional(),
    mood: z.string().optional(),
    duration: z.number().optional(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    listened_on: z.date(),
    artist: z.string().optional(),
    source: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    excerpt: z.string().optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = {
  reviews,
  gigs,
  'deep-dives': deepDives,
  playlists,
  notes,
};

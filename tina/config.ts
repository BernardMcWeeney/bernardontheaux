import { defineConfig } from 'tinacms';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || 'main',

  // Self-hosted: point the admin UI to our own API
  contentApiUrlOverride: '/api/tina/gql',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'media',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'reviews',
        label: 'Reviews',
        path: 'src/content/reviews',
        format: 'md',
        ui: {
          router: ({ document }) => `/reviews/${document._sys.filename}/`,
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true, isTitle: true },
          { type: 'string', name: 'artist', label: 'Artist', required: true },
          {
            type: 'datetime', name: 'review_date', label: 'Review Date', required: true,
            ui: { dateFormat: 'YYYY-MM-DD' },
          },
          {
            type: 'datetime', name: 'listened_on', label: 'Listened On',
            ui: { dateFormat: 'YYYY-MM-DD' },
          },
          { type: 'number', name: 'rating', label: 'Rating (0-10)', required: true },
          {
            type: 'string', name: 'format', label: 'Format',
            options: ['Vinyl', 'CD', 'Digital', 'Stream', 'Cassette', 'Other'],
          },
          { type: 'string', name: 'label', label: 'Record Label' },
          { type: 'number', name: 'release_year', label: 'Release Year' },
          {
            type: 'string', name: 'standout_tracks', label: 'Standout Tracks',
            description: 'Comma-separated track names',
          },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'image', name: 'cover', label: 'Cover Image' },
          { type: 'string', name: 'excerpt', label: 'Excerpt', ui: { component: 'textarea' } },
          { type: 'boolean', name: 'published', label: 'Published' },
          { type: 'boolean', name: 'featured', label: 'Featured' },
          {
            type: 'boolean', name: 'pinned', label: 'Pinned',
            description: 'Anchors review at top of home page',
          },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'gigs',
        label: 'Gigs',
        path: 'src/content/gigs',
        format: 'md',
        ui: {
          router: ({ document }) => `/gigs/${document._sys.filename}/`,
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true, isTitle: true },
          { type: 'string', name: 'artist', label: 'Artist', required: true },
          { type: 'string', name: 'venue', label: 'Venue', required: true },
          { type: 'string', name: 'city', label: 'City', required: true },
          {
            type: 'datetime', name: 'event_date', label: 'Event Date', required: true,
            ui: { dateFormat: 'YYYY-MM-DD' },
          },
          { type: 'string', name: 'tour', label: 'Tour Name' },
          { type: 'string', name: 'support', label: 'Support Act' },
          {
            type: 'string', name: 'highlights', label: 'Highlights',
            description: 'Key moments from the show',
            ui: { component: 'textarea' },
          },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'image', name: 'cover', label: 'Cover Image' },
          { type: 'string', name: 'excerpt', label: 'Excerpt', ui: { component: 'textarea' } },
          { type: 'boolean', name: 'published', label: 'Published' },
          { type: 'boolean', name: 'featured', label: 'Featured' },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'deep_dives',
        label: 'Deep Dives',
        path: 'src/content/deep-dives',
        format: 'md',
        ui: {
          router: ({ document }) => `/deep-dives/${document._sys.filename}/`,
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true, isTitle: true },
          {
            type: 'datetime', name: 'published_on', label: 'Published On', required: true,
            ui: { dateFormat: 'YYYY-MM-DD' },
          },
          { type: 'string', name: 'topic', label: 'Topic' },
          { type: 'string', name: 'era', label: 'Era', description: 'Historical period, e.g. 1974-1981' },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'image', name: 'cover', label: 'Cover Image' },
          { type: 'string', name: 'excerpt', label: 'Excerpt', ui: { component: 'textarea' } },
          { type: 'boolean', name: 'published', label: 'Published' },
          { type: 'boolean', name: 'featured', label: 'Featured' },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'playlists',
        label: 'Playlists',
        path: 'src/content/playlists',
        format: 'md',
        ui: {
          router: ({ document }) => `/playlists/${document._sys.filename}/`,
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true, isTitle: true },
          {
            type: 'datetime', name: 'published_on', label: 'Published On', required: true,
            ui: { dateFormat: 'YYYY-MM-DD' },
          },
          {
            type: 'string', name: 'platform', label: 'Platform', required: true,
            options: ['Spotify', 'Apple Music', 'YouTube', 'Tidal', 'Bandcamp', 'Other'],
          },
          { type: 'string', name: 'playlist_url', label: 'Playlist URL', required: true },
          {
            type: 'string', name: 'embed_url', label: 'Embed URL',
            description: 'Embed code for the playlist player',
          },
          {
            type: 'string', name: 'mood', label: 'Mood',
            description: 'Mood/vibe descriptor, e.g. Moody, low-lit, steady pace',
          },
          { type: 'number', name: 'duration', label: 'Duration (minutes)' },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'image', name: 'cover', label: 'Cover Image' },
          { type: 'string', name: 'excerpt', label: 'Excerpt', ui: { component: 'textarea' } },
          { type: 'boolean', name: 'published', label: 'Published' },
          { type: 'boolean', name: 'featured', label: 'Featured' },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'notes',
        label: 'Notes',
        path: 'src/content/notes',
        format: 'md',
        ui: {
          router: ({ document }) => `/notes/${document._sys.filename}/`,
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true, isTitle: true },
          {
            type: 'datetime', name: 'listened_on', label: 'Listened On', required: true,
            ui: { dateFormat: 'YYYY-MM-DD' },
          },
          { type: 'string', name: 'artist', label: 'Artist' },
          {
            type: 'string', name: 'source', label: 'Source',
            description: 'Where/context, e.g. Morning commute',
          },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'image', name: 'cover', label: 'Cover Image' },
          { type: 'string', name: 'excerpt', label: 'Excerpt', ui: { component: 'textarea' } },
          { type: 'boolean', name: 'published', label: 'Published' },
          { type: 'boolean', name: 'featured', label: 'Featured' },
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
    ],
  },
});

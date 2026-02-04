import { getAllPosts, type TaggedPost } from './tags';

export interface RelatedPost {
  title: string;
  href: string;
  collection: string;
  collectionLabel: string;
  date: Date;
  score: number;
}

const collectionLabels: Record<string, string> = {
  reviews: 'Review',
  gigs: 'Gig diary',
  'deep-dives': 'Deep dive',
  playlists: 'Playlist',
  notes: 'Listening note',
};

export async function getRelatedPosts(
  currentSlug: string,
  currentCollection: string,
  currentTags: string[],
  currentArtist?: string,
  limit: number = 3
): Promise<RelatedPost[]> {
  const allPosts = await getAllPosts();

  // Filter out current post
  const otherPosts = allPosts.filter(
    (post) => !(post.slug === currentSlug && post.collection === currentCollection)
  );

  // Score each post
  const scoredPosts = otherPosts.map((post) => {
    let score = 0;

    // Same artist: +10 points
    if (currentArtist && post.artist && post.artist.toLowerCase() === currentArtist.toLowerCase()) {
      score += 10;
    }

    // Shared tags: +3 points per tag
    const sharedTags = post.tags.filter((tag) =>
      currentTags.some((ct) => ct.toLowerCase() === tag.toLowerCase())
    );
    score += sharedTags.length * 3;

    // Same collection: +2 points
    if (post.collection === currentCollection) {
      score += 2;
    }

    return {
      title: post.title,
      href: post.href,
      collection: post.collection,
      collectionLabel: collectionLabels[post.collection] ?? post.collection,
      date: post.date,
      score,
    };
  });

  // Sort by score (desc), then by date (desc)
  scoredPosts.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.date.valueOf() - a.date.valueOf();
  });

  // Return top N posts with score > 0
  return scoredPosts.filter((post) => post.score > 0).slice(0, limit);
}

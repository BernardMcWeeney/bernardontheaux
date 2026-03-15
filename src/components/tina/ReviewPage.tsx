import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { formatDate, formatRating, slugifyTag } from './helpers';

export default function ReviewPage(props: { query: string; variables: object; data: any }) {
  const { data } = useTina(props);
  const review = data.reviews;

  const typeLabels: Record<string, string> = {
    album: 'Album Review',
    gig: 'Gig Review',
    artist: 'Artist Review',
    single: 'Single Review',
    ep: 'EP Review',
    film: 'Film Review',
    other: 'Review',
  };

  const reviewLabel = 'Album Review';
  const displayTitle = review.artist ? `${review.artist} \u2014 ${review.title}` : review.title;
  const tags = review.tags ?? [];
  const rating = formatRating(review.rating);

  return (
    <div className="container">
      <div className="post-layout">
        <a className="post-back" href="/reviews/">&larr; Back to Reviews</a>

        <div className="album-hero">
          <div className="album-hero-art">
            {review.cover ? (
              <img src={review.cover} alt={displayTitle} data-tina-field={tinaField(review, 'cover')} />
            ) : (
              <div className="album-hero-art-placeholder">
                <svg className="ui-icon" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.3" /><circle cx="12" cy="12" r="2.1" /><path d="M20.2 12h1.8" /></svg>
              </div>
            )}
          </div>
          <div className="album-hero-info">
            <div className="album-hero-badge">
              <svg className="ui-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.3" /><circle cx="12" cy="12" r="2.1" /><path d="M20.2 12h1.8" /></svg>
              {' '}{reviewLabel}
            </div>
            <h1 className="album-hero-title" data-tina-field={tinaField(review, 'title')}>{displayTitle}</h1>
            <div className="album-hero-meta">
              <span data-tina-field={tinaField(review, 'review_date')}>{formatDate(review.review_date)}</span>
              {review.format && <span data-tina-field={tinaField(review, 'format')}>{review.format}</span>}
            </div>
            <div className="album-hero-rating" data-tina-field={tinaField(review, 'rating')}>
              <span className="album-hero-rating-number">{rating}</span>
              <span className="album-hero-rating-suffix">/10</span>
            </div>
          </div>
        </div>

        <div className="post-content">
          <div className="post-main">
            <div className="post-body" data-tina-field={tinaField(review, 'body')}>
              <TinaMarkdown content={review.body} />
            </div>
          </div>

          <aside className="post-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-card-title">Album Info</p>
              {review.artist && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Artist</span>
                  <span className="sidebar-item-value" data-tina-field={tinaField(review, 'artist')}>{review.artist}</span>
                </div>
              )}
              {review.release_year && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Year</span>
                  <span className="sidebar-item-value" data-tina-field={tinaField(review, 'release_year')}>{review.release_year}</span>
                </div>
              )}
              {review.format && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Format</span>
                  <span className="sidebar-item-value">{review.format}</span>
                </div>
              )}
              {review.label && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Label</span>
                  <span className="sidebar-item-value" data-tina-field={tinaField(review, 'label')}>{review.label}</span>
                </div>
              )}
              {review.listened_on && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Listened</span>
                  <span className="sidebar-item-value">{formatDate(review.listened_on)}</span>
                </div>
              )}
            </div>

            {review.standout_tracks && (
              <div className="sidebar-card">
                <p className="sidebar-card-title">Standout Tracks</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ink-secondary)', lineHeight: 1.6 }} data-tina-field={tinaField(review, 'standout_tracks')}>
                  {review.standout_tracks}
                </p>
              </div>
            )}

            {tags.length > 0 && (
              <div className="sidebar-card">
                <p className="sidebar-card-title">Tags</p>
                <div className="detail-tags" data-tina-field={tinaField(review, 'tags')}>
                  {tags.map((tag: string) => (
                    <a key={tag} href={`/tags/${slugifyTag(tag)}/`} className="detail-tag">{tag}</a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

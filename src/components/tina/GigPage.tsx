import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { formatDate, slugifyTag } from './helpers';

export default function GigPage(props: { query: string; variables: object; data: any }) {
  const { data } = useTina(props);
  const gig = data.gigs;
  const tags = gig.tags ?? [];

  return (
    <div className="container">
      <div className="post-layout">
        <a className="post-back" href="/gigs/">&larr; Back to Gigs</a>

        <div className="post-banner">
          {gig.cover ? (
            <img src={gig.cover} alt={gig.title} data-tina-field={tinaField(gig, 'cover')} />
          ) : (
            <div className="post-banner-placeholder">
              <svg className="ui-icon" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.7" y="4" width="6.4" height="16" rx="1.3" /><rect x="13.9" y="4" width="6.4" height="16" rx="1.3" /><circle cx="6.9" cy="9" r="1.25" /><circle cx="17.1" cy="9" r="1.25" /><circle cx="6.9" cy="15.3" r="1.8" /><circle cx="17.1" cy="15.3" r="1.8" /></svg>
            </div>
          )}
        </div>

        <div className="post-content">
          <div className="post-main">
            <header className="post-header-detail">
              <div className="post-collection-badge badge-gig">
                <svg className="ui-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.7" y="4" width="6.4" height="16" rx="1.3" /><rect x="13.9" y="4" width="6.4" height="16" rx="1.3" /><circle cx="6.9" cy="9" r="1.25" /><circle cx="17.1" cy="9" r="1.25" /><circle cx="6.9" cy="15.3" r="1.8" /><circle cx="17.1" cy="15.3" r="1.8" /></svg>
                {' '}Gig Diary
              </div>
              <h1 className="post-title-detail" data-tina-field={tinaField(gig, 'title')}>{gig.title}</h1>
              <div className="post-meta-strip">
                <span data-tina-field={tinaField(gig, 'event_date')}>{formatDate(gig.event_date)}</span>
                <span data-tina-field={tinaField(gig, 'venue')}>{gig.venue}</span>
                <span data-tina-field={tinaField(gig, 'city')}>{gig.city}</span>
              </div>
            </header>

            {gig.highlights && (
              <div className="highlights-callout">
                <p className="highlights-callout-title">Highlights</p>
                <p data-tina-field={tinaField(gig, 'highlights')}>{gig.highlights}</p>
              </div>
            )}

            <div className="post-body" data-tina-field={tinaField(gig, 'body')}>
              <TinaMarkdown content={gig.body} />
            </div>
          </div>

          <aside className="post-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-card-title">Event Info</p>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Artist</span>
                <span className="sidebar-item-value" data-tina-field={tinaField(gig, 'artist')}>{gig.artist}</span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Venue</span>
                <span className="sidebar-item-value">{gig.venue}</span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-item-label">City</span>
                <span className="sidebar-item-value">{gig.city}</span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Date</span>
                <span className="sidebar-item-value">{formatDate(gig.event_date)}</span>
              </div>
              {gig.tour && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Tour</span>
                  <span className="sidebar-item-value" data-tina-field={tinaField(gig, 'tour')}>{gig.tour}</span>
                </div>
              )}
              {gig.support && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Support</span>
                  <span className="sidebar-item-value" data-tina-field={tinaField(gig, 'support')}>{gig.support}</span>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="sidebar-card">
                <p className="sidebar-card-title">Tags</p>
                <div className="detail-tags" data-tina-field={tinaField(gig, 'tags')}>
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

import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { formatDate, slugifyTag } from './helpers';

export default function DeepDivePage(props: { query: string; variables: object; data: any }) {
  const { data } = useTina(props);
  const dive = data.deep_dives;
  const tags = dive.tags ?? [];

  return (
    <div className="container">
      <div className="post-layout">
        <a className="post-back" href="/deep-dives/">&larr; Back to Deep Dives</a>

        <div className="post-banner">
          {dive.cover ? (
            <img src={dive.cover} alt={dive.title} data-tina-field={tinaField(dive, 'cover')} />
          ) : (
            <div className="post-banner-placeholder">
              <svg className="ui-icon" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.3" y="7.2" width="17.4" height="10.6" rx="2" /><circle cx="8.3" cy="12.5" r="2.2" /><path d="M13.2 10.8h5.2" /><path d="M13.2 13.1h5.2" /><path d="M7.2 7.2 9.8 4.6h4.4" /></svg>
            </div>
          )}
        </div>

        <div className="post-content">
          <div className="post-main">
            <header className="post-header-detail">
              <div className="post-collection-badge badge-dive">
                <svg className="ui-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.3" y="7.2" width="17.4" height="10.6" rx="2" /><circle cx="8.3" cy="12.5" r="2.2" /><path d="M13.2 10.8h5.2" /><path d="M13.2 13.1h5.2" /><path d="M7.2 7.2 9.8 4.6h4.4" /></svg>
                {' '}Deep Dive
              </div>
              <h1 className="post-title-detail" data-tina-field={tinaField(dive, 'title')}>{dive.title}</h1>
              <div className="post-meta-strip">
                <span data-tina-field={tinaField(dive, 'published_on')}>{formatDate(dive.published_on)}</span>
                {dive.topic && <span data-tina-field={tinaField(dive, 'topic')}>{dive.topic}</span>}
                {dive.era && <span data-tina-field={tinaField(dive, 'era')}>{dive.era}</span>}
              </div>
            </header>

            <div className="post-body" data-tina-field={tinaField(dive, 'body')}>
              <TinaMarkdown content={dive.body} />
            </div>
          </div>

          <aside className="post-sidebar">
            {(dive.topic || dive.era) && (
              <div className="sidebar-card">
                <p className="sidebar-card-title">Details</p>
                {dive.topic && (
                  <div className="sidebar-item">
                    <span className="sidebar-item-label">Topic</span>
                    <span className="sidebar-item-value">{dive.topic}</span>
                  </div>
                )}
                {dive.era && (
                  <div className="sidebar-item">
                    <span className="sidebar-item-label">Era</span>
                    <span className="sidebar-item-value">{dive.era}</span>
                  </div>
                )}
              </div>
            )}

            {tags.length > 0 && (
              <div className="sidebar-card">
                <p className="sidebar-card-title">Tags</p>
                <div className="detail-tags" data-tina-field={tinaField(dive, 'tags')}>
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

import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { formatDate, slugifyTag } from './helpers';

export default function PlaylistPage(props: { query: string; variables: object; data: any }) {
  const { data } = useTina(props);
  const playlist = data.playlists;
  const tags = playlist.tags ?? [];

  return (
    <div className="container">
      <div className="post-layout">
        <a className="post-back" href="/playlists/">&larr; Back to Playlists</a>

        <div className="post-banner">
          {playlist.cover ? (
            <img src={playlist.cover} alt={playlist.title} data-tina-field={tinaField(playlist, 'cover')} />
          ) : (
            <div className="post-banner-placeholder">
              <svg className="ui-icon" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.3" y="7" width="17.4" height="10" rx="2" /><circle cx="9" cy="12" r="2.2" /><circle cx="15" cy="12" r="2.2" /><path d="M11.6 12h0.8" /><path d="M3.3 10.2h17.4" /></svg>
            </div>
          )}
        </div>

        <div className="post-content">
          <div className="post-main">
            <header className="post-header-detail">
              <div className="post-collection-badge badge-playlist">
                <svg className="ui-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.3" y="7" width="17.4" height="10" rx="2" /><circle cx="9" cy="12" r="2.2" /><circle cx="15" cy="12" r="2.2" /><path d="M11.6 12h0.8" /><path d="M3.3 10.2h17.4" /></svg>
                {' '}Playlist
              </div>
              <h1 className="post-title-detail" data-tina-field={tinaField(playlist, 'title')}>{playlist.title}</h1>
              <div className="post-meta-strip">
                <span data-tina-field={tinaField(playlist, 'published_on')}>{formatDate(playlist.published_on)}</span>
                <span className="platform-badge" data-tina-field={tinaField(playlist, 'platform')}>
                  <svg className="ui-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8 18.2a2.7 2.7 0 1 1 0-5.4c.6 0 1.2.2 1.7.5V6.5l8-1.7v8.8a2.7 2.7 0 1 1-1.3-2.3V6.8L10.9 8v10.2A2.7 2.7 0 0 1 8 21" /></svg>
                  {' '}{playlist.platform}
                </span>
                {playlist.mood && <span data-tina-field={tinaField(playlist, 'mood')}>{playlist.mood}</span>}
                {playlist.duration && <span>{playlist.duration} min</span>}
              </div>
            </header>

            {playlist.embed_url && (
              <div className="playlist-embed">
                <iframe
                  src={playlist.embed_url}
                  title="Playlist embed"
                  width="100%"
                  height={380}
                  loading="lazy"
                />
              </div>
            )}

            <div className="post-body" data-tina-field={tinaField(playlist, 'body')}>
              <TinaMarkdown content={playlist.body} />
            </div>
          </div>

          <aside className="post-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-card-title">Playlist Info</p>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Platform</span>
                <span className="sidebar-item-value">{playlist.platform}</span>
              </div>
              {playlist.duration && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Duration</span>
                  <span className="sidebar-item-value" data-tina-field={tinaField(playlist, 'duration')}>{playlist.duration} min</span>
                </div>
              )}
              {playlist.mood && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Mood</span>
                  <span className="sidebar-item-value">{playlist.mood}</span>
                </div>
              )}
              <div className="sidebar-item">
                <span className="sidebar-item-label">Link</span>
                <a href={playlist.playlist_url} className="sidebar-item-value" style={{ color: 'var(--accent)', textDecoration: 'underline' }} data-tina-field={tinaField(playlist, 'playlist_url')}>
                  Open playlist
                </a>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="sidebar-card">
                <p className="sidebar-card-title">Tags</p>
                <div className="detail-tags" data-tina-field={tinaField(playlist, 'tags')}>
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

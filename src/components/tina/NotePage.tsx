import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { formatDate, slugifyTag } from './helpers';

export default function NotePage(props: { query: string; variables: object; data: any }) {
  const { data } = useTina(props);
  const note = data.notes;
  const tags = note.tags ?? [];

  return (
    <div className="container">
      <div className="post-layout" style={{ maxWidth: '700px' }}>
        <a className="post-back" href="/notes/">&larr; Back to Notes</a>

        <header className="post-header-detail">
          <div className="post-collection-badge badge-note">
            <svg className="ui-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5.2 13.8a6.8 6.8 0 0 1 13.6 0" /><rect x="4.5" y="13.4" width="3.1" height="5.4" rx="1" /><rect x="16.4" y="13.4" width="3.1" height="5.4" rx="1" /><path d="M7.6 18.2a4.6 4.6 0 0 0 8.8 0" /></svg>
            {' '}Listening Note
          </div>
          <h1 className="post-title-detail" data-tina-field={tinaField(note, 'title')}>{note.title}</h1>
          <div className="post-meta-strip">
            <span data-tina-field={tinaField(note, 'listened_on')}>{formatDate(note.listened_on)}</span>
            {note.artist && <span data-tina-field={tinaField(note, 'artist')}>{note.artist}</span>}
            {note.source && <span data-tina-field={tinaField(note, 'source')}>{note.source}</span>}
          </div>
        </header>

        <div className="post-body" data-tina-field={tinaField(note, 'body')}>
          <TinaMarkdown content={note.body} />
        </div>

        {tags.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
            <div className="detail-tags" data-tina-field={tinaField(note, 'tags')}>
              {tags.map((tag: string) => (
                <a key={tag} href={`/tags/${slugifyTag(tag)}/`} className="detail-tag">{tag}</a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

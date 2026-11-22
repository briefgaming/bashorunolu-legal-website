/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Renders an article body. Raw HTML in the text is escaped, never executed. */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: label }) => {
            const external = /^https?:\/\//.test(href ?? '');
            return (
              <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {label}
              </a>
            );
          },
          img: ({ src, alt }) => <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" decoding="async" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

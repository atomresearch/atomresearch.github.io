import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { resolveCoverUrl } from "@/lib/posts";

export type ZoomTarget = { src: string; alt: string };

/**
 * Renders a post's Markdown: GitHub-flavoured Markdown, inline HTML and
 * LaTeX math. Wrap it in an element with the `prose-atom` class.
 *
 * The Markdown and KaTeX libraries are large; they live in this file so that
 * only blog posts load them.
 */
export function Markdown({
  content,
  onZoom,
}: {
  content: string;
  onZoom?: (target: ZoomTarget) => void;
}) {
  // A display equation written on one line ($$ ... $$) needs its own block.
  const markdown = content.replace(
    /^\s*\$\$(.+?)\$\$\s*$/gm,
    (_match, equation) => `\n$$\n${equation.trim()}\n$$\n`,
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        // An image on its own line becomes a figure; drop the wrapping <p>.
        p: ({ node, children }) => {
          const only = node?.children.length === 1 ? node.children[0] : null;
          const isFigure = only?.type === "element" && only.tagName === "img";
          return isFigure ? <>{children}</> : <p>{children}</p>;
        },
        img: ({ src, alt, title }) => {
          const resolved = resolveCoverUrl(src) ?? (src as string);
          const image = <img src={resolved} alt={alt ?? ""} loading="lazy" decoding="async" />;
          return (
            <figure>
              {onZoom ? (
                <button
                  type="button"
                  onClick={() => onZoom({ src: resolved, alt: alt ?? "" })}
                  aria-label={`Enlarge figure${alt ? `: ${alt}` : ""}`}
                  className="block w-full cursor-zoom-in rounded-[var(--radius)]"
                >
                  {image}
                </button>
              ) : (
                image
              )}
              {title && <figcaption>{title}</figcaption>}
            </figure>
          );
        },
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

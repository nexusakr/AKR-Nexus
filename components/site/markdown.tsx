import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders Markdown content with the AKR prose styles. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-akr max-w-none text-navy-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

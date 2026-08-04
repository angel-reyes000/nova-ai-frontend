import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  text: string;
};

export default function MarkdownRenderer({ text }: Props) {
  return (
    <div className="max-w-full overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return (
              <pre className="max-w-full overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm">
                {children}
              </pre>
            );
          },
          code({ children, className }) {
            return (
              <code
                className={`whitespace-pre-wrap break-words ${className || ""}`}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
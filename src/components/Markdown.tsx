import { FC } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MarkdownProps {
  content: string;
}

const Markdown: FC<MarkdownProps> = ({ content }) => {
  const renderers: Components = {
    h1: ({ children }) => (
      <h1 className="my-4 text-3xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="my-4 text-2xl font-bold">{children}</h2>
    ),
    p: ({ children }) => <p className="my-2">{children}</p>,
    b: ({ children }) => <b>{children}</b>,
    i: ({ children }) => <i>{children}</i>,
  };
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} components={renderers}>
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;

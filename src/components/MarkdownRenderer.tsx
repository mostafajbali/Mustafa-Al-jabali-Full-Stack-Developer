import React from 'react';

/**
 * Clean, lightweight Markdown renderer for project case studies & live preview
 */
export const MarkdownRenderer: React.FC<{ content: string; className?: string }> = ({
  content,
  className = '',
}) => {
  if (!content) {
    return <p className="text-slate-500 italic">No content written yet.</p>;
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-list`} className="space-y-2.5 my-4 pl-5 list-disc text-slate-300 leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx}>{formatInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const formatInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700/60"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(`line-${index}`);
      return;
    }

    if (line.startsWith('### ')) {
      flushList(`line-${index}`);
      elements.push(
        <h3 key={index} className="text-xl font-bold text-white tracking-tight mt-7 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      flushList(`line-${index}`);
      elements.push(
        <h2 key={index} className="text-2xl font-bold text-white tracking-tight mt-8 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      flushList(`line-${index}`);
      elements.push(
        <h1 key={index} className="text-3xl font-bold text-white tracking-tight mt-8 mb-4">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2));
    } else {
      flushList(`line-${index}`);
      elements.push(
        <p key={index} className="text-slate-300 leading-relaxed my-3 text-[15px]">
          {formatInline(line)}
        </p>
      );
    }
  });

  flushList('final');

  return <div className={className}>{elements}</div>;
};

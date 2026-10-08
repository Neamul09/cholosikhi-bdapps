import { useMemo } from 'react';
import { renderMarkdownAndMath } from '../sat/components/MathRenderer';
import { clsx } from 'clsx';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const processedHtml = useMemo(() => {
    return renderMarkdownAndMath(content);
  }, [content]);

  return (
    <div
      className={clsx(
        "prose dark:prose-invert max-w-none text-app-fg text-sm sm:text-base leading-relaxed select-text",
        className
      )}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}

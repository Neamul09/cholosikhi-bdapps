import React, { useMemo } from 'react';
import katex from 'katex';
import { clsx } from 'clsx';

interface MathRendererProps {
  content: string;
  isSerif?: boolean;
  className?: string;
  onClickWord?: (word: string) => void;
}

export default function MathRenderer({
  content,
  isSerif = false,
  className,
  onClickWord
}: MathRendererProps) {
  const processedHtml = useMemo(() => {
    if (!content) return '';

    // Decode common raw HTML entities so students don't see raw codes
    let text = content
      .replace(/&rsquo;/g, '’')
      .replace(/&lsquo;/g, '‘')
      .replace(/&ldquo;/g, '“')
      .replace(/&rdquo;/g, '”')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&hellip;/g, '…')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#160;/g, ' ')
      .replace(/&(?:deg|#176);/g, '°')
      .replace(/&(?:ang|#8736);/g, '∠')
      .replace(/&(?:pi|#960);/g, 'π')
      .replace(/&(?:le|#8804);/g, '≤')
      .replace(/&(?:ge|#8805);/g, '≥')
      .replace(/&(?:plusmn|#177);/g, '±')
      .replace(/&(?:minus|#8722);/g, '−')
      .replace(/&(?:times|#215);/g, '×')
      .replace(/&#9651;/g, '△')
      .replace(/&#62;/g, '>')
      .replace(/&#60;/g, '<')
      .replace(/&#175;/g, '¯');

    // Normalize deprecated MathML tags (e.g. <mfenced>, <menclose>) into modern MathML Core
    // Chromium removed support for <mfenced>, causing parentheses and brackets in equations to vanish.
    if (text.includes('<mfenced') || text.includes('<menclose')) {
      text = text.replace(/<menclose\s+notation=["']top["']>([\s\S]*?)<\/menclose>/gi, '<mover><mrow>$1</mrow><mo>&#175;</mo></mover>');
      const innermostMfencedRegex = /<mfenced([^>]*)>(((?!<mfenced)[\s\S])*?)<\/mfenced>/i;
      let safety = 0;
      while (innermostMfencedRegex.test(text) && safety < 50) {
        safety++;
        text = text.replace(innermostMfencedRegex, (_, attrs, innerContent) => {
          let open = '(';
          let close = ')';
          const openMatch = attrs.match(/open=["']([^"']*)["']/i);
          const closeMatch = attrs.match(/close=["']([^"']*)["']/i);
          if (openMatch) open = openMatch[1];
          if (closeMatch) close = closeMatch[1];
          return `<mrow><mo>${open}</mo>${innerContent}<mo>${close}</mo></mrow>`;
        });
      }
    }

    // Preserve all HTML/MathML tags so LaTeX regex never matches across tags like <mo>$</mo>
    const tagPlaceholders: string[] = [];
    text = text.replace(/<[^>]+>/g, (tag: string) => {
      const idx = tagPlaceholders.length;
      tagPlaceholders.push(tag);
      return `___HTML_TAG_${idx}___`;
    });

    // Display mode LaTeX: $$...$$ or \[...\]
    text = text.replace(/(?:\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\])/g, (_: string, math1?: string, math2?: string) => {
      const math = (math1 || math2 || '').trim();
      try {
        return katex.renderToString(math, { displayMode: true, throwOnError: false });
      } catch {
        return `$$${math}$$`;
      }
    });

    // Inline mode LaTeX: $...$ or \(...\)
    text = text.replace(/(?:\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\))/g, (_: string, math1?: string, math2?: string) => {
      const math = (math1 || math2 || '').trim();
      try {
        return katex.renderToString(math, { displayMode: false, throwOnError: false });
      } catch {
        return `$${math}$`;
      }
    });

    // Restore preserved tags
    text = text.replace(/___HTML_TAG_(\d+)___/g, (_: string, idx: string) => {
      return tagPlaceholders[parseInt(idx, 10)] || '';
    });

    return text;
  }, [content]);

  // Handle word clicking if vocabulary inspector callback is provided
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClickWord) return;
    const target = e.target as HTMLElement;
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 2) {
      onClickWord(selection);
      return;
    }
    // Or if clicked on an individual word
    const text = target.innerText?.trim();
    if (text && text.split(/\s+/).length === 1 && text.length > 3) {
      onClickWord(text.replace(/[^\w]/g, ''));
    }
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "prose dark:prose-invert max-w-none text-app-fg text-base sm:text-[17px] leading-relaxed select-text sat-question-content",
        isSerif ? "font-bluebook-serif" : "font-bluebook-sans",
        className
      )}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}

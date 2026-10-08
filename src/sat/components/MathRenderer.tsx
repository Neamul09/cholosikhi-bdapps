import React, { useMemo } from 'react';
import katex from 'katex';
import { clsx } from 'clsx';

interface MathRendererProps {
  content: string;
  isSerif?: boolean;
  className?: string;
  onClickWord?: (word: string) => void;
}

export function renderMarkdownAndMath(content: string): string {
  if (!content) return '';

  // 1. Decode common raw HTML entities
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

  // 2. Normalize deprecated MathML tags
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

  // 3. Preserve all existing HTML/MathML tags using non-markdown placeholders
  const tagPlaceholders: string[] = [];
  text = text.replace(/<[^>]+>/g, (tag: string) => {
    const idx = tagPlaceholders.length;
    tagPlaceholders.push(tag);
    return `%%HTML_TAG_${idx}%%`;
  });

  // 4. Extract and render KaTeX formulas to non-markdown placeholders
  const katexPlaceholders: string[] = [];

  // Display mode LaTeX: $$...$$ or \[...\]
  text = text.replace(/(?:\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\])/g, (_: string, math1?: string, math2?: string) => {
    const math = (math1 || math2 || '').trim();
    try {
      const rendered = katex.renderToString(math, { displayMode: true, throwOnError: false });
      const idx = katexPlaceholders.length;
      katexPlaceholders.push(rendered);
      return `%%KATEX_HOLDER_${idx}%%`;
    } catch {
      return `$$${math}$$`;
    }
  });

  // Inline mode LaTeX: $...$ or \(...\)
  text = text.replace(/(?:\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\))/g, (_: string, math1?: string, math2?: string) => {
    const math = (math1 || math2 || '').trim();
    try {
      const rendered = katex.renderToString(math, { displayMode: false, throwOnError: false });
      const idx = katexPlaceholders.length;
      katexPlaceholders.push(rendered);
      return `%%KATEX_HOLDER_${idx}%%`;
    } catch {
      return `$${math}$`;
    }
  });

  // 5. Parse Markdown Headings
  text = text.replace(/^### (.*$)/gim, '<h3 class="text-base sm:text-lg font-black text-blue-400 mt-3 mb-1.5">$1</h3>');
  text = text.replace(/^## (.*$)/gim, '<h2 class="text-lg sm:text-xl font-black text-blue-300 mt-4 mb-2">$1</h2>');
  text = text.replace(/^# (.*$)/gim, '<h1 class="text-xl sm:text-2xl font-black text-white mt-4 mb-2">$1</h1>');

  // 6. Parse Markdown Bold, Italic & Strikethrough
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-black text-app-fg"><em class="italic">$1</em></strong>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-black text-app-fg">$1</strong>');
  text = text.replace(/___(.+?)___/g, '<strong class="font-black text-app-fg"><em class="italic">$1</em></strong>');
  text = text.replace(/__(.+?)__/g, '<strong class="font-black text-app-fg">$1</strong>');
  text = text.replace(/\*([^*\n]+?)\*/g, '<em class="italic opacity-90">$1</em>');

  // 7. Parse Inline Code
  text = text.replace(/`([^`\n]+?)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-white/10 text-cyan-300 font-mono text-xs sm:text-sm border border-white/10">$1</code>');

  // 8. Parse Blockquotes
  text = text.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500/80 bg-blue-500/10 px-3.5 py-2 my-2 rounded-r-xl text-app-fg/90 italic">$1</blockquote>');

  // 9. Parse Bullet Lists (- or * or •)
  text = text.replace(/((?:^[ \t]*[-*•][ \t]+[^\n]+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split('\n')
      .map(item => `<li class="ml-4 list-disc space-y-1">${item.replace(/^[ \t]*[-*•][ \t]+/, '')}</li>`)
      .join('');
    return `<ul class="my-2 space-y-1 pl-2">${items}</ul>`;
  });

  // 10. Parse Numbered Lists (1. or ১.)
  text = text.replace(/((?:^[ \t]*(?:\d+|[০-৯]+)\.[ \t]+[^\n]+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split('\n')
      .map(item => `<li class="ml-4 list-decimal space-y-1">${item.replace(/^[ \t]*(?:\d+|[০-৯]+)\.[ \t]+/, '')}</li>`)
      .join('');
    return `<ol class="my-2 space-y-1 pl-2">${items}</ol>`;
  });

  // 11. Paragraphs and Line Breaks
  const paragraphs = text.split(/\n\n+/);
  text = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (
      trimmed.startsWith('<h1') ||
      trimmed.startsWith('<h2') ||
      trimmed.startsWith('<h3') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<blockquote')
    ) {
      return trimmed;
    }
    return `<p class="my-1.5 leading-relaxed">${trimmed.replace(/\n/g, '<br/>')}</p>`;
  }).filter(Boolean).join('');

  // 12. Restore KaTeX placeholders safely
  text = text.replace(/%%KATEX_HOLDER_(\d+)%%/g, (_, idx) => {
    return katexPlaceholders[parseInt(idx, 10)] || '';
  });

  // 13. Restore HTML tag placeholders safely
  text = text.replace(/%%HTML_TAG_(\d+)%%/g, (_, idx) => {
    return tagPlaceholders[parseInt(idx, 10)] || '';
  });

  return text;
}

export default function MathRenderer({
  content,
  isSerif = false,
  className,
  onClickWord
}: MathRendererProps) {
  const processedHtml = useMemo(() => {
    return renderMarkdownAndMath(content);
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

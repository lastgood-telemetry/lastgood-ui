import React from "react";

// Small renderer for the markdown subset used in docs/: headings, paragraphs,
// lists, tables, fenced code, inline code, bold and links. Output is built as
// React elements, never raw HTML.
const inline = (text, keyPrefix) => {
  const parts = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const t = m[0], key = `${keyPrefix}-${i++}`;
    if (m[1]) parts.push(<code key={key} className="px-1 py-0.5 rounded bg-white/10 text-accent font-mono text-[0.85em]">{t.slice(1, -1)}</code>);
    else if (m[2]) parts.push(<strong key={key} className="text-white">{t.slice(2, -2)}</strong>);
    else {
      const [, label, href] = t.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const safe = /^(https?:\/\/|\/)/.test(href);
      parts.push(safe ? <a key={key} href={href} className="text-accent underline" target="_blank" rel="noopener noreferrer">{label}</a> : label);
    }
    last = m.index + t.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

const cells = line => line.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());

export function parseMarkdown(src) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith("```")) {
      const code = []; i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push({ type: "code", text: code.join("\n") });
    } else if (/^#{1,3} /.test(line)) {
      const level = line.match(/^#+/)[0].length;
      blocks.push({ type: "h", level, text: line.replace(/^#+ /, "") }); i++;
    } else if (line.trim().startsWith("|") && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] || "")) {
      const head = cells(line); i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      blocks.push({ type: "table", head, rows });
    } else if (/^\s*([-*]|\d+\.) /.test(line)) {
      const ordered = /^\s*\d+\. /.test(line), items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.) /.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.) /, ""));
      blocks.push({ type: "list", ordered, items });
    } else {
      const para = [];
      while (i < lines.length && lines[i].trim() && !/^(```|#{1,3} |\s*([-*]|\d+\.) |\s*\|)/.test(lines[i])) para.push(lines[i++]);
      if (!para.length) { para.push(lines[i++]); }
      blocks.push({ type: "p", text: para.join(" ") });
    }
  }
  return blocks;
}

export default function Markdown({ source }) {
  const blocks = React.useMemo(() => parseMarkdown(source), [source]);
  const [copied, setCopied] = React.useState(null);
  const copy = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };
  return (
    <div className="text-sm text-zinc-300 leading-relaxed space-y-4">
      {blocks.map((b, idx) => {
        if (b.type === "h") {
          const cls = b.level === 1 ? "text-2xl font-bold text-white" : b.level === 2 ? "text-lg font-bold text-white pt-4 border-t border-white/10" : "text-base font-semibold text-white pt-2";
          return React.createElement(`h${b.level}`, { key: idx, className: cls }, inline(b.text, idx));
        }
        if (b.type === "p") return <p key={idx}>{inline(b.text, idx)}</p>;
        if (b.type === "list") {
          const Tag = b.ordered ? "ol" : "ul";
          return <Tag key={idx} className={`pl-5 space-y-1.5 ${b.ordered ? "list-decimal" : "list-disc"}`}>{b.items.map((it, j) => <li key={j}>{inline(it, `${idx}-${j}`)}</li>)}</Tag>;
        }
        if (b.type === "code") return (
          <div key={idx} className="relative bg-[#101413] border border-white/10 rounded-xl">
            <button onClick={() => copy(b.text, idx)} className="absolute top-2 right-2 px-2 py-1 text-[10px] font-mono uppercase text-zinc-400 hover:text-white bg-white/5 border border-white/10 rounded">{copied === idx ? "Copied" : "Copy"}</button>
            <pre className="p-4 pr-16 overflow-x-auto text-xs font-mono text-zinc-200"><code>{b.text}</code></pre>
          </div>
        );
        if (b.type === "table") return (
          <div key={idx} className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-zinc-400"><tr>{b.head.map((h, j) => <th key={j} className="px-3 py-2 font-mono uppercase tracking-wider">{inline(h, `${idx}h${j}`)}</th>)}</tr></thead>
              <tbody className="divide-y divide-white/10">{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k} className="px-3 py-2 align-top">{inline(c, `${idx}-${j}-${k}`)}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
        return null;
      })}
    </div>
  );
}

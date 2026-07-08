import React, { useState } from "react";
import { Copy, Check, Download, FileText, ChevronRight, CheckCircle2 } from "lucide-react";

interface DocumentViewerProps {
  filename: string;
  content: string;
  accentColor: string;
}

export default function DocumentViewer({ filename, content, accentColor }: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<"rendered" | "raw">("rendered");

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to parse Markdown content and render it as styled React elements
  const renderStyledMarkdown = (text: string) => {
    const lines = text.split("\n");
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Table handling
      if (trimmed.startsWith("|")) {
        inTable = true;
        const cells = trimmed
          .split("|")
          .map((c) => c.trim())
          .filter((_, i, arr) => i > 0 && i < arr.length - 1);

        // Check if it's the divider row e.g. |:---|:---|
        if (cells.every((c) => c.startsWith(":") || c.startsWith("-") || c.endsWith("-"))) {
          return; // skip divider
        }

        if (tableHeaders.length === 0) {
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        // Table finished, render table
        inTable = false;
        if (tableHeaders.length > 0) {
          const currentHeaders = [...tableHeaders];
          const currentRows = [...tableRows];
          elements.push(
            <div key={`table-${idx}`} className="my-5 overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800">
                    {currentHeaders.map((cell, cidx) => (
                      <th key={cidx} className="p-3 text-slate-200 font-mono font-semibold">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {currentRows.map((row, ridx) => (
                    <tr key={ridx} className="hover:bg-slate-900/40 transition-colors">
                      {row.map((cell, cidx) => (
                        <td key={cidx} className="p-3 text-slate-300 font-sans">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        tableHeaders = [];
        tableRows = [];
      }

      // Empty space
      if (!trimmed) {
        elements.push(<div key={`space-${idx}`} className="h-2" />);
        return;
      }

      // Headers
      if (trimmed.startsWith("# ")) {
        elements.push(
          <h1 key={`h1-${idx}`} className="text-xl md:text-2xl font-sans font-bold text-white tracking-tight mt-6 mb-3 border-b border-slate-800 pb-2 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded" style={{ backgroundColor: accentColor }} />
            {trimmed.slice(2)}
          </h1>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={`h2-${idx}`} className="text-base md:text-lg font-sans font-semibold text-slate-100 tracking-tight mt-5 mb-2.5 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded" style={{ backgroundColor: `${accentColor}80` }} />
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={`h3-${idx}`} className="text-xs md:text-sm font-mono font-semibold uppercase tracking-wider text-rose-400 mt-4 mb-2" style={{ color: accentColor }}>
            {trimmed.slice(4)}
          </h3>
        );
      }
      // Blockquotes
      else if (trimmed.startsWith(">")) {
        const quoteText = trimmed.replace(/^>\s*/, "");
        const isNotice = quoteText.includes("NOTICE") || quoteText.includes("STANDARDS") || quoteText.includes("PROFILE");
        elements.push(
          <div
            key={`quote-${idx}`}
            className="my-3 pl-4 py-2 rounded-r-lg border-l-2 text-xs leading-relaxed"
            style={{
              borderColor: isNotice ? accentColor : "#334155",
              backgroundColor: isNotice ? `${accentColor}06` : "rgba(30, 41, 59, 0.15)",
              color: isNotice ? "#e2e8f0" : "#94a3b8"
            }}
          >
            {quoteText}
          </div>
        );
      }
      // Bullet points
      else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        elements.push(
          <div key={`bullet-${idx}`} className="flex items-start gap-2.5 my-1.5 text-xs text-slate-300 font-sans leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accentColor }} />
            <span>{trimmed.slice(2)}</span>
          </div>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s+/.test(trimmed)) {
        const numMatch = trimmed.match(/^(\d+)\.\s+/);
        const num = numMatch ? numMatch[1] : "1";
        const rest = trimmed.replace(/^\d+\.\s+/, "");
        elements.push(
          <div key={`num-${idx}`} className="flex items-start gap-2 my-1.5 text-xs text-slate-300 font-sans leading-relaxed">
            <span className="font-mono font-bold text-xs shrink-0 w-5 text-slate-500">{num}.</span>
            <span>{rest}</span>
          </div>
        );
      }
      // Code block lines (Skip the standard backticks lines but styles them inside)
      else if (trimmed.startsWith("```")) {
        // Just empty indicator to balance
      }
      // General paragraph text
      else {
        // Highlight inline code patterns
        const parts = trimmed.split(/(`[^`]+`)/g);
        const parsedLine = parts.map((part, pidx) => {
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code key={pidx} className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-slate-300 font-semibold mx-0.5">
                {part.slice(1, -1)}
              </code>
            );
          }
          // Highlight double bold patterns
          const subParts = part.split(/(\*\*[^*]+\*\*)/g);
          return subParts.map((sp, sidx) => {
            if (sp.startsWith("**") && sp.endsWith("**")) {
              return (
                <strong key={`${pidx}-${sidx}`} className="text-white font-semibold">
                  {sp.slice(2, -2)}
                </strong>
              );
            }
            return sp;
          });
        });

        elements.push(
          <p key={`p-${idx}`} className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed my-2.5">
            {parsedLine}
          </p>
        );
      }
    });

    return <div className="space-y-1">{elements}</div>;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[520px]" id="document-viewer">
      {/* File Header */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-slate-900 rounded border border-slate-800 text-slate-400">
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-semibold text-white">{filename}</h4>
            <p className="text-[10px] text-slate-400">Governance Doc Draft</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Modes */}
          <div className="flex bg-slate-900 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setPreviewMode("rendered")}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                previewMode === "rendered" ? "bg-slate-950 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setPreviewMode("raw")}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                previewMode === "raw" ? "bg-slate-950 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Raw MD
            </button>
          </div>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Actions */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Raw Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Download Markdown File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 relative">
        {previewMode === "raw" ? (
          <div className="h-full font-mono text-[11px] leading-relaxed text-slate-400 bg-slate-950 rounded-lg p-4 border border-slate-900 overflow-x-auto select-text selection:bg-slate-800">
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none select-text selection:bg-slate-800">
            {renderStyledMarkdown(content)}
          </div>
        )}
      </div>

      {/* Footer Status bar */}
      <div className="bg-slate-950/60 border-t border-slate-800/60 px-5 py-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>CI compliance checked</span>
        </div>
        <span>{content.length.toLocaleString()} bytes</span>
      </div>
    </div>
  );
}

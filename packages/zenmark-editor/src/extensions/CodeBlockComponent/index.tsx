import { useEffect, useMemo, useRef, useState } from "react";
import "../../css/CodeBlockComponent.scss";

import { copyToClipboard } from "@/common/copyToClipboard";
import LanguageSelect from "@/extensions/CodeBlockComponent/LanguageSelect";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

// We import mermaid as a module so we get proper typings and can rely on the
// official config schema, but we still keep the initialization guarded so it
// only runs in the browser.
import mermaid from "mermaid";

// Avoid re-initializing mermaid for every node view
let mermaidInitialized = false;

const initMermaid = () => {
  if (typeof window === "undefined") return;
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    // Ensure a consistent base font size across diagrams
    fontSize: 14,
    // Use Mermaid's theming options so text size looks consistent across
    // different diagram types, which is how it's typically done in
    // docs/wiki platforms that embed Mermaid.
    theme: "default",
    themeVariables: {
      fontSize: "14px",
      lineHeight: 1.4,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    flowchart: {
      useMaxWidth: true,
    },
    sequence: {
      useMaxWidth: true,
    },
    gantt: {
      useMaxWidth: true,
      // Aggressively increase bar height and spacing so that short Gantt
      // charts (few tasks) don't look disproportionately flat compared to
      // other diagram types. These keys are standard Mermaid config.
      barHeight: 40,
      barGap: 12,
      topPadding: 40,
      gridLineStartPadding: 35,
      fontSize: 14,
    },
    pie: {
      useMaxWidth: true,
    },
  });
  mermaidInitialized = true;
};

export default ({ node, updateAttributes, extension }) => {
  const {
    attrs: { language, ...rest },
  } = node;
  const [copied, setCopied] = useState(false);
  const code: string = node.textContent || "";
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isMermaid = language === "mermaid";

  const languageOptions: string[] = useMemo(() => {
    const base: string[] = extension?.options?.lowlight?.listLanguages?.() || [];
    // Ensure we always show the current language (e.g. "mermaid") even if
    // lowlight doesn't know about it.
    const extra = language && !base.includes(language) ? [language] : [];
    // Offer "mermaid" explicitly so users can pick it from the dropdown.
    const mermaidExtra = base.includes("mermaid") || language === "mermaid" ? [] : ["mermaid"];
    return Array.from(new Set([...base, ...extra, ...mermaidExtra]));
  }, [extension?.options?.lowlight, language]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3 * 1000);
    }
  }, [copied]);

  useEffect(() => {
    if (!isMermaid) {
      setSvg(null);
      setError(null);
      return;
    }
    if (!code?.trim()) {
      setSvg(null);
      setError(null);
      return;
    }

    initMermaid();

    let cancelled = false;
    const render = async () => {
      try {
        const id =
          `mermaid-${node.attrs.id || Math.random().toString(36).slice(2)}`;
        if (typeof window === "undefined") return;
        const result = await mermaid.render(id, code);
        if (!cancelled) {
          setSvg(result.svg);
          setError(null);
        }
      } catch (e: any) {
        console.error("Mermaid render error:", e);
        if (!cancelled) {
          setSvg(null);
          setError(e?.message || "Failed to render mermaid diagram");
        }
      }
    };

    render();

    return () => {
      cancelled = true;
    };
    // It's safe to depend only on `code` and `isMermaid` here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, isMermaid]);

  return (
    <NodeViewWrapper className="code-block hover-action">
      <pre>
        <div className="bar">
          <LanguageSelect
            value={language || "auto"}
            onChange={(e) => {
              updateAttributes({ language: e.target.value });
            }}
            languages={languageOptions}
          />
          <div className="right hover-visible">
            {copied ? (
              <div className="copied-text" style={{ color: "gray" }}>
                ✅
              </div>
            ) : (
              <div
                className="copy-button"
                onClick={() => {
                  copyToClipboard(code);
                  setCopied(true);
                }}
              >
                📋
              </div>
            )}
          </div>
        </div>
        <div className="code-wrapper">
          {/* Render code content inside a <code> tag; NodeViewContent default
              is a <div>, which is fine here and keeps the generic typing
              simple. */}
          <code style={{ whiteSpace: "pre" }}>
            <NodeViewContent />
          </code>
        </div>
        {isMermaid && (
          <div
            ref={containerRef}
            className="mermaid-preview-wrapper"
          >
            {error && (
              <div className="mermaid-error">
                {error}
              </div>
            )}
            {!error && svg && (
              <div
                className="mermaid-preview"
                // Mermaid returns an SVG string
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )}
          </div>
        )}
      </pre>
    </NodeViewWrapper>
  );
};

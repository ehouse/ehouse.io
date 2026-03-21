import { useState } from "react";
import { createRoot } from "react-dom/client";
import { exec } from "mini-diceroller";
import type { Expression, EvaluatedExpression } from "mini-diceroller";
import type { ProjectMeta } from "../../pages/projects";
import { Nav } from "../../components/nav";
import { Layout } from "../../components/layout";
import { ProjectHeader } from "../../components/project-header";
import { html, css } from "../../html";

export const meta: ProjectMeta = {
  slug: "mini-diceroller",
  title: "D&D Dice Roller Language",
  tag: "React",
  description:
    "A tiny expression language for D&D dice notation, with support for advantage, disadvantage, and arithmetic.",
  photo:
    "https://images.unsplash.com/photo-1650024520226-b63a33baff60?q=80&w=800&auto=format&fit=crop",
};

export function render(): string {
  return Layout(html`
    ${Nav("projects")}
    <main class="section">
      <div class="post-panel">
        ${ProjectHeader(meta)}
        <div class="post-body">
          <p>
            mini-diceroller is a TypeScript library for parsing and evaluating
            dice notation expressions. It uses a custom grammar built on
            <a href="https://github.com/microsoft/ts-parsec"
              >typescript-parsec</a
            >
            and supports a range of expression types:
          </p>
          <p>
            Every roll also reports its theoretical min, max, and average which
            is useful for quickly sizing up damage ranges or spell efficiency at
            the table.
          </p>
          <ul>
            <li>Standard dice rolls: <code>1d20</code>, <code>3d6</code></li>
            <li>Arithmetic: <code>2d6 + 3</code>, <code>1d8 - 1</code></li>
            <li>Grouping: <code>(1d4 + 1) * 2</code></li>
            <li>
              Advantage / disadvantage: <code>^d20</code> / <code>vd20</code>
            </li>
          </ul>
        </div>
        <div id="mount" class="embed-mount"></div>
        <div class="page-actions">
          <a href="/projects" data-link class="btn btn-ghost">
            Back to projects
          </a>
          <div class="link-group">
            <a
              href="https://github.com/ehouse/mini-diceroller"
              class="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://1d20.io"
              class="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              1d20.io
            </a>
          </div>
        </div>
      </div>
    </main>
  `);
}

const STYLES = css`
  :host {
    display: block;
    font-family: system-ui, sans-serif;
  }
  .row {
    display: flex;
    gap: 0.5rem;
  }
  input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    font-family: monospace;
    border: 2px solid #ccc;
    border-radius: 4px;
  }
  input:focus {
    outline: none;
    border-color: #666;
  }
  button {
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
    background: #222;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background: #444;
  }
  .error {
    margin-top: 0.75rem;
    color: #c00;
    font-size: 0.875rem;
  }
  .result {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    min-height: 3.5rem;
  }
  .total {
    font-size: 2rem;
    font-weight: bold;
    line-height: 1;
    min-width: 2.5rem;
    color: #111;
  }
  .total.empty {
    color: #ccc;
  }
  .result-meta {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1;
  }
  .breakdown {
    font-family: monospace;
    font-size: 0.9rem;
    color: #555;
  }
  .stats {
    font-size: 0.75rem;
    color: #999;
  }
`;

function formatExpr(ex: Expression): string {
  switch (ex.tag) {
    case "number":
      return `${ex.n}`;
    case "rollValue":
      return `[${ex.results.join(", ")}]`;
    case "math":
      return `${formatExpr(ex.left)} ${ex.op} ${formatExpr(ex.right)}`;
    default:
      return "";
  }
}

function App() {
  const [input, setInput] = useState("2d6 + 3");
  const [result, setResult] = useState<EvaluatedExpression | null>(null);
  const [error, setError] = useState<string | null>(null);

  function roll() {
    try {
      setError(null);
      setResult(exec(input));
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Invalid expression");
    }
  }

  return (
    <div>
      <div className="row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && roll()}
          placeholder="e.g. 2d6 + 3"
          spellCheck={false}
          autoComplete="off"
        />
        <button onClick={roll}>Roll</button>
      </div>
      <div className="result">
        <div className={`total${result ? "" : " empty"}`}>
          {result ? result.v : "--"}
        </div>
        <div className="result-meta">
          {error && <div className="error">{error}</div>}
          {result && (
            <>
              <div className="breakdown">{formatExpr(result.ex)}</div>
              <div className="stats">
                min {result.stats.min} / max {result.stats.max} / avg{" "}
                {Math.round(result.stats.avg * 100) / 100}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function mount(shadow: ShadowRoot): () => void {
  const style = document.createElement("style");
  style.textContent = STYLES;
  shadow.appendChild(style);
  const container = document.createElement("div");
  shadow.appendChild(container);
  const root = createRoot(container);
  root.render(<App />);
  return () => root.unmount();
}

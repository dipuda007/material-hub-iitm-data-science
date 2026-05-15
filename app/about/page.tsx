import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "About",
  description: "About Material Hub IITM and how to manage your study materials.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="About"
        title="What is Material Hub?"
        description="A clean, fast personal hub for your IITM BS Data Science study material."
      />
      <article className="prose-invert space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Material Hub IITM</strong> is a
          custom Google-Drive-style frontend for organizing your course
          notes, PDFs, Drive links and YouTube videos. There&apos;s no backend
          and no database — everything lives in a single editable JSON file in
          this repo.
        </p>

        <Section title="How data works">
          <p>
            Open <Code>data/courses.json</Code> in your editor and add or
            update entries. Each course has folders, and each folder has
            materials. A material has a <Code>type</Code>{" "}
            (<Code>pdf</Code>, <Code>drive</Code>, <Code>video</Code>, or{" "}
            <Code>website</Code>) and a <Code>url</Code>.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs text-foreground/90">
{`{
  "id": "mlf",
  "name": "Machine Learning Foundations",
  "icon": "Brain",
  "folders": [
    {
      "name": "Week 1",
      "materials": [
        {
          "title": "Lecture Notes",
          "type": "drive",
          "url": "https://drive.google.com/..."
        }
      ]
    }
  ]
}`}
          </pre>
        </Section>

        <Section title="Embedding">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Google Drive links are auto-converted into a preview iframe.
            </li>
            <li>YouTube links are embedded as players.</li>
            <li>PDFs open in an embedded viewer.</li>
            <li>Everything else opens in a new tab.</li>
          </ul>
        </Section>

        <Section title="Favorites & recents">
          <p>
            Stars and history are stored in <Code>localStorage</Code> on your
            device — they never leave your browser.
          </p>
        </Section>

        <Section title="Shortcuts">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <Code>⌘K</Code> or <Code>Ctrl+K</Code> — open command palette.
            </li>
            <li>
              <Code>↑</Code> / <Code>↓</Code> — navigate results.
            </li>
            <li>
              <Code>Enter</Code> — open selected.
            </li>
            <li>
              <Code>Esc</Code> — close dialogs.
            </li>
          </ul>
        </Section>

        <Section title="Deploy">
          <p>
            Push this repo to GitHub, then import it on{" "}
            <a href="https://vercel.com/new" className="text-foreground underline">
              vercel.com/new
            </a>
            . No environment variables required.
          </p>
        </Section>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/5 px-1.5 py-0.5 text-[12px] text-foreground">
      {children}
    </code>
  );
}

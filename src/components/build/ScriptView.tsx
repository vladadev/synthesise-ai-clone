import clsx from "clsx";
import type { Script, ScriptBlock, ScriptSection } from "@/lib/types";

/**
 * Step 2's output: the reading view. Sections land one at a time while the
 * stream runs, which is why each one animates in rather than the page swapping.
 */
export function ScriptView({
  meta,
  sections,
  streaming,
}: {
  meta: {
    title: string;
    subtitle: string;
    framework: string;
    premise: string;
  } | null;
  sections: ScriptSection[];
  streaming: boolean;
}) {
  if (!meta) return null;

  return (
    <article className="mx-auto w-full max-w-[1180px]">
      <header className="animate-rise">
        <h1 className="text-[30px] leading-[1.18] font-semibold tracking-[-0.022em] text-ink lg:text-[34px]">
          {meta.title}
        </h1>
        <p className="mt-2 text-[14px] text-muted">{meta.subtitle}</p>
      </header>

      <div className="mt-8">
        {sections.map((section, i) => (
          <section key={section.id} className="animate-rise">
            {i === 0 && (
              <div className="mb-7">
                <p className="text-[14.5px] font-semibold text-ink">
                  {meta.framework}
                </p>
                <p className="mt-2 text-[15px] leading-[1.75] text-ink-soft">
                  {meta.premise}
                </p>
              </div>
            )}

            <h2
              className={clsx(
                "text-[11.5px] font-semibold tracking-[0.14em] text-faint uppercase",
                i > 0 && "mt-12",
              )}
            >
              {section.heading}
            </h2>

            <div className="mt-4 flex flex-col gap-4">
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {streaming && (
        <p className="mt-10 text-[13px] text-muted caret">Writing</p>
      )}
    </article>
  );
}

function Block({ block }: { block: ScriptBlock }) {
  switch (block.kind) {
    case "h":
      return (
        <h3 className="mt-3 text-[16px] font-semibold text-ink">{block.text}</h3>
      );

    case "ul":
      return (
        <ul className="flex flex-col gap-2 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-[1.7] text-ink-soft">
              <span
                aria-hidden="true"
                className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand-300"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <p className="border-l-2 border-brand-200 pl-4 text-[15px] leading-[1.75] font-medium text-ink italic">
          {block.text}
        </p>
      );

    case "callout":
      return (
        <p className="mt-2 rounded-lg bg-ink px-5 py-3.5 text-[13.5px] leading-relaxed font-medium text-white">
          {block.text}
        </p>
      );

    default:
      return (
        <p className="text-[15px] leading-[1.75] text-ink-soft">{block.text}</p>
      );
  }
}

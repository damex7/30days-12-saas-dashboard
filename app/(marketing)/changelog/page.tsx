import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { PageIntro } from '@/components/marketing/page-intro'
import { Badge } from '@/components/ui/badge'
import { getChangelog } from '@/lib/data'
import { formatDate } from '@/lib/dates'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'New features, improvements and fixes in Owó.',
}

const tone = { New: 'brand', Improved: 'accent', Fixed: 'neutral' } as const

export default async function ChangelogPage() {
  const entries = await getChangelog()
  return (
    <>
      <PageIntro eyebrow="Changelog" title="What’s new in Owó" description="Small improvements every couple of weeks." />
      <Container size="reading" className="py-16">
        <ol className="relative space-y-12 border-l border-line pl-6 sm:pl-8">
          {entries.map((entry) => (
            <li key={entry.version} className="relative">
              <span aria-hidden className="absolute top-1.5 -left-[1.95rem] size-3 rounded-pill border-2 border-surface bg-brand sm:-left-[2.45rem]" />
              <article aria-labelledby={`v${entry.version}`}>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                  <span aria-hidden>·</span>
                  <span className="font-mono">v{entry.version}</span>
                  <Badge tone={tone[entry.tag]}>{entry.tag}</Badge>
                </div>
                <h2 id={`v${entry.version}`} className="mt-2 text-2xl font-extrabold text-ink">
                  {entry.title}
                </h2>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted marker:text-accent">
                  {entry.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </Container>
    </>
  )
}

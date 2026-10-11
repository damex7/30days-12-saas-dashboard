import { AlertTriangle, CircleCheckBig, Hourglass, Wallet } from 'lucide-react'
import { statCardProps, StatCard } from '@/components/app/stat-card'
import { getDashboardStats } from '@/lib/data'
import { first } from '@/lib/url'

// @stats SLOT: the four headline numbers. Loads on its own, with its own
// skeleton (loading.tsx) and error state (error.tsx) in this folder.

const icons = [<Wallet key="w" />, <Hourglass key="h" />, <AlertTriangle key="a" />, <CircleCheckBig key="c" />]

export default async function StatsSlot({ searchParams }: PageProps<'/dashboard'>) {
  const [stats, query] = await Promise.all([getDashboardStats(), searchParams])
  // Learning aid: /dashboard?fail=stats makes only this panel fail.
  if (first(query.fail) === 'stats') throw new Error('Simulated failure in the @stats slot (?fail=stats)')

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...statCardProps(stat)} icon={icons[i]} />
      ))}
    </div>
  )
}

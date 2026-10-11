import { UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'

// NOT FOUND for /clients/[id]: specific to clients, and still inside the app shell.
export default function ClientNotFound() {
  return (
    <Card>
      <EmptyState
        icon={<UserX />}
        title="We couldn’t find that client"
        description="They may have been removed, or the link is wrong."
        action={<Button href="/clients">All clients</Button>}
      />
    </Card>
  )
}

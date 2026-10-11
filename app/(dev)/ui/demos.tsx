// CLIENT COMPONENT demos for /ui: anything with open/close state or
// event handlers. The rest of the showcase page is a Server Component.
'use client'

import { Bell, Copy, LogOut, Pencil, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { DropdownMenu, MenuItem, MenuLabel, MenuSeparator } from '@/components/ui/dropdown-menu'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/form-controls'
import { useToast } from '@/components/ui/toast'
import { Tooltip } from '@/components/ui/tooltip'

export function DialogDemo() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [drawer, setDrawer] = useState(false)
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog with a form
      </Button>
      <Button variant="danger" onClick={() => setConfirm(true)}>
        <Trash2 aria-hidden /> Delete invoice…
      </Button>
      <Button variant="secondary" onClick={() => setDrawer(true)}>
        Open drawer (side=&quot;left&quot;)
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Rename client"
        description="Shown on every invoice for this client."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </>
        }
      >
        <Field name="demo-client-name" label="Client name">
          {(control) => <Input {...control} defaultValue="Coal City Coffee" />}
        </Field>
      </Dialog>

      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        size="sm"
        title="Delete INV-0042?"
        description="This can’t be undone. Your client keeps any copy they already have."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={() => setConfirm(false)}>
              Delete invoice
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">Focus started on the first button inside; press Esc or click outside to close, and focus returns to the button that opened this.</p>
      </Dialog>

      <Dialog open={drawer} onClose={() => setDrawer(false)} side="left" title="Drawer">
        <p className="text-sm text-muted">The same Dialog with side=&quot;left&quot;. The app uses it for navigation on phones.</p>
      </Dialog>
    </div>
  )
}

export function DropdownDemo() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap items-start gap-3">
      <DropdownMenu
        align="start"
        triggerClassName="inline-flex h-10 items-center gap-2 rounded-control border border-line-strong bg-raised px-4 text-sm font-semibold text-ink hover:bg-sunken"
        trigger={<>Invoice actions ▾</>}
      >
        <MenuLabel>INV-0042</MenuLabel>
        <MenuItem onSelect={() => toast({ title: 'Edit', tone: 'info' })}>
          <Pencil aria-hidden /> Edit
        </MenuItem>
        <MenuItem onSelect={() => toast({ title: 'Duplicated', tone: 'info' })}>
          <Copy aria-hidden /> Duplicate
        </MenuItem>
        <MenuItem href="/ui#dropdown">
          <Settings aria-hidden /> A link item
        </MenuItem>
        <MenuSeparator />
        <MenuItem tone="danger" onSelect={() => toast({ title: 'Deleted (not really)', tone: 'error' })}>
          <Trash2 aria-hidden /> Delete
        </MenuItem>
      </DropdownMenu>
      <DropdownMenu
        align="start"
        triggerClassName="grid size-10 place-items-center rounded-control border border-line-strong bg-raised text-muted hover:text-ink"
        trigger={
          <>
            <Bell aria-hidden className="size-5" />
            <span className="sr-only">Notifications</span>
          </>
        }
      >
        <MenuLabel>Icon-only trigger</MenuLabel>
        <MenuItem onSelect={() => {}}>Arrow keys move</MenuItem>
        <MenuItem onSelect={() => {}}>Type a letter to jump</MenuItem>
        <MenuItem onSelect={() => {}}>
          <LogOut aria-hidden /> Esc closes, focus returns
        </MenuItem>
      </DropdownMenu>
    </div>
  )
}

export function TooltipDemo() {
  return (
    <div className="flex flex-wrap gap-6 pt-8">
      {(['top', 'right', 'bottom'] as const).map((side) => (
        <Tooltip key={side} content={`Tooltip on the ${side}`} side={side}>
          {(props) => (
            <Button variant="secondary" {...props}>
              Hover or focus ({side})
            </Button>
          )}
        </Tooltip>
      ))}
    </div>
  )
}

export function ToastDemo() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => toast({ title: 'Invoice sent', description: 'INV-0042 is on its way to Coal City Coffee.' })}>
        Success toast
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: 'Reminder scheduled', description: 'We’ll nudge them in 3 days.', tone: 'info' })}>
        Info toast
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: 'Couldn’t save', description: 'Check your connection and try again.', tone: 'error' })}>
        Error toast
      </Button>
    </div>
  )
}

export function LoadingButtonDemo() {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      loading={loading}
      onClick={() => {
        setLoading(true)
        setTimeout(() => setLoading(false), 1500)
      }}
    >
      Click to load
    </Button>
  )
}

// CLIENT COMPONENT: useFormStatus reads the pending state of the <form>
// this button sits in, which only exists in the browser while it submits.
'use client'

import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from './button'

/**
 * A submit button that shows its own loading state while the surrounding
 * form's Server Action runs. It's a separate component (not a prop on
 * Button) so Button can stay a Server Component: only the forms that need
 * pending state pay for the client JavaScript.
 */
export function SubmitButton(props: Omit<Extract<ButtonProps, { href?: undefined }>, 'type'>) {
  const { pending } = useFormStatus()
  return <Button {...props} type="submit" loading={pending || props.loading} />
}

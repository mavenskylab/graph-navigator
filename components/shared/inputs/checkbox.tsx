import { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import { cn } from '@/lib/util'

export type CheckboxProps = {
  name: string
  label: string
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <div className='form-control min-w-fit'>
      <label
        className={cn(
          'label cursor-pointer items-center justify-start gap-2',
          props.className,
        )}
        htmlFor={props.id ?? props.name}
      >
        <input
          {...props}
          id={props.id ?? props.name}
          type='checkbox'
          className='checkbox-primary checkbox'
          readOnly={props.readOnly || props.checked !== undefined}
        />
        <span className='label-text'>{label}</span>
      </label>
    </div>
  )
}

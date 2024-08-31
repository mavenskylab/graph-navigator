import { DetailedHTMLProps, InputHTMLAttributes } from 'react'

import { cn } from '@/lib/util'

export type RadioProps = {
  name: string
  label: string
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export default function Radio({ label, ...props }: RadioProps) {
  return (
    <div className='form-control min-w-fit'>
      <label
        className={cn(
          'label cursor-pointer items-center gap-2',
          props.className,
        )}
        htmlFor={props.id ?? props.name}
      >
        <input
          {...props}
          id={props.id ?? props.name}
          type='radio'
          className='radio checked:bg-primary'
          readOnly={props.readOnly || props.checked !== undefined}
        />
        <span className='label-text'>{label}</span>
      </label>
    </div>
  )
}

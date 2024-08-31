import { ChangeEvent, useState } from 'react'

type InputElement = HTMLInputElement | HTMLSelectElement

export default function useForm<T>(
  initialValue: T,
): [T, (e: ChangeEvent<InputElement>) => void] {
  const [inputs, setInputs] = useState(initialValue)

  function handleChange(e: ChangeEvent<InputElement>) {
    setInputs({
      ...inputs,
      ...(e.target.value && { [e.target.name]: e.target.value }),
    })
  }

  return [inputs, handleChange]
}

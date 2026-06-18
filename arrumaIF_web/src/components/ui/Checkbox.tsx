import { type InputHTMLAttributes } from 'react'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function Checkbox({ label, className = '', id, ...props }: CheckboxProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase()

  return (
    <label
      htmlFor={inputId}
      className={`flex items-center gap-2 cursor-pointer text-base text-text ${className}`}
    >
      <input
        id={inputId}
        type="checkbox"
        className="w-4 h-4 accent-primary cursor-pointer"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}

export interface CheckboxGroupProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  singleSelection?: boolean
  className?: string
}

export function CheckboxGroup({
  options,
  selected,
  onChange,
  singleSelection = false,
  className = '',
}: CheckboxGroupProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option))
    } else if (singleSelection) {
      onChange([option])
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {options.map((option) => (
        <Checkbox
          key={option}
          label={option}
          checked={selected.includes(option)}
          onChange={() => toggle(option)}
        />
      ))}
    </div>
  )
}

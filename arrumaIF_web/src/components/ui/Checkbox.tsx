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

export interface CheckboxOption {
  value: string
  label: string
}

export interface CheckboxGroupProps {
  options: string[] | CheckboxOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  singleSelection?: boolean
  className?: string
}

function normalizeOptions(options: string[] | CheckboxOption[]): CheckboxOption[] {
  return options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  )
}

export function CheckboxGroup({
  options,
  selected,
  onChange,
  singleSelection = false,
  className = '',
}: CheckboxGroupProps) {
  const normalized = normalizeOptions(options)

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value))
    } else if (singleSelection) {
      onChange([value])
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {normalized.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={selected.includes(option.value)}
          onChange={() => toggle(option.value)}
        />
      ))}
    </div>
  )
}

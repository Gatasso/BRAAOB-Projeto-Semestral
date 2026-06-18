import { type InputHTMLAttributes } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  label?: string
}

export function Input({ icon: Icon, label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-text-secondary mb-1">{label}</label>
      )}
      <div className="relative bg-input-bg h-[50px] rounded-xl flex items-center">
        {Icon && (
          <span className="pl-4 flex items-center text-text-secondary">
            <Icon size={20} />
          </span>
        )}
        <input
          className={`w-full h-full bg-transparent border-0 outline-none text-base text-text placeholder:text-text-secondary pl-3 pr-4 ${className}`}
          {...props}
        />
      </div>
    </div>
  )
}

export interface SelectInputProps {
  value?: string
  onChange?: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
  label?: string
}

export function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  className = '',
  label,
}: SelectInputProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm text-text-secondary mb-1">{label}</label>
      )}
      <div className="relative bg-input-bg rounded-xl flex items-center">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-[50px] bg-transparent border-0 outline-none text-base text-text appearance-none pl-4 pr-10 cursor-pointer"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={24}
          className="absolute right-3 text-text-secondary pointer-events-none"
        />
      </div>
    </div>
  )
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-text-secondary mb-1">{label}</label>
      )}
      <textarea
        className={`w-full bg-input-bg rounded-xl border-0 outline-none text-base text-text placeholder:text-text-secondary p-4 resize-none min-h-[120px] ${className}`}
        {...props}
      />
    </div>
  )
}

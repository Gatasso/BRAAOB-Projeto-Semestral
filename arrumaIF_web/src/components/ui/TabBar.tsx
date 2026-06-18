export interface TabBarProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
  onDark?: boolean
}

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  onDark = false,
}: TabBarProps) {
  return (
    <div className={`flex items-center justify-center gap-6 h-[66px] ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className="flex flex-col items-center gap-2 cursor-pointer bg-transparent border-0 p-0"
          >
            <span
              className={`text-[23px] leading-none whitespace-nowrap ${
                isActive
                  ? `font-semibold ${onDark ? 'text-white' : 'text-primary'}`
                  : `font-medium ${onDark ? 'text-white/45' : 'text-inactive'}`
              }`}
            >
              {tab}
            </span>
            {isActive && (
              <span
                className={`w-full h-[3px] rounded-sm ${onDark ? 'bg-white' : 'bg-primary'}`}
              />
            )}
            {!isActive && <span className="h-[3px]" />}
          </button>
        )
      })}
    </div>
  )
}

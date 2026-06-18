export const typography = {
  splash: 'text-[28px] font-bold leading-tight',
  titleCall: 'text-2xl font-bold leading-tight',
  welcome: 'text-[22px] font-bold leading-tight',
  section: 'text-xl font-bold leading-tight',
  button: 'text-base font-bold leading-tight',
  tabActive: 'text-[15px] font-semibold leading-tight',
  tabInactive: 'text-[15px] font-medium leading-tight',
  body: 'text-base font-normal leading-normal',
  subtitle: 'text-sm font-normal leading-normal',
  label: 'text-[13px] font-normal leading-normal',
  brandCaps: 'text-xs font-bold uppercase tracking-wide',
  sidebarBrand: 'text-xs font-normal leading-normal',
  uiLabel: 'text-[11px] font-medium leading-normal',
  navBottom: 'text-[10px] font-normal leading-normal',
} as const

export type TypographyToken = keyof typeof typography

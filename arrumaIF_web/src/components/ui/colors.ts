export const colors = {
  primary: '#1B5E20',
  primaryActive: '#2E7D32',
  loginBg: '#1E5128',
  alert: '#D32F2F',
  infoBg: '#E8F5E9',
  inputBg: '#F1F3F5',
  placeholder: '#386641',
  text: '#333333',
  textSecondary: '#757575',
  inactive: '#BDBDBD',
  white: '#FFFFFF',
  border: '#E0E0E0',
  searchBg: '#FAFAFA',
  overlay: 'rgba(0, 0, 0, 0.45)',
  overlayStrong: 'rgba(0, 0, 0, 0.6)',
} as const

export type ColorToken = keyof typeof colors

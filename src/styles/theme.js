export const theme = {
  colors: {
    primary: {
      light: '#60A5FA', // blue-400
      DEFAULT: '#3B82F6', // blue-500
      dark: '#2563EB', // blue-600
      darker: '#1D4ED8', // blue-700
    },
    secondary: {
      light: '#FCD34D', // yellow-300
      DEFAULT: '#FBBF24', // yellow-400
      dark: '#F59E0B', // yellow-500
    },
    accent: {
      light: '#818CF8', // indigo-400
      DEFAULT: '#6366F1', // indigo-500
      dark: '#4F46E5', // indigo-600
    },
    success: {
      light: '#34D399', // green-400
      DEFAULT: '#10B981', // green-500
      dark: '#059669', // green-600
    },
    error: {
      light: '#F87171', // red-400
      DEFAULT: '#EF4444', // red-500
      dark: '#DC2626', // red-600
    },
    warning: {
      light: '#FBBF24', // amber-400
      DEFAULT: '#F59E0B', // amber-500
      dark: '#D97706', // amber-600
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  gradients: {
    primary: 'from-blue-600 to-blue-800',
    secondary: 'from-yellow-400 to-yellow-600',
    accent: 'from-indigo-500 to-indigo-700',
    success: 'from-green-500 to-green-700',
    error: 'from-red-500 to-red-700',
    warning: 'from-amber-500 to-amber-700',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  borderRadius: {
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  transitions: {
    DEFAULT: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
  animations: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    slideUp: {
      from: { y: 20, opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    slideDown: {
      from: { y: -20, opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    scale: {
      from: { scale: 0.95, opacity: 0 },
      to: { scale: 1, opacity: 1 },
    },
  },
}; 
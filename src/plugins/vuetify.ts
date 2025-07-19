import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar'

const staffordMuayThaiTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#0D47A1', // A strong, deep blue
    'primary-darken-1': '#0a3a82',
    secondary: '#D32F2F', // An energetic red for accents
    'secondary-darken-1': '#b52828',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

export default createVuetify({
  components: {
    VCalendar,
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      staffordMuayThaiTheme,
    },
  },
})

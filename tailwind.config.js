/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        default: {
          primary: '#4338ca',
          'primary-content': '#fff',

          secondary: '#FFCA0F',
          'secondary-content': '#000',

          accent: '#37CDBE',
          'accent-content': '#000',

          neutral: '#3D4451',

          'base-100': '#FFFFFF',

          info: '#3ABFF8',

          success: '#36D399',

          warning: '#FBBD23',

          error: '#ef4444',
        },
      },
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      {
        greeny: {
          primary: '#1C6758',
          'primary-focus': '#31694e',
          'primary-content': '#fff',

          secondary: '#D6CDA4',
          'secondary-focus': '#aba483',
          'secondary-content': '#000',

          accent: '#37CDBE',
          'accent-focus': '#2ca498',
          'accent-content': '#000',

          neutral: '#3D4451',

          'base-100': '#EEF2E6',

          info: '#3ABFF8',

          success: '#36D399',

          warning: '#FBBD23',

          error: '#ef4444',
        }
      },
      {
        pinkoo: {
          primary: '#FA7070',
          'primary-focus': '#c85a5a',
          'primary-content': '#fff',

          secondary: '#FBF2CF',
          'secondary-focus': '#c9c2a6',
          'secondary-content': '#000',

          accent: '#37CDBE',
          'accent-focus': '#2ca498',
          'accent-content': '#000',

          neutral: '#3D4451',

          'base-100': '#EEF2E6',

          info: '#3ABFF8',

          success: '#36D399',

          warning: '#FBBD23',

          error: '#ef4444',
        }
      }
    ],
  },
  plugins: [require('daisyui'), require('@tailwindcss/line-clamp'), require('tailwind-scrollbar'),],
  variants: {
    scrollbar: ['rounded']
}
};

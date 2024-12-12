/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate"

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
			'primary-color': '#22c55e',
			'secondary-color': '#ff893d',
  		},
		  animation: {
			'fade-in': 'fadeIn 0.5s ease-in-out',
			'slide-in': 'slideIn 0.5s ease-out',
			'subtle-pulse': 'subtlePulse 4s ease-in-out infinite',
			'subtle-bounce': 'subtleBounce 2s ease-in-out infinite',
			'beat': 'beat 1.5s ease-out infinite',
			'gradient': 'gradient 3s ease infinite',
			'scale-98': 'scale98 0.2s ease-out',
		  },
		  keyframes: {
			fadeIn: {
			  '0%': { opacity: '0', transform: 'translateY(10px)' },
			  '100%': { opacity: '1', transform: 'translateY(0)' },
			},
			slideIn: {
			  '0%': { transform: 'translateX(20px)', opacity: '0' },
			  '100%': { transform: 'translateX(0)', opacity: '1' },
			},
			subtlePulse: {
			  '0%, 100%': { transform: 'scale(1)' },
			  '50%': { transform: 'scale(1.01)' },
			},
			subtleBounce: {
			  '0%, 100%': { transform: 'translateY(0)' },
			  '50%': { transform: 'translateY(-2px)' },
			},
			beat: {
			  '0%, 100%': { transform: 'scale(1)' },
			  '25%': { transform: 'scale(1.2)' },
			},
			gradient: {
			  '0%, 100%': {
				'background-size': '200% 200%',
				'background-position': 'left center'
			  },
			  '50%': {
				'background-size': '200% 200%',
				'background-position': 'right center'
			  },
			},
			scale98: {
			  '0%, 100%': { transform: 'scale(1)' },
			  '50%': { transform: 'scale(0.98)' },
			},
		  },
  	}
  },
  plugins: [animate],
}
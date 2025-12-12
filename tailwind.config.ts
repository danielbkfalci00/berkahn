import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1.5rem',
  			sm: '2rem',
  			lg: '4rem'
  		},
  		screens: {
  			'2xl': '1280px'
  		}
  	},
  	extend: {
  		colors: {
  			black: {
  				'5': 'rgba(0, 0, 0, 0.05)',
  				'10': 'rgba(0, 0, 0, 0.1)',
  				'30': 'rgba(0, 0, 0, 0.3)',
  				'50': 'rgba(0, 0, 0, 0.5)',
  				'70': 'rgba(0, 0, 0, 0.7)',
  				'90': 'rgba(0, 0, 0, 0.9)',
  				DEFAULT: '#000000'
  			},
  			white: {
  				'10': 'rgba(255, 255, 255, 0.1)',
  				'30': 'rgba(255, 255, 255, 0.3)',
  				'50': 'rgba(255, 255, 255, 0.5)',
  				'70': 'rgba(255, 255, 255, 0.7)',
  				'90': 'rgba(255, 255, 255, 0.9)',
  				DEFAULT: '#FFFFFF'
  			}
  		},
  		fontFamily: {
  			heading: [
  				'var(--font-manrope)',
  				'sans-serif'
  			],
  			body: [
  				'var(--font-manrope)',
  				'sans-serif'
  			]
  		},
  		spacing: {
  			xs: '0.5rem',
  			sm: '1rem',
  			md: '2rem',
  			lg: '4rem',
  			xl: '6rem',
  			'2xl': '8rem',
  			'3xl': '12rem'
  		},
  		transitionTimingFunction: {
  			expo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  			spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  		},
  		boxShadow: {
  			'luxury-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
  			'luxury-md': '0 4px 16px rgba(0, 0, 0, 0.06)',
  			'luxury-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
  			'luxury-xl': '0 16px 48px rgba(0, 0, 0, 0.12)'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			fadeInUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideIn: {
  				'0%': {
  					transform: 'translateX(100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			fadeIn: 'fadeIn 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
  			fadeInUp: 'fadeInUp 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
  			slideIn: 'slideIn 0.5s cubic-bezier(0.65, 0, 0.35, 1)',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

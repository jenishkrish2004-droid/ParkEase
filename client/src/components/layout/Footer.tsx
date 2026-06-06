// ============================================================
// Footer Layout Component
// ============================================================
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const footerLinks = {
  Product: [
    { label: 'Find Parking',       href: '/search'  },
    { label: 'List Your Space',    href: '/owner'   },
    { label: 'Pricing',            href: '/pricing' },
    { label: 'Mobile App',         href: '#'        },
  ],
  Company: [
    { label: 'About Us',   href: '/about'   },
    { label: 'Blog',       href: '/blog'    },
    { label: 'Careers',    href: '/careers' },
    { label: 'Press',      href: '/press'   },
  ],
  Support: [
    { label: 'Help Center',    href: '/help'    },
    { label: 'Contact Us',     href: '/contact' },
    { label: 'Safety',         href: '/safety'  },
    { label: 'Accessibility',  href: '#'        },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy'    },
    { label: 'Terms of Service', href: '/terms'      },
    { label: 'Cookie Policy',    href: '/cookies'    },
    { label: 'Sitemap',          href: '/sitemap'    },
  ],
};

const socialLinks = [
  {
    label: 'Twitter / X',
    href: 'https://twitter.com',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('bg-secondary-900 text-secondary-300', className)}>
      {/* Main Footer */}
      <div className="container-app pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2.5 no-underline group w-fit"
              aria-label="ParkEase"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 3h5c1.657 0 3 1.343 3 3s-1.343 3-3 3H6v4H4V3z" fill="white" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                ParkEase
              </span>
            </Link>

            <p className="mt-4 text-sm text-secondary-400 leading-relaxed max-w-xs">
              India's most trusted parking platform. Find, book, and pay for parking in seconds across 100+ cities.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center',
                    'bg-secondary-800 text-secondary-400',
                    'hover:bg-secondary-700 hover:text-white',
                    'transition-colors no-underline',
                  )}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* App Badges */}
            <div className="flex items-center gap-3 mt-5">
              <div className="px-3 py-2 bg-secondary-800 rounded-lg border border-secondary-700 text-xs text-secondary-400 hover:bg-secondary-700 cursor-pointer transition-colors">
                📱 App Store
              </div>
              <div className="px-3 py-2 bg-secondary-800 rounded-lg border border-secondary-700 text-xs text-secondary-400 hover:bg-secondary-700 cursor-pointer transition-colors">
                🤖 Google Play
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">
                {category}
              </h3>
              <ul className="flex flex-col gap-3" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={cn(
                        'text-sm text-secondary-400 hover:text-white',
                        'transition-colors no-underline',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="container-app py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary-500 text-center md:text-left">
            © {new Date().getFullYear()} ParkEase Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-secondary-500 hover:text-secondary-300 no-underline transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-secondary-500 hover:text-secondary-300 no-underline transition-colors">
              Terms
            </Link>
            <Link to="/cookies" className="text-xs text-secondary-500 hover:text-secondary-300 no-underline transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

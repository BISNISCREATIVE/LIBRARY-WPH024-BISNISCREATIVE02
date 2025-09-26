import { Facebook, Instagram, Linkedin } from 'lucide-react';

interface SocialMediaProps {
  className?: string;
  size?: number;
}

export const SocialMedia = ({ className = "", size = 24 }: SocialMediaProps) => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/booky',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Instagram', 
      icon: Instagram,
      url: 'https://instagram.com/booky',
      color: 'hover:text-pink-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/booky',
      color: 'hover:text-blue-700'
    },
    {
      name: 'TikTok',
      icon: ({ size, ...props }: { size?: number; className?: string }) => (
        <svg 
          width={size || 24} 
          height={size || 24} 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          {...props}
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.26z"/>
        </svg>
      ),
      url: 'https://tiktok.com/@booky',
      color: 'hover:text-gray-900'
    }
  ];

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-muted-foreground transition-colors ${social.color}`}
            aria-label={`Follow us on ${social.name}`}
          >
            <IconComponent size={size} />
          </a>
        );
      })}
    </div>
  );
};
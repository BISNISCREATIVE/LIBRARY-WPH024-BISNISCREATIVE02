import { Link } from 'react-router-dom';
import { SocialMedia } from './SocialMedia';

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-2xl text-foreground">Booky</span>
          </Link>

          {/* Description */}
          <p className="text-muted-foreground max-w-md">
            Discover inspiring stories & timeless knowledge, ready to borrow anytime. 
            Explore online or visit our nearest library branch.
          </p>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow on Social Media</h3>
            <SocialMedia size={24} />
          </div>

          {/* Copyright */}
          <div className="border-t w-full pt-8">
            <p className="text-sm text-muted-foreground">
              © 2024 Booky. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Share2, Check, Link2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';

interface ShareButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick'
> {
  url?: string;
  title?: string;
  text?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'minimal';
  size?: 'sm' | 'md';
  iconOnly?: boolean;
  label?: string;
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'copy'>;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title = '',
  text = '',
  variant = 'outline',
  size = 'md',
  iconOnly = false,
  label = 'Share',
  platforms = ['twitter', 'facebook', 'linkedin', 'copy'],
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || title;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  }, [shareUrl]);

  const handleShare = useCallback(
    async (platform: (typeof platforms)[number]) => {
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(shareText);

      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            '_blank',
            'noopener,noreferrer,width=600,height=400'
          );
          break;
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            '_blank',
            'noopener,noreferrer,width=600,height=400'
          );
          break;
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            '_blank',
            'noopener,noreferrer,width=600,height=400'
          );
          break;
        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        case 'copy':
          await handleCopy();
          break;
      }
      setIsOpen(false);
    },
    [shareUrl, shareText, handleCopy]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-border bg-background hover:bg-muted text-foreground',
    ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
    minimal: 'text-muted-foreground hover:text-foreground',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'focus-visible:ring-ring inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
          variantClasses[variant],
          sizeClasses[size],
          isOpen && 'bg-muted',
          className
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={label}
        {...props}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
        ) : (
          <Share2 className="h-4 w-4" aria-hidden="true" />
        )}
        {!iconOnly && <span>{copied ? 'Copied!' : label}</span>}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="border-border bg-popover text-popover-foreground animate-in fade-in slide-in-from-top-2 absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border shadow-lg"
        >
          <div className="p-2">
            <p className="text-muted-foreground px-3 py-1.5 text-xs font-medium tracking-wide uppercase">
              Share this page
            </p>
            {platforms.map((platform) => (
              <button
                key={platform}
                role="menuitem"
                onClick={() => handleShare(platform)}
                className="text-foreground hover:bg-muted flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
              >
                {platform === 'twitter' && <Twitter className="h-4 w-4" aria-hidden="true" />}
                {platform === 'facebook' && <Facebook className="h-4 w-4" aria-hidden="true" />}
                {platform === 'linkedin' && <Linkedin className="h-4 w-4" aria-hidden="true" />}
                {platform === 'whatsapp' && (
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                )}
                {platform === 'copy' && <Link2 className="h-4 w-4" aria-hidden="true" />}
                <span className="capitalize">
                  {platform === 'twitter'
                    ? 'X (Twitter)'
                    : platform === 'copy'
                      ? 'Copy link'
                      : platform}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ShareButton.displayName = 'ShareButton';

export { ShareButton };

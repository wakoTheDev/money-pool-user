import React, { useMemo } from "react";

// Optimized footer link component
const FooterLink = React.memo<{
  href: string;
  children: React.ReactNode;
  external?: boolean;
}>(({ href, children, external = false }) => (
  <a
    href={href}
    className="text-gray-600 hover:text-[#2E7D32] transition-colors duration-200 text-sm font-medium focus:outline-none focus:underline"
    {...(external && {
      target: "_blank",
      rel: "noopener noreferrer",
      'aria-label': `${children} (opens in new window)`
    })}
  >
    {children}
  </a>
));

FooterLink.displayName = 'FooterLink';

// Main footer component optimized with React.memo
const Footer = React.memo(() => {
  // Memoized footer content to prevent unnecessary re-renders
  const footerContent = useMemo(() => (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center text-center">
      <FooterLink href="/privacy">Privacy Policy</FooterLink>
      <FooterLink href="/terms">Terms of Service</FooterLink>
      <FooterLink href="/contact">Contact Us</FooterLink>
      <FooterLink href="/support">Support</FooterLink>
      <FooterLink href="https://github.com/moneypool" external>
        GitHub
      </FooterLink>
    </div>
  ), []);

  const copyrightText = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return `© ${currentYear} MoneyPool. All rights reserved.`;
  }, []);

  return (
    <footer 
      className="w-full flex flex-col gap-4 items-center justify-center border border-gray-200 rounded-lg p-6 sm:p-8 max-w-3xl bg-white shadow-sm"
      role="contentinfo"
      aria-label="Site footer"
    >
      {footerContent}
      <div className="text-xs text-gray-500 mt-2">
        {copyrightText}
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
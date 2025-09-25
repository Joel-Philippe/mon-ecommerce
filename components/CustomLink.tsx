import NextLink from 'next/link'; // Import Next.js Link directly for its props
import ScrollRestorationLink from '@/components/ScrollRestorationLink'; // Import the component itself
import React, { ReactNode } from 'react';

interface CustomLinkProps extends React.ComponentProps<typeof NextLink> { // Extend Next.js Link props
  children: ReactNode;
  className?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ children, href, className, ...props }) => {
  return (
    <ScrollRestorationLink href={href} className={className} {...props}>
      {children}
    </ScrollRestorationLink>
  );
};

export default CustomLink;

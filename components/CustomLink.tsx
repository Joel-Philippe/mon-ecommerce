'use client';
import Link, { LinkProps } from '@/components/ScrollRestorationLink'; // Import ScrollRestorationLink
import React, { ReactNode } from 'react';

interface CustomLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ children, href, className, ...props }) => {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;

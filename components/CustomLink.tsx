'use client';
import Link, { ScrollRestorationLinkProps } from '@/components/ScrollRestorationLink'; // Import ScrollRestorationLink
import React, { ReactNode } from 'react';

interface CustomLinkProps extends ScrollRestorationLinkProps {
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

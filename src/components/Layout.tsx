import React from 'react';
import DashboardHeader from './DashboardHeader';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  );
}
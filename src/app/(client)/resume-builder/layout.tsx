"use client";

import { ResumeBuilderProvider } from '@/contexts/ResumeBuilderContext';

export default function ResumeBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResumeBuilderProvider>
      {children}
    </ResumeBuilderProvider>
  );
}

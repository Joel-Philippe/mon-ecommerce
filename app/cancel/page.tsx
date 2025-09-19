'use client';
import React, { Suspense } from 'react';
import CancelContent from './CancelContent';

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading cancellation details...</div>}>
      <CancelContent />
    </Suspense>
  );
}
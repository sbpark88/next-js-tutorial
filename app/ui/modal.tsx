'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

export default function Modal({ children }: React.PropsWithChildren) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.7)]">
          {children}
        </div>,
        document.body,
      )}
    </>
  );
}

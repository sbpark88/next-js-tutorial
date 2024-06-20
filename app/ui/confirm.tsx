import React, { useRef } from 'react';
import useOnClickOutside from '@/app/hooks/useOnClickOutside';

interface ConfirmProps extends React.PropsWithChildren {
  message: string;
  onCancel: React.EventHandler<any>;
}

export function Confirm({ message, onCancel, children }: ConfirmProps) {
  const ref = useRef(null);

  useOnClickOutside(ref, onCancel);

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2 box-content  h-20 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-4 text-center"
    >
      <p>{message}</p>
      <div className="relative bottom-2 h-full">
        <div className="absolute bottom-4 box-content flex w-full gap-2">
          <button
            className="h-10 w-1/2 items-center rounded-lg bg-gray-300 px-4 text-sm text-black hover:bg-gray-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

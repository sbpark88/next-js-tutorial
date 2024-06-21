'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Modal from '@/app/ui/modal';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteInvoice } from '@/app/lib/actions';
import { Confirm } from '@/app/ui/confirm';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <>
      <button
        className="rounded-md border p-2 hover:bg-gray-100"
        onClick={() => setOpenConfirm(true)}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
      {openConfirm && (
        <Modal>
          <Confirm
            message="Do you want to delete this invoice?"
            onCancel={() => setOpenConfirm(false)}
          >
            <form action={deleteInvoiceWithId} className="w-1/2">
              <button
                className="h-10 w-full items-center rounded-lg bg-red-500 px-4 text-sm text-white hover:bg-red-400"
                onSubmit={() => setOpenConfirm(false)}
              >
                OK
              </button>
            </form>
          </Confirm>
        </Modal>
      )}
    </>
  );
}

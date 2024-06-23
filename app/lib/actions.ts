'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

/* Create Invoice */

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  // input type="number" 가 실제로는 number 가 아닌 string 을 반환하기 때문에 z.number() 를 사용하면 에러 발생
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  message?: string | null;
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Step 1. Validate form using Zod
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = CreateInvoice.safeParse(rawFormData);

  // Step 2. If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      message: 'Missing Fields. Failed to Create Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Step 3. Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Step 4. Insert data into the database
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return { message: 'Database Error: Failed to Create Invoice.' };
  }

  // Step 5. Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices'); // revalidate the Next.js cache
  redirect('/dashboard/invoices'); // redirect the user to a new page
}

/* Update Invoice */

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  // Step 1. Validate form using Zod
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = UpdateInvoice.safeParse(rawFormData);

  // Step 2. If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      message: 'Missing Fields. Failed to Update Invoice.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Step 3. Prepare data for update into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  // Step 4. Insert data into the database
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, 
          amount = ${amountInCents}, 
          status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  // Step 5. Revalidate the cache for invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/* Delete Invoice */

export async function deleteInvoice(id: string) {
  try {
    await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/invoice');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

/* Authenticate */

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // https://authjs.dev/getting-started/providers/credentials
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

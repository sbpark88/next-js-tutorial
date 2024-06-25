import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
  alternates: {
    canonical: '/dashboard/customers',
  },
};

export default function Page() {
  return <p>Customers Page</p>;
}

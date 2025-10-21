'use client';

import { useRouter } from 'next/navigation';
import AddCard from '@/components/AddCard';

const AddCardPage = () => {
  const router = useRouter();
  const handleClose = () => {
    router.push('/admin');
  };

  return <AddCard onClose={handleClose} />;
};

export default AddCardPage;
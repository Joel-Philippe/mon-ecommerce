'use client';
import React from 'react';
import AddCard from '@/components/AddCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import '../admin.css';

const AddProductPage = () => {
  const router = useRouter();
  const handleClose = () => {
    router.push('/admin');
  };

  return <AddCard onClose={handleClose} />;
};

export default AddProductPage;
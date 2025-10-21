'use client';

import React from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';
import ProductForm from './ProductForm';
import { Card } from '@/types';

interface AddCardProps {
    isOpen?: boolean;
    onClose: () => void;
}

const AddCard: React.FC<AddCardProps> = ({ isOpen, onClose }) => {

    const handleCreateCard = async (data: Card) => {
        try {
            const cardData = {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            const docRef = await addDoc(collection(db, 'cards'), cardData);
            console.log('✅ Carte enregistrée avec l\'ID :', docRef.id);
            alert('✅ Article créé avec succès !');
        } catch (err) {
            console.error('❌ Erreur lors de la création :', err);
            alert('❌ Erreur lors de la création de l\'article');
            // Re-throw the error if you want the calling component to know about it
            throw err;
        }
    };

    if (!isOpen) return null;

    return (
        <ProductForm 
            onSubmit={handleCreateCard} 
            onClose={onClose} 
        />
    );
};

export default AddCard;
'use client';

import React from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';
import ProductForm from './ProductForm';
import { Card } from '@/types';

interface UpdateCardModalProps {
    formCard: Card | null;
    onClose: () => void;
}

const UpdateCardModal: React.FC<UpdateCardModalProps> = ({ formCard, onClose }) => {

    const handleUpdateCard = async (data: Card) => {
        if (!formCard?._id) {
            console.error('Card ID is missing');
            alert('❌ Impossible de mettre à jour l\'article : ID manquant.');
            return;
        }

        try {
            const cardRef = doc(db, 'cards', formCard._id);
            await updateDoc(cardRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });
            console.log('✅ Carte mise à jour avec l\'ID :', formCard._id);
            alert('✅ Article mis à jour avec succès !');
        } catch (err) {
            console.error('❌ Erreur lors de la mise à jour :', err);
            alert('❌ Erreur lors de la mise à jour de l\'article');
            throw err;
        }
    };

    if (!formCard) return null;

    return (
        <ProductForm 
            initialData={formCard} 
            onSubmit={handleUpdateCard} 
            onClose={onClose} 
        />
    );
};

export default UpdateCardModal;
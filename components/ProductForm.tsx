'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/types';
import styles from './ProductForm.module.css';
import { 
    FileText, 
    Tag, 
    Euro, 
    ImageIcon, 
    User, 
    Star, 
    Settings, 
    Package, 
    Plus, 
    Trash2 
} from 'lucide-react';

interface ProductFormProps {
    initialData?: Partial<Card>;
    onSubmit: (data: Card) => Promise<void>;
    onClose: () => void;
}

const SECTIONS = [
    { id: 'basic', title: 'Informations de base', icon: FileText },
    { id: 'category', title: 'Catégorie & Affichage', icon: Tag },
    { id: 'pricing', title: 'Prix & Stock', icon: Euro },
    { id: 'images', title: 'Images', icon: ImageIcon },
    { id: 'seller', title: 'Vendeur', icon: User },
    { id: 'features', title: 'Points importants', icon: Star },
    { id: 'specs', title: 'Caractéristiques', icon: Settings },
    { id: 'derived', title: 'Produits dérivés', icon: Package },
];

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onClose }) => {
    const [formData, setFormData] = useState<Partial<Card>>(initialData || {});
    const [activeSection, setActiveSection] = useState('basic');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.title) newErrors.title = 'Le titre est requis.';
        if (!formData.price) newErrors.price = 'Le prix est requis.';
        if (!formData.categorie) newErrors.categorie = 'La catégorie est requise.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await onSubmit(formData as Card);
            onClose();
        } catch (error) {
            console.error("Submission failed", error);
            // Optionally, handle and display submission errors in the UI
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof Card, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleDynamicChange = (arrayName: keyof Card, index: number, field: string, value: any) => {
        const array = formData[arrayName] as any[] || [];
        const newArray = [...array];

        // This is a simplified handler. For deeply nested objects, a more robust solution
        // like a helper function for deep updates would be better.
        if (field.includes('.')) {
            const [nestedArrayName, nestedIndex, nestedField] = field.split(/[.\[\]]/).filter(Boolean);
            const nestedArray = newArray[index][nestedArrayName] as any[];
            const newNestedArray = [...nestedArray];
            newNestedArray[parseInt(nestedIndex)] = { ...newNestedArray[parseInt(nestedIndex)], [nestedField]: value };
            newArray[index] = { ...newArray[index], [nestedArrayName]: newNestedArray };
        } else {
            newArray[index] = { ...newArray[index], [field]: value };
        }

        handleInputChange(arrayName, newArray);
    };

    const handleImageArrayChange = (index: number, value: string) => {
        const array = (formData.images as string[] || []);
        const newArray = [...array];
        newArray[index] = value;
        handleInputChange('images', newArray);
    };

    const addDynamicItem = <T extends object>(arrayName: keyof Card, newItem: T) => {
        const array = (formData[arrayName] as T[] || []);
        handleInputChange(arrayName, [...array, newItem]);
    };

    const removeDynamicItem = (arrayName: keyof Card, index: number) => {
        const array = (formData[arrayName] as any[] || []);
        handleInputChange(arrayName, array.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.container}>
            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <nav className={styles.sidebarNav}>
                        {SECTIONS.map(section => (
                            <button 
                                key={section.id} 
                                className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <section.icon className={styles.navIcon} size={18} />
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className={styles.content}>
                    {/* Render sections based on activeSection */}
                    <RenderSection 
                        activeSection={activeSection}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        errors={errors}
                        handleDynamicChange={handleDynamicChange}
                        addDynamicItem={addDynamicItem}
                        removeDynamicItem={removeDynamicItem}
                        handleImageArrayChange={handleImageArrayChange}
                    />
                </main>
            </div>

            <footer className={styles.footer}>
                <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onClose} disabled={isSubmitting}>
                    Annuler
                </button>
                <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Enregistrement...' : (initialData ? 'Mettre à jour' : 'Créer')}
                </button>
            </footer>
        </div>
    );
};

const RenderSection = ({ activeSection, formData, handleInputChange, errors, handleDynamicChange, addDynamicItem, removeDynamicItem, handleImageArrayChange }: any) => {
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'basic':
                return (
                    <div className={styles.formGrid}>
                        <div className={styles.fullWidth}>
                            <label className={`${styles.formLabel} ${styles.required}`}>Titre</label>
                            <input type="text" value={formData.title || ''} onChange={e => handleInputChange('title', e.target.value)} className={`${styles.formInput} ${errors.title ? styles.error : ''}`} />
                            {errors.title && <p className={styles.errorMessage}>{errors.title}</p>}
                        </div>
                        <div className={styles.fullWidth}>
                            <label className={styles.formLabel}>Description</label>
                            <textarea value={formData.description || ''} onChange={e => handleInputChange('description', e.target.value)} className={styles.formTextarea} rows={5}></textarea>
                        </div>
                        <div>
                            <label className={styles.formLabel}>Date d'expiration</label>
                            <input type="date" value={formData.time ? new Date(formData.time).toISOString().split('T')[0] : ''} onChange={e => handleInputChange('time', e.target.value)} className={styles.formInput} />
                        </div>
                    </div>
                );
            case 'category':
                 return (
                    <div className={styles.formGrid}>
                        <div>
                            <label className={`${styles.formLabel} ${styles.required}`}>Catégorie</label>
                            <input type="text" value={formData.categorie || ''} onChange={e => handleInputChange('categorie', e.target.value)} className={`${styles.formInput} ${errors.categorie ? styles.error : ''}`} />
                            {errors.categorie && <p className={styles.errorMessage}>{errors.categorie}</p>}
                        </div>
                         <div>
                            <label className={styles.formLabel}>Image de la catégorie</label>
                            <input type="text" value={formData.categorieImage || ''} onChange={e => handleInputChange('categorieImage', e.target.value)} className={styles.formInput} />
                        </div>
                        <div>
                            <label className={styles.formLabel}>Couleur de la catégorie</label>
                            <input type="color" value={formData.categorieBackgroundColor || ''} onChange={e => handleInputChange('categorieBackgroundColor', e.target.value)} className={styles.formInput} />
                        </div>
                    </div>
                );
            case 'pricing':
                return (
                    <div className={styles.formGrid}>
                        <div>
                            <label className={`${styles.formLabel} ${styles.required}`}>Prix</label>
                            <input type="number" value={formData.price || ''} onChange={e => handleInputChange('price', e.target.value)} className={`${styles.formInput} ${errors.price ? styles.error : ''}`} />
                            {errors.price && <p className={styles.errorMessage}>{errors.price}</p>}
                        </div>
                        <div>
                            <label className={styles.formLabel}>Prix Promo</label>
                            <input type="number" value={formData.price_promo || ''} onChange={e => handleInputChange('price_promo', e.target.value)} className={styles.formInput} />
                        </div>
                        <div>
                            <label className={styles.formLabel}>Stock</label>
                            <input type="number" value={formData.stock || 0} onChange={e => handleInputChange('stock', Number(e.target.value))} className={styles.formInput} />
                        </div>
                    </div>
                );
            case 'images':
                return (
                    <div className={styles.dynamicFieldArray}>
                         <label className={styles.formLabel}>Images du produit</label>
                        {(formData.images || []).map((image: string, index: number) => (
                            <div key={index} className={styles.dynamicFieldCard}>
                                <div className={styles.dynamicFieldHeader}>
                                    <span className={styles.dynamicFieldTitle}>Image {index + 1}</span>
                                    <button onClick={() => removeDynamicItem('images', index)} className={styles.removeButton}><Trash2 size={16} /></button>
                                </div>
                                <input type="text" value={image} onChange={e => handleImageArrayChange(index, e.target.value)} className={styles.formInput} placeholder="URL de l'image" />
                            </div>
                        ))}
                        <button onClick={() => addDynamicItem('images', '')} className={styles.addButton}><Plus size={16} /> Ajouter une image</button>
                    </div>
                );
            case 'seller':
                return (
                    <div className={styles.formGrid}>
                        <div>
                            <label className={styles.formLabel}>Prénom du vendeur</label>
                            <input type="text" value={formData.prenom_du_proposant || ''} onChange={e => handleInputChange('prenom_du_proposant', e.target.value)} className={styles.formInput} />
                        </div>
                        <div>
                            <label className={styles.formLabel}>Photo du vendeur</label>
                            <input type="text" value={formData.photo_du_proposant || ''} onChange={e => handleInputChange('photo_du_proposant', e.target.value)} className={styles.formInput} placeholder="URL de la photo" />
                        </div>
                    </div>
                );
            case 'features':
                return (
                    <div className={styles.formGrid}>
                        <div className={styles.fullWidth}>
                            <label className={styles.formLabel}>Point important 1</label>
                            <input type="text" value={formData.point_important_un || ''} onChange={e => handleInputChange('point_important_un', e.target.value)} className={styles.formInput} />
                        </div>
                        <div className={styles.fullWidth}>
                            <label className={styles.formLabel}>Point important 2</label>
                            <input type="text" value={formData.point_important_deux || ''} onChange={e => handleInputChange('point_important_deux', e.target.value)} className={styles.formInput} />
                        </div>
                        <div className={styles.fullWidth}>
                            <label className={styles.formLabel}>Point important 3</label>
                            <input type="text" value={formData.point_important_trois || ''} onChange={e => handleInputChange('point_important_trois', e.target.value)} className={styles.formInput} />
                        </div>
                        <div className="form-group full-width">
                            <label className={styles.formLabel}>Point important 4</label>
                            <input type="text" value={formData.point_important_quatre || ''} onChange={e => handleInputChange('point_important_quatre', e.target.value)} className={styles.formInput} />
                        </div>
                        <div className={styles.fullWidth}>
                            <label className={styles.formLabel}>Image Point important 1</label>
                            <input type="text" value={formData.img_point_important_un || ''} onChange={e => handleInputChange('img_point_important_un', e.target.value)} className={styles.formInput} />
                        </div>
                        <div className={styles.fullWidth}>
                            <label className={styles.formLabel}>Image Point important 2</label>
                            <input type="text" value={formData.img_point_important_deux || ''} onChange={e => handleInputChange('img_point_important_deux', e.target.value)} className={styles.formInput} />
                        </div>
                        <div className={styles.fullWidth}>
                            <label className={styles.formLabel}>Image Point important 3</label>
                            <input type="text" value={formData.img_point_important_trois || ''} onChange={e => handleInputChange('img_point_important_trois', e.target.value)} className={styles.formInput} />
                        </div>
                        <div className={styles.fullWidth}>
                            <label className={styles.formLabel}>Image Point important 4</label>
                            <input type="text" value={formData.img_point_important_quatre || ''} onChange={e => handleInputChange('img_point_important_quatre', e.target.value)} className={styles.formInput} />
                        </div>
                    </div>
                );
            case 'specs':
                return (
                    <div className={styles.dynamicFieldArray}>
                        {(formData.caracteristiques || []).map((spec: any, index: number) => (
                            <div key={index} className={styles.dynamicFieldCard}>
                                <div className={styles.dynamicFieldHeader}>
                                    <input type="text" value={spec.titre || ''} onChange={e => handleDynamicChange('caracteristiques', index, 'titre', e.target.value)} className={styles.formInput} placeholder="Titre de la caractéristique" />
                                    <button onClick={() => removeDynamicItem('caracteristiques', index)} className={styles.removeButton}><Trash2 size={16} /></button>
                                </div>
                                {(spec.caracteristiques || []).map((item: any, itemIndex: number) => (
                                     <div key={itemIndex} className={styles.formGrid}>
                                        <input type="text" value={item.nom} onChange={e => handleDynamicChange('caracteristiques', index, `caracteristiques.${itemIndex}.nom`, e.target.value)} placeholder="Nom" className={styles.formInput} />
                                        <input type="text" value={item.valeur} onChange={e => handleDynamicChange('caracteristiques', index, `caracteristiques.${itemIndex}.valeur`, e.target.value)} placeholder="Valeur" className={styles.formInput} />
                                    </div>
                                ))}
                                <button onClick={() => addDynamicItem('caracteristiques', { titre: '', caracteristiques: [] })} className={styles.addButton}><Plus size={16} /> Ajouter une caractéristique</button>
                            </div>
                        ))}
                        <button onClick={() => addDynamicItem('caracteristiques', { titre: '', caracteristiques: [] })} className={styles.addButton}><Plus size={16} /> Ajouter un tableau de caractéristiques</button>
                    </div>
                );
            case 'derived':
                return (
                     <div className={styles.dynamicFieldArray}>
                        {(formData.produits_derives || []).map((product: any, index: number) => (
                            <div key={index} className={styles.dynamicFieldCard}>
                                <div className={styles.dynamicFieldHeader}>
                                     <span className={styles.dynamicFieldTitle}>Produit Dérivé {index + 1}</span>
                                    <button onClick={() => removeDynamicItem('produits_derives', index)} className={styles.removeButton}><Trash2 size={16} /></button>
                                </div>
                                <div className={styles.formGrid}>
                                    <input type="text" value={product.titre} onChange={e => handleDynamicChange('produits_derives', index, 'titre', e.target.value)} placeholder="Titre" className={styles.formInput} />
                                    <input type="number" value={product.prix} onChange={e => handleDynamicChange('produits_derives', index, 'prix', e.target.value)} placeholder="Prix" className={styles.formInput} />
                                </div>
                                <button onClick={() => addDynamicItem('produits_derives', { titre: '', prix: '' })} className={styles.addButton}><Plus size={16} /> Ajouter un produit dérivé</button>
                            </div>
                        ))}
                        <button onClick={() => addDynamicItem('produits_derives', { titre: '', prix: '' })} className={styles.addButton}><Plus size={16} /> Ajouter un produit dérivé</button>
                    </div>
                );
            default:
                return <p>Section non trouvée.</p>;
        }
    };

    const activeSectionInfo = SECTIONS.find(s => s.id === activeSection);

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{activeSectionInfo?.title}</h2>
                <p className={styles.sectionDescription}>Gérez les informations de cette section.</p>
            </div>
            {renderSectionContent()}
        </div>
    );
};

export default ProductForm;

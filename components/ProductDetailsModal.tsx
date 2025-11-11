'use client';
import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Grid,
  GridItem,
  IconButton
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

import { GlobalCartContext } from "../components/GlobalCartContext";
import CommentSection from '../components/CommentSection';

import "../app/ProductDetailsModal.css";
import "@/app/style.css";
import { useGlobalCart } from "@/components/GlobalCartContext";

import { Card } from "@/types";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Card | null;
}

const MotionModalContent = motion(ModalContent);

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ isOpen, onClose, product }) => {
  const globalCartContext = useContext(GlobalCartContext);
  const { globalCart } = useGlobalCart();
  const [mainIndex, setMainIndex] = useState(0);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [showNavButtons, setShowNavButtons] = useState(false); // New state for nav button visibility

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainIndex(0);
      setMainImage(product.images[0]);
      setShowNavButtons(false); // Reset when product changes
    } else {
      setMainImage(null);
      setShowNavButtons(false); // Reset when product changes
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    setMainImage(product.images?.[mainIndex] ?? null);
  }, [mainIndex, product]);

  // navigation clavier (gauche/droite/escape)
  const onKey = useCallback((e: KeyboardEvent) => {
    if (!isOpen || !product || !product.images) return;
    if (e.key === "ArrowLeft") {
      setMainIndex(i => (i > 0 ? i - 1 : product.images.length - 1));
      setShowNavButtons(true); // Show buttons on keyboard navigation
    } else if (e.key === "ArrowRight") {
      setMainIndex(i => (i < product.images.length - 1 ? i + 1 : 0));
      setShowNavButtons(true); // Show buttons on keyboard navigation
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [isOpen, product, onClose]);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  if (!globalCartContext) {
    throw new Error("GlobalCartContext must be used within a GlobalCartProvider");
  }

  if (!product) return null;

  const isExpired = product?.time ? new Date(product.time) < new Date() : false;
  if (!product || (!product.price && !product.price_promo)) return null;

  const goPrev = () => {
    if (!product?.images) return;
    setMainIndex(i => (i > 0 ? i - 1 : product.images!.length - 1));
    setShowNavButtons(true); // Show buttons on manual navigation
  };
  const goNext = () => {
    if (!product?.images) return;
    setMainIndex(i => (i < product.images!.length - 1 ? i + 1 : 0));
    setShowNavButtons(true); // Show buttons on manual navigation
  };

  const onThumbClick = (idx: number) => {
    setMainIndex(idx);
    setShowNavButtons(true); // Show buttons on thumbnail click
    console.log('showNavButtons set to true on thumbnail click');
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="full"
          motionPreset="none"
          blockScrollOnMount={true}
        >
          <ModalOverlay bg="rgba(0,0,0,0.6)" onClick={onClose} />

          <MotionModalContent
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.16 }}
            style={{
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
              borderRadius: 0,
              overflow: 'hidden',
              background: 'white',
              position: 'relative',
            }}
            className="product-modal-content"
          >
            {/* Header */}
            <Box className="modal-header-full">
              <Text className="title-product-full">{product.title}</Text>
              <ModalCloseButton className="modal-close-btn-full" />
            </Box>

            {/* Body : layout en 2 colonnes sur desktop, en colonne sur mobile */}
            <ModalBody className="product-body-full">
              <div className="product-grid">
                {/* Left: galerie */}
                <div className="gallery-col">
                  <div className={`main-image-wrap ${showNavButtons ? 'show-nav-buttons' : ''}`} style={{ border: '2px solid blue' }}>
                    {/* Flèches */}
                    <IconButton
                      aria-label="Previous image"
                      icon={<ChevronLeftIcon w={8} h={8} />}
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      className="nav-arrow left"
                    />
                    <img src={mainImage ?? ""} alt={product.title} className="mainImageFull" onClick={() => setShowNavButtons(true)} style={{ border: '2px solid red', zIndex: 100 }} />
                    <IconButton
                      aria-label="Next image"
                      icon={<ChevronRightIcon w={8} h={8} />}
                      onClick={(e) => { e.stopPropagation(); goNext(); }}
                      className="nav-arrow right"
                    />
                  </div>

                  {/* Miniatures : scroll-snap horizontal avec fallback grid wrap */}
                  <div className="thumbnailContainerFull" role="list">
                    {product.images?.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => onThumbClick(idx)}
                        className={`thumbnailFull ${idx === mainIndex ? 'active' : ''}`}
                        aria-label={`Voir image ${idx + 1}`}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: infos produit */}
                <div className="info-col">
                  <Box className="price-row">
                    {product.price_promo ? (
                      <>
                        <Text className="price-promo">€{product.price_promo}</Text>
                        <Text className="price-base">€{product.price}</Text>
                      </>
                    ) : (
                      product.price && <Text className="price-base">€{product.price}</Text>
                    )}
                  </Box>



                  <Box className="badges-row">
                    {product.point_important_un && <span className="badge">{product.point_important_un}</span>}
                    {product.point_important_deux && <span className="badge">{product.point_important_deux}</span>}
                    {product.point_important_trois && <span className="badge">{product.point_important_trois}</span>}
                    {product.point_important_quatre && <span className="badge">{product.point_important_quatre}</span>}
                  </Box>

                  <Box className="seller-row">
                    <img className="seller-avatar" src={product?.photo_du_proposant} alt={product?.prenom_du_proposant ?? ""} />
                    <div>
                      <Text className="seller-name">{product?.prenom_du_proposant}</Text>
                      <Text className="seller-origin">{product?.origine}</Text>
                    </div>
                  </Box>

                  <Box className="description-row">
                    <Text className="section-title">Description</Text>
                    <Text className="description-text">{product.description}</Text>
                  </Box>

                  {product.caracteristiques && product.caracteristiques.length > 0 && (
                    <Box className="specs-row">
                      <Text className="section-title">Caractéristiques</Text>
                      <div className="specs-grid">
                        {product.caracteristiques.map((tableau, ti) => (
                          <div key={ti} className="spec-table">
                            {tableau.titre && <Text className="spec-table-title">{tableau.titre}</Text>}
                            <Grid templateColumns="repeat(auto-fill, minmax(140px, 1fr))" gap={2}>
                              {tableau.caracteristiques.map((c, ci) => (
                                <GridItem key={ci} className="spec-item">
                                  {c.nom && <Text className="spec-name">{c.nom}</Text>}
                                  {c.valeur && <Text className="spec-value">{c.valeur}</Text>}
                                </GridItem>
                              ))}
                            </Grid>
                          </div>
                        ))}
                      </div>
                    </Box>
                  )}

                  <Box mt={6} borderTop="1px solid #E6EAF0" pt={4}>
                    <Text className="section-title">Avis et commentaires</Text>
                    {product?._id && <CommentSection productId={product._id} />}
                  </Box>
                </div>
              </div>
            </ModalBody>
          </MotionModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;

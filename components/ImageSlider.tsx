'use client';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Close fullscreen on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Aucune image disponible</div>;
  }

  return (
    <div className={`product-image-slider-container ${isFullscreen ? 'fullscreen-active' : ''}`}>
      {isFullscreen && (
        <button className="fullscreen-close-button" onClick={toggleFullscreen} aria-label="Fermer le mode plein écran">
          X
        </button>
      )}
      {/* Fullscreen toggle button */}
      <button className="fullscreen-toggle-button" onClick={toggleFullscreen} aria-label="Basculer en plein écran">
        {isFullscreen ? '-' : '+'}
      </button>

      {/* Main Slider */}
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        } as React.CSSProperties}
        loop={images.length > 1} // Make loop conditional
        spaceBetween={10}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs, Pagination]}
        className="mySwiper2"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} onClick={() => { toggleFullscreen(); console.log('toggleFullscreen called on main image click'); }}>
            <img src={image} alt={`Product image ${index + 1}`} loading="lazy" style={{ width: '100%', objectFit: 'contain' }} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Slider */}
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={images.length > 4} // Make loop conditional for thumbnails (assuming 4 slides per view)
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
        style={{ marginTop: '10px' }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Thumbnail ${index + 1}`} style={{ width: '100%', objectFit: 'cover', cursor: 'pointer', borderRadius: '5px' }} />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .product-image-slider-container {
          width: 100%;
          max-width: 600px; /* Adjust as needed */
          margin: 0 auto;
          position: relative; /* Needed for fullscreen positioning */
        }

        .product-image-slider-container.fullscreen-active {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.9);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .product-image-slider-container.fullscreen-active .mySwiper2 {
          width: 90%;
          height: 80%;
        }

        .product-image-slider-container.fullscreen-active .mySwiper {
          width: 90%;
          margin-top: 20px;
        }

        .fullscreen-toggle-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 5px;
          padding: 8px;
          cursor: pointer;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fullscreen-close-button {
          top: 20px;
          right: 20px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10000;
          font-size: 1.5rem;
        }

        .swiper-slide img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain; /* Ensure entire image is visible */
        }

        .swiper-button-next, .swiper-button-prev {
          color: #FFEB3B !important; /* Custom navigation color */
          display: none; /* Hidden by default */
        }

        @media (min-width: 769px) {
          .swiper-button-next, .swiper-button-prev {
            display: flex; /* Visible on larger screens */
          }
        }

        .swiper-pagination-bullet-active {
          background-color: #FFEB3B !important; /* Custom pagination color */
        }

        .mySwiper .swiper-slide {
          opacity: 0.4;
        }

        .mySwiper .swiper-slide-thumb-active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ImageSlider;
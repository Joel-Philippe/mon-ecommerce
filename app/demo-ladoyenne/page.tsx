"use client";

import React from 'react';
import './demo-ladoyenne.css';
import products from './products.js';

const DemoLadoyenne = () => {
  return (
    <div className="demo-container">
      <section className="hero">
        <h1>La Doyenne</h1>
        <p>Épicerie africaine et alimentation générale à Belfort.</p>
      </section>

      <section className="categories">
        <h2>Catégories</h2>
        <ul>
          <li>Épices</li>
          <li>Riz & féculents</li>
          <li>Boissons</li>
          <li>Conserves</li>
          <li>Produits frais</li>
          <li>Hygiène</li>
        </ul>
      </section>

      <section className="products">
        <h2>Produits</h2>
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <h4>{product.name}</h4>
            <p>💲{product.price.toFixed(2)}</p>
            <p>{product.description}</p>
            <button>Commander</button>
          </div>
        ))}
      </section>

      <section className="pickup-info">
        <h2>Retrait en Boutique</h2>
        <p>Retirez vos produits à notre boutique au 8 rue Aristide Briand, 90000 Belfort.</p>
      </section>

      <section className="contact-info">
        <h2>Contact</h2>
        <p>Pour toute question, contactez-nous au 📞 : 0123456789</p>
      </section>

    </div>
  );
};

export default DemoLadoyenne;
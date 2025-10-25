'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProfilePhotoForm from '@/components/ProfilePhotoForm';
import DisplayNameForm from '@/components/DisplayNameForm';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import DeleteAccountButton from '@/components/DeleteAccountButton';


import { FiUser, FiLock, FiAlertCircle, FiCamera } from 'react-icons/fi'; // Import icons for tabs

const AccountPage = () => {
  const auth = useAuth();
  const user = auth?.user;
  const authLoading = auth?.loading; // Assuming auth provides a loading state
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile'); // New state for active tab



  useEffect(() => {
    if (!authLoading && !user) { // Wait for auth loading to complete
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, router, authLoading]);

  if (authLoading || !user) { // Show loading while auth is loading or user is not available
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement du compte...</p>
      </div>
    );
  }

  return (
    <div className="account-page-container"> {/* Attach the ref */}
      <h1>Mon Compte</h1>

        {/* Navigation Menu */}
        <nav className="account-nav">
          <button
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FiUser /> Informations Personnelles
          </button>
          <button
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FiLock /> Sécurité
          </button>
          <button
            className={`nav-item ${activeTab === 'danger' ? 'active' : ''}`}
            onClick={() => setActiveTab('danger')}
          >
            <FiAlertCircle /> Zone de Danger
          </button>
        </nav>

        {/* Section Content based on activeTab */}
    

        {activeTab === 'personal' && (
          <section className="account-section">
            <h2>Informations Personnelles</h2>
            <DisplayNameForm />
          </section>
        )}

        {activeTab === 'security' && (
          <section className="account-section">
            <h2>Sécurité</h2>
            <ChangePasswordForm />
          </section>
        )}

        {activeTab === 'danger' && (
          <section className="account-section danger-zone">
            <h2>Zone de Danger</h2>
            <DeleteAccountButton />
          </section>
        )}
      </div>

      <style jsx>{`
        .account-page-container {
          max-width: 960px;
          margin: 40px auto;
          padding: 30px;
          border-radius: 16px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #e63198;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        h1 {
          font-size: 1.8em;
          font-weight: 700;
          color: #e63198;
          margin-bottom: 40px;
          text-align: center;
          letter-spacing: -0.02em;
        }

        .account-nav {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
          background-color: #f0f2f5;
          padding: 10px;
          border-radius: 12px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
          flex-wrap: wrap;
        }

        .nav-item {
          border: none;
          width: 100%;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 1em;
          font-weight: 600;
          color: #db8505;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-item:hover {
          color: #695747ff;
        }

        .nav-item.active {
          box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
          transform: translateY(-2px);
        }

        .account-section {
          border: 1px solid #e2e8f0;
          background-color: rgb(255, 246, 241);
          border-radius: 12px;
          padding: 25px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .account-section:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transform: translateY(-3px);
        }

        .account-section h2 {
          font-size: 1.8em;
          font-weight: 600;
          color: #374151;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e0e7ff;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .danger-zone {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        .danger-zone h2 {
          color: #dc2626;
          border-bottom-color: #fecaca;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .account-page-container {
            margin: 20px auto;
            padding: 20px;
            gap: 20px;
          }

          h1 {
            font-size: 2em;
            margin-bottom: 30px;
          }

          .account-section {
            padding: 15px;
            gap: 15px;
          }

          .account-section h2 {
            font-size: 1.5em;
            margin-bottom: 10px;
          }

          .account-nav {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            padding: 10px;
          }

          .nav-item {
            justify-content: center;
            padding: 10px 15px;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .account-page-container {
            margin: 10px;
            padding: 15px;
          }

          h1 {
            font-size: 1.8em;
            margin-bottom: 20px;
          }

          .account-section h2 {
            font-size: 1.3em;
          }
        }
      `}</style>
    </>
  );
};

export default AccountPage;

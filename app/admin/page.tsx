'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, updateDoc, doc, onSnapshot, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore';
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './admin.css';
import { db } from '@/components/firebaseConfig';
import AddCard from '@/components/AddCard';
import UpdateCardModal from '@/components/UpdateCardModal';
import { useAuth } from '@/contexts/AuthContext';
import { Card, SpecialRequest } from '@/types';

import { 
  FiLogOut, 
  FiPlus, 
  FiX, 
  FiEdit, 
  FiClipboard, 
  FiUsers, 
  FiShoppingBag, 
  FiTrendingUp,
  FiSettings,
  FiEye,
  FiTrash2,
  FiFilter,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';

interface Order {
  id: string;
  customer_email: string;
  displayName: string;
  totalPaid: number;
  createdAt: string;
  items: Array<{ title: string; count: number; price: number }>;
  status: string;
}

const AdminPage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [specialRequests, setSpecialRequests] = useState<SpecialRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentView, setCurrentView] = useState('products'); // 'products', 'requests', or 'orders'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showUpdateCard, setShowUpdateCard] = useState(false);
  const authContext = useAuth();



  if (!authContext) {
    // This case should ideally not be reached if AuthProvider is correctly wrapping the app
    // and admin access is checked. However, for TypeScript safety, we handle it.
    return null; // Or a loading component, or redirect to login
  }
  const { logout, user } = authContext;
  const router = useRouter();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 6000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 60000,
  };

  // Vérification admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (user) {
        const adminEmail = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL;
        if (user.email === adminEmail) {
          setIsAdmin(true);
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
      setLoadingAdminCheck(false);
    };
    checkAdminAccess();
  }, [user, router]);

  // Charger les cartes avec Firebase
  useEffect(() => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    const cardsCol = collection(db, 'cards');
    
    // Utiliser onSnapshot pour les mises à jour en temps réel
    const unsubscribe = onSnapshot(
      cardsCol,
      (snapshot) => {
        const cardsData = snapshot.docs.map(doc => ({
          ...(doc.data() as Card), // Explicitly cast doc.data() to Card
          _id: doc.id // Ensure _id from doc.id overwrites any _id from doc.data()
        }));
        setCards(cardsData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Erreur lors du chargement des cartes:', err);
        setError(err.message);
        setIsLoading(false);
      }
    );
    
    // Nettoyer l'abonnement
    return () => unsubscribe();
  }, [isAdmin]);

  // Charger les demandes spéciales
  useEffect(() => {
    if (!isAdmin) return;
    const fetchSpecialRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'specialRequests'));
        const requests: SpecialRequest[] = [];
        querySnapshot.forEach((doc) => {
          requests.push({ ...(doc.data() as SpecialRequest), id: doc.id });
        });
        setSpecialRequests(requests);
      } catch (error) {
        setError("Erreur lors de la récupération des demandes spéciales.");
      }
    };
    fetchSpecialRequests();
  }, [isAdmin]);

  // Fetch orders
  useEffect(() => {
    if (!isAdmin) return;

    const fetchOrders = async () => {
      try {
        const token = await user?.getIdToken();
        if (!token) {
          throw new Error('Authentication token not available.');
        }

        const response = await fetch('/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, [isAdmin, user]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleUpdateCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowUpdateCard(true);
  };


  // Supprimer une carte
  const deleteCard = async (cardId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    try {
      const cardRef = doc(db, 'cards', cardId);
      await deleteDoc(cardRef);
      console.log("✅ Carte supprimée avec l'ID :", cardId);
      alert('✅ Article supprimé avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression :', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Authentication token not available.');
      }

      const response = await fetch(`/api/admin/orders/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update the local state to reflect the change immediately
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Erreur lors de la mise à jour du statut de la commande.');
    }
  };

  const handleValidateRequest = async (request: SpecialRequest) => {
    try {
      // Implement logic to update the request status in Firebase
      const requestRef = doc(db, 'specialRequests', request.id);
      await updateDoc(requestRef, {
        status: 'accepted', // Or any other status you want to set
        updatedAt: serverTimestamp()
      });
      
      // Update local state to reflect the change
      setSpecialRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === request.id ? { ...req, status: 'accepted' } : req
        )
      );
      alert('Demande validée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la validation de la demande:', error);
      alert('Erreur lors de la validation de la demande.');
    }
  };

  // Filtrer les cartes
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || card.categorie === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtenir les catégories uniques
  const categories = [...new Set(cards.map(card => card.categorie).filter(Boolean))];

  if (loadingAdminCheck) {
    return (
      <div className="modern-admin-loading">
        <div className="loading-spinner"></div>
        <p>Vérification des droits administratifs...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <div className="modern-admin-container">
        {/* Header */}
        <header className="modern-admin-header">
          <div className="admin-header-content">
            <div className="admin-header-right">
              <div className="admin-user-info">
                <div className="user-avatar">
                  <img src={user?.photoURL || 'https://via.placeholder.com/40'} alt="Admin" />
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.displayName || 'Administrateur'}</span>
                  <span className="user-role">Admin</span>
                </div>
              </div>
              
              <button 
                className="logout-button"
                onClick={() => setShowLogoutModal(true)}
              >
                <FiLogOut />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon products">
              <FiShoppingBag />
            </div>
            <div className="stat-content">
              <h3>{cards.length}</h3>
              <p>Produits</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon requests">
              <FiClipboard />
            </div>
            <div className="stat-content">
              <h3>{specialRequests.length}</h3>
              <p>Demandes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">
              <FiUsers />
            </div>
            <div className="stat-content">
              <h3>{orders.length}</h3>
              <p>Commandes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon growth">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>+12%</h3>
              <p>Croissance</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="admin-action-bar">
          <div className="action-bar-left">
            <button 
              className={`tab-button ${currentView === 'products' ? 'active' : ''}`}
              onClick={() => setCurrentView('products')}
            >
              <FiShoppingBag />
              <span>Produits</span>
            </button>
            
            <button 
              className={`tab-button ${currentView === 'requests' ? 'active' : ''}`}
              onClick={() => setCurrentView('requests')}
            >
              <FiClipboard />
              <span>Demandes spéciales</span>
            </button>

            <button 
              className={`tab-button ${currentView === 'orders' ? 'active' : ''}`}
              onClick={() => setCurrentView('orders')}
            >
              <FiUsers />
              <span>Commandes</span>
            </button>
          </div>

          <div className="mobile-view-selector">
            <select value={currentView} onChange={(e) => setCurrentView(e.target.value)}>
              <option value="products">Produits</option>
              <option value="requests">Demandes</option>
              <option value="orders">Commandes</option>
            </select>
          </div>
          
          <div className="action-bar-right">
            <button 
              className="action-button primary"
              onClick={() => setShowAddCard(true)}
            >
              <FiPlus />
              <span>Ajouter</span>
            </button>
            
            <button 
              className="action-button secondary"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}
            >
              <FiRefreshCw />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {currentView === 'products' && (
            <div className="products-section">
              <div className="section-header">
                <h2>Gestion des produits</h2>
                <p>Gérez le catalogue de produits</p>
              </div>
              
              {/* Filters */}
              <div className="filters-bar">
                <div className="search-box">
                  <FiSearch />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="category-filter"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Products Grid */}
              <div className="products-grid">
                {filteredCards.map((card, index) => (
                  <div key={card._id || index} className="product-card">
                    <div className="product-image">
                      {card.images && card.images.length > 0 && (
                        <SlickSlider {...sliderSettings}>
                          {card.images.map((image, idx) => (
                            <div key={idx} className="slider-item">
                              <img src={image} alt={`Image ${idx + 1}`} />
                            </div>
                          ))}
                        </SlickSlider>
                      )}
                      
                      <div className="product-overlay">
                        <button 
                          className="overlay-button view"
                          title="Voir les détails"
                        >
                          <FiEye />
                        </button>
                        <button 
                          className="overlay-button edit"
                          onClick={() => handleUpdateCardClick(card)}
                          title="Modifier"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          className="overlay-button delete"
                          title="Supprimer"
                          onClick={() => {
                            if (card._id) {
                              deleteCard(card._id);
                            }
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    <div className="product-content">
                      <div className="product-header">
                        <h3>{card.title}</h3>
                        {card.price && (
                          <span className="product-price">{card.price} €</span>
                        )}
                      </div>
                      
                      <div className="product-seller">
                        <img src={card.photo_du_proposant || 'https://via.placeholder.com/24'} alt="Seller" />
                        <span>{card.prenom_du_proposant || 'Vendeur inconnu'}</span>
                      </div>
                      
                      <div className="product-meta">
                        <span className="product-category">{card.categorie}</span>
                        <span className="product-stock">Stock: {card.stock || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'requests' && (
            <div className="special-requests-section">
              <div className="section-header">
                <h2>Demandes spéciales</h2>
                <p>Gérez les demandes clients</p>
              </div>
              
              {isLoading ? (
                <div className="loading-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="loading-card"></div>
                  ))}
                </div>
              ) : specialRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FiClipboard />
                  </div>
                  <h3>Aucune demande spéciale</h3>
                  <p>Les nouvelles demandes apparaîtront ici</p>
                </div>
              ) : (
                <div className="requests-grid">
                  {specialRequests.map((request) => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <div className="request-status">
                          <span className={`status-badge ${request.status || 'pending'}`}>
                            {request.status === 'accepted' ? 'Acceptée' : 'En attente'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="request-content">
                        <div className="request-user">
                          <img src={request.senderPhoto || 'https://via.placeholder.com/40'} alt="User" />
                          <div>
                            <h4>{request.senderDisplayName}</h4>
                            <p>{request.senderEmail}</p>
                          </div>
                        </div>
                        
                        <div className="request-seller">
                          <img src={request.sellerPhoto || 'https://via.placeholder.com/32'} alt="Seller" />
                          <span>Vendeur: {request.sellerName}</span>
                        </div>
                        
                        <div className="request-products">
                          <h5>Produits demandés:</h5>
                          <p>{request.selectedProducts.map((p) => p.title).join(', ')}</p>
                        </div>
                      </div>
                      
                      {request.status !== 'accepted' && (
                        <div className="request-actions">
                          <button 
                            className="validate-button"
                            onClick={() => handleValidateRequest(request)}
                          >
                            Valider la demande
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'orders' && (
            <div className="orders-section">
              <div className="section-header">
                <h2>Toutes les commandes</h2>
                <p>Gérez les commandes des clients</p>
              </div>
              {isLoading ? (
                <div className="loading-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="loading-card"></div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FiUsers />
                  </div>
                  <h3>Aucune commande</h3>
                  <p>Les nouvelles commandes apparaîtront ici</p>
                </div>
              ) : (
                <div className="orders-table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Montant</th>
                        <th>Date</th>
                        <th>Articles</th>
                        <th>Statut</th>
                        <th>ID Commande</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td data-label="Client">{order.displayName}</td>
                          <td data-label="Email">{order.customer_email}</td>
                          <td data-label="Montant">{(order.totalPaid || 0).toFixed(2)} €</td>
                          <td data-label="Date">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                          <td data-label="Articles">
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index}>{item.count} x {item.title}</li>
                              ))}
                            </ul>
                          </td>
                          <td data-label="Statut">
                            <select
                              value={order.status || 'paid'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`status-select status-badge ${order.status || 'paid'}`}>
                              <option value="paid">Payée</option>
                              <option value="shipped">Expédiée</option>
                              <option value="delivered">Livrable</option>
                            </select>
                          </td>
                          <td data-label="ID Commande">{order.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {showLogoutModal && (
          <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Confirmation de déconnexion</h3>
                <button onClick={() => setShowLogoutModal(false)}>
                  <FiX />
                </button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
              </div>
              <div className="modal-actions">
                <button 
                  className="button secondary"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className="button danger"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddCard && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAddCard(false); }}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Ajouter un produit</h3>
              </div>
              <div className="modal-body">
                <AddCard isOpen={showAddCard} onClose={() => setShowAddCard(false)} />
              </div>
            </div>
          </div>
        )}

        {showUpdateCard && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowUpdateCard(false); }}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Modifier le produit</h3>
              </div>
              <div className="modal-body">
                <UpdateCardModal
                  formCard={selectedCard}
                  onClose={() => setShowUpdateCard(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>


    </>
  );
};

export default AdminPage;

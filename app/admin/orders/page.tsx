
// Dummy comment to force a file change
import { useAuth } from '@/contexts/AuthContext';

// Définition du type pour une commande
interface Order {
  id: string;
  customer_email: string;
  displayName: string;
  totalPaid: number;
  createdAt: string;
  items: Array<{ title: string; count: number; price: number }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

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
  }, [user, authLoading, router]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin, user]);

  if (authLoading || loadingAdminCheck || loading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

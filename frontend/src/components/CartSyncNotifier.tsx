import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartSyncNotifier: React.FC = () => {
  const { syncMessage, clearSyncMessage } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (syncMessage) {
      showToast(syncMessage, 'success');
      clearSyncMessage();
    }
  }, [syncMessage]);

  return null;
};

export default CartSyncNotifier;

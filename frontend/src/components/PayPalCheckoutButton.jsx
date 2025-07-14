import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

/**
 * PayPalCheckoutButton handles the PayPal payment flow.
 * After successful payment capture, it calls the backend /order/process
 * endpoint to complete the order and redirects the user to their purchase history.
 *
 * Props:
 *  - amount (string | number): total amount to be charged (string recommended, e.g. "49.99")
 *  - onSuccess (function): optional callback executed after order processing success
 */
const PayPalCheckoutButton = ({ amount, onSuccess }) => {
  const navigate = useNavigate();

  const initialOptions = {
    'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: 'USD',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: typeof amount === 'number' ? amount.toFixed(2) : amount,
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            await actions.order.capture();
            // Notify backend to process the order in the system
            await api.post('/order/process', null, {params: {paypalOrderId: data.orderID}});
            toast.success('Payment successful! Order processed.');
            if (onSuccess) onSuccess();
            // Redirect user to purchase history page
            navigate('/purchase-history');
          } catch (err) {
            console.error('Error completing order:', err);
            toast.error('Payment captured but order processing failed.');
          }
        }}
        onError={(err) => {
          console.error('PayPal Checkout error:', err);
          toast.error('Payment failed. Please try again.');
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckoutButton; 
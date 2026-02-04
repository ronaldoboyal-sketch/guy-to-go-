import React, { useState } from 'react';
import { CartItem, SubscriptionStatus, User } from '../types';
import { StorageService } from '../services/storageService';
import { MMG_INSTRUCTIONS } from '../constants';
import { Trash, CreditCard, DollarSign, AlertCircle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, removeFromCart, clearCart }) => {
  const navigate = useNavigate();
  const [isCheckout, setIsCheckout] = useState(false);
  const [formData, setFormData] = useState({
    transactionId: '',
    senderName: '',
    senderPhone: ''
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const user = StorageService.getUser();

  const handleCheckoutClick = () => {
    if (!user) {
        navigate('/login');
        return;
    }
    setIsCheckout(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const request = {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        type: 'ORDER' as const,
        amount: total,
        items: cart,
        transactionId: formData.transactionId,
        mmgSenderName: formData.senderName,
        mmgSenderPhone: formData.senderPhone,
        dateSubmitted: new Date().toISOString(),
        status: SubscriptionStatus.PENDING
    };

    StorageService.addPaymentRequest(request);
    setOrderSubmitted(true);
    clearCart();
  };

  if (orderSubmitted) {
      return (
          <div className="max-w-2xl mx-auto py-16 px-4 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Order Submitted!</h2>
              <p className="mt-4 text-lg text-slate-500">
                  Your order has been placed and is pending verification. <br/>
                  Once approved, your files will be available in your <b>Profile &gt; My Digital Library</b>.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                  Continue Shopping
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-slate-200">
            <p className="text-slate-500">Your cart is empty.</p>
            <button onClick={() => navigate('/')} className="mt-4 text-green-600 hover:text-green-700 font-medium">Browse Store</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200 h-fit">
                <ul className="divide-y divide-slate-200">
                    {cart.map((item) => (
                    <li key={item.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={item.imageUrl} alt="" className="h-16 w-16 object-cover rounded mr-4" />
                            <div>
                                <h3 className="text-sm font-medium text-slate-900">{item.title}</h3>
                                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                <p className="text-sm font-bold text-green-600">GYD ${item.price.toLocaleString()}</p>
                            </div>
                        </div>
                        {!isCheckout && (
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 p-2"
                            >
                                <Trash className="h-5 w-5" />
                            </button>
                        )}
                    </li>
                    ))}
                </ul>
                <div className="bg-slate-50 px-4 py-4 sm:px-6 flex justify-between items-center border-t border-slate-200">
                    <div className="text-lg font-bold text-slate-900">
                        Total: GYD ${total.toLocaleString()}
                    </div>
                    {!isCheckout && (
                        <div className="space-x-4">
                            <button onClick={clearCart} className="text-sm text-slate-500 hover:text-slate-700">Clear</button>
                            <button 
                                onClick={handleCheckoutClick}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                            >
                                Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Checkout Form Area */}
            {isCheckout && (
                <div className="bg-white shadow sm:rounded-lg border border-slate-200 p-6 h-fit">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                         <span className="bg-red-600 text-white rounded px-2 py-0.5 text-xs mr-2">MMG</span>
                         Payment Required
                    </h2>
                    
                    <div className="bg-slate-50 p-3 rounded text-sm text-slate-700 mb-4 whitespace-pre-line border border-slate-100">
                        {MMG_INSTRUCTIONS}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700">MMG Transaction ID</label>
                            <input
                                type="text"
                                required
                                value={formData.transactionId}
                                onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700">Sender Name</label>
                            <input
                                type="text"
                                required
                                value={formData.senderName}
                                onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 text-sm"
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-slate-700">Sender Phone</label>
                            <input
                                type="tel"
                                required
                                value={formData.senderPhone}
                                onChange={(e) => setFormData({...formData, senderPhone: e.target.value})}
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 text-sm"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                                Submit & Place Order
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCheckout(false)}
                                className="w-full mt-2 text-center text-xs text-slate-500 hover:text-slate-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Cart;
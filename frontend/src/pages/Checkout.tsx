import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  shippingAddress: yup.string().required('Shipping address is required'),
  paymentMethod: yup.string().required('Payment method is required'),
});

interface CheckoutFormData {
  shippingAddress: string;
  paymentMethod: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      shippingAddress: user?.address || '',
      paymentMethod: 'credit_card'
    }
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsPlacingOrder(true);
      const order = await orderService.createOrder({
        shipping_address: data.shippingAddress,
        payment_method: data.paymentMethod
      });
      
      // Clear cart after successful order
      await clearCart();
      
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      
      // Handle different error formats
      let message = 'Failed to place order';
      
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              
              <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address
                </label>
                <textarea
                  {...register('shippingAddress')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full shipping address"
                />
                {errors.shippingAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.message}</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="credit_card"
                    className="mr-3"
                  />
                  <span>Credit Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="debit_card"
                    className="mr-3"
                  />
                  <span>Debit Card</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="paypal"
                    className="mr-3"
                  />
                  <span>PayPal</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="cash_on_delivery"
                    className="mr-3"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPlacingOrder}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isPlacingOrder ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.product?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.product?.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-xl font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p>By placing your order, you agree to our terms and conditions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

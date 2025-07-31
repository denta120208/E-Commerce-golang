import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      
      // Handle backend response format: { orders: [...] }
      if (response.orders) {
        setOrders(response.orders);
      } else if (response.data) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Orders</h1>
          <p className="text-gray-600 mb-6">
            Please login to view your orders.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders && orders.length > 0 ? orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Order Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order #{order.id}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Placed on {formatDate(order.created_at || order.createdAt || '')}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    ${(order.total_amount || order.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4">
              <div className="space-y-3">
                {(order.order_items || order.orderItems || []).map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16">
                      <img
                        src={item.product?.image || '/placeholder-product.svg'}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product?.name || 'Unknown Product'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${((item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Shipping Address:</p>
                  <p className="text-gray-600 mt-1">{order.shipping_address || order.shippingAddress}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payment Method:</p>
                  <p className="text-gray-600 mt-1 capitalize">
                    {(order.payment_method || order.paymentMethod || '').replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12">
            <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

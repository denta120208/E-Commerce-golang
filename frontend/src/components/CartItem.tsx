import React, { useState } from 'react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../hooks/useCart';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await updateCartItem(parseInt(item.id), newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(parseInt(item.id));
  };

  const product = item.product;
  const maxQuantity = product?.stock || 99;

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="flex-shrink-0 w-20 h-20 mr-4">
        <img
          src={product?.image || '/placeholder-product.jpg'}
          alt={product?.name || 'Product'}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {product?.name || 'Unknown Product'}
        </h3>
        <p className="text-gray-500 text-sm truncate">
          {product?.description || 'No description available'}
        </p>
        <p className="text-blue-600 font-semibold">
          ${product?.price?.toFixed(2) || '0.00'}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2 mx-4">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        
        <span className="w-12 text-center font-medium">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating || item.quantity >= maxQuantity}
          className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="flex-shrink-0 w-24 text-right">
        <p className="text-lg font-semibold text-gray-900">
          ${item.subtotal.toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0 ml-4">
        <button
          onClick={handleRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Remove item"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from "react-toastify";

interface CartItem {
  product_id: number;
  quantity: number;
  // Add other cart item properties as needed
}

export default function CartSubmitButton({ cart }: { cart: CartItem[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitCart = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products: cart }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to place order");
      }

      // Success - redirect to order details
      router.push(`/orders/${data.data.id}`);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      } else {
        toast.error("Failed to fetch orders");
        setError("Failed to place order");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={submitCart}
        disabled={isSubmitting || cart.length === 0}
        className={`w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ${
          isSubmitting || cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
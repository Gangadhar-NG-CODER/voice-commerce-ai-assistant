'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface ShoppingCartProps {
  messages: any[];
}

export function ShoppingCartComponent({ messages }: ShoppingCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string>('');

  useEffect(() => {
    // Parse messages for order confirmations
    const agentMessages = messages.filter((msg) => !msg.from?.isLocal);
    
    // Check all messages for new orders
    for (const message of agentMessages) {
      const text = message.message || '';
      
      // Look for "Order placed successfully" messages
      if (text.includes('Order placed successfully')) {
        // Extract order ID
        const orderIdMatch = text.match(/ORD-\d+/);
        if (orderIdMatch && orderIdMatch[0] !== lastOrderId) {
          const orderId = orderIdMatch[0];
          setLastOrderId(orderId);
          
          console.log('🛒 Cart: New order detected!', orderId);
          console.log('🛒 Cart: Full message:', text);
          
          // Extract product details - match format: "- Product Name x Quantity = Total INR"
          const productMatch = text.match(/-\s*([^x\n]+?)\s*x\s*(\d+)\s*=\s*(\d+)\s*INR/);
          if (productMatch) {
            const productName = productMatch[1].trim();
            const quantity = parseInt(productMatch[2]);
            const totalPrice = parseInt(productMatch[3]);
            const unitPrice = totalPrice / quantity;
            
            // Extract size if present
            const sizeMatch = text.match(/\(Size:\s*([A-Z]+)\)/i);
            const size = sizeMatch ? sizeMatch[1] : undefined;
            
            // Extract color if present
            const colorMatch = text.match(/\(Color:\s*(\w+)\)/i);
            const color = colorMatch ? colorMatch[1] : undefined;
            
            const newItem: CartItem = {
              productName,
              quantity,
              price: unitPrice,
              size,
              color,
            };
            
            console.log('🛒 Cart: Adding item:', newItem);
            setCartItems((prev) => [...prev, newItem]);
            setIsOpen(true); // Auto-open cart when item added
          } else {
            console.error('🛒 Cart: Failed to parse product from message');
            console.log('🛒 Cart: Trying to match:', text);
          }
        }
      }
    }
  }, [messages, lastOrderId]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Cart Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 right-4 z-[60] flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-lg hover:bg-emerald-700 transition-colors pointer-events-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-600"
          >
            {totalItems}
          </motion.span>
        )}
      </motion.button>

      {/* Cart Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            />

            {/* Cart Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[80] h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Start shopping by asking the assistant!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                          <span className="font-bold text-emerald-600">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Items ({totalItems})</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-emerald-600">₹{totalPrice}</span>
                    </div>
                  </div>
                  <div className="text-center text-xs text-gray-500">
                    Orders are confirmed via voice assistant
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

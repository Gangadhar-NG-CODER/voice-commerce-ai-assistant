'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  total: number;
  timestamp: string;
}

interface OrderSummaryPopupProps {
  messages: any[];
}

export function OrderSummaryPopup({ messages }: OrderSummaryPopupProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [processedOrderIds, setProcessedOrderIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log('📦 OrderSummaryPopup: Processing', messages.length, 'messages');
    console.log('📦 Current orders:', orders.length);
    
    const agentMessages = messages.filter((msg) => !msg.from?.isLocal);
    
    for (const message of agentMessages) {
      const text = message.message || '';
      
      // Track orders from "Order placed successfully" messages
      const hasOrderConfirmation = text.includes('Order placed successfully');
      
      if (hasOrderConfirmation) {
        // Extract order details from the confirmation message
        // Format: "Order ORD-XXX - Status: CONFIRMED\n\nItems:\n- ProductName x Qty = Total INR\n\nTotal: XXX INR"
        const orderIdMatch = text.match(/Order (ORD-\d+)/);
        if (orderIdMatch && !processedOrderIds.has(orderIdMatch[1])) {
          const orderId = orderIdMatch[1];
          
          // Extract items
          const itemMatches = text.matchAll(/-\s*([^x]+?)\s*x\s*(\d+)\s*=\s*(\d+)\s*INR/g);
          const items: OrderItem[] = [];
          let orderTotal = 0;
          
          for (const match of itemMatches) {
            const productName = match[1].trim();
            const quantity = parseInt(match[2]);
            const itemTotal = parseInt(match[3]);
            const unitPrice = itemTotal / quantity;
            
            items.push({
              productName,
              quantity,
              price: unitPrice,
            });
            
            orderTotal += itemTotal;
          }
          
          if (items.length > 0) {
            const newOrder: Order = {
              orderId,
              items,
              total: orderTotal,
              timestamp: new Date().toLocaleTimeString(),
            };
            
            console.log('📦 Order tracked:', newOrder);
            setOrders((prev) => [...prev, newOrder]);
            setProcessedOrderIds((prev) => new Set([...prev, orderId]));
          }
        }
      }
      
      // Show popup when agent gives complete order summary
      const hasCompleteSummary = 
        text.toLowerCase().includes("here's your complete order summary") ||
        text.toLowerCase().includes("here is your complete order summary") ||
        text.toLowerCase().includes("your grand total is") ||
        text.toLowerCase().includes("thank you for shopping with us") ||
        (text.toLowerCase().includes("glass coffee mug") && text.toLowerCase().includes("rupees") && text.toLowerCase().includes("total"));
      
      if (hasCompleteSummary) {
        console.log('📦 Agent giving complete summary! Orders tracked:', orders.length);
        if (orders.length > 0) {
          console.log('📦 Showing popup now!');
          setShowPopup(true);
        } else {
          console.log('📦 No orders tracked yet');
        }
      }
    }
    
    // Also check user messages for manual trigger
    const userMessages = messages.filter((msg) => msg.from?.isLocal);
    const lastUserMessage = userMessages[userMessages.length - 1];
    if (lastUserMessage) {
      const userText = lastUserMessage.message || '';
      const userWantsSummary = 
        userText.toLowerCase().includes("show summary") ||
        userText.toLowerCase().includes("show my order") ||
        userText.toLowerCase().includes("view order") ||
        userText.toLowerCase().includes("checkout");
      
      if (userWantsSummary && orders.length > 0) {
        console.log('📦 User requested summary!');
        setShowPopup(true);
      }
    }
  }, [messages, processedOrderIds, orders.length]);

  const totalItems = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  
  const grandTotal = orders.reduce((sum, order) => sum + order.total, 0);

  // Debug: Log button visibility
  console.log('📦 Button should be visible:', orders.length > 0 && !showPopup);
  console.log('📦 Orders count:', orders.length, 'Popup open:', showPopup);

  return (
    <>
      {/* Show Summary Button - Only visible when orders exist and popup is closed */}
      {orders.length > 0 && !showPopup && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => {
            console.log('📦 Manual button click - showing summary!');
            setShowPopup(true);
          }}
          className="fixed bottom-24 right-4 z-[60] flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-white shadow-lg hover:bg-emerald-700 transition-colors pointer-events-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-semibold">Show Summary</span>
          {orders.length > 0 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-600">
              {orders.length}
            </span>
          )}
        </motion.button>
      )}
      
      <AnimatePresence>
      {showPopup && orders.length > 0 && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          />

          {/* Order Summary Popup - Dark Modern Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-[80] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-800 shadow-2xl border border-slate-700"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header - Success Badge */}
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h2>
            </div>

            {/* Order Details */}
            <div className="px-8 pb-8">
              {/* Order Info */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono text-slate-200">{orders[orders.length - 1]?.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Time:</span>
                  <span className="text-slate-200">{new Date().toLocaleString()}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Items</h3>
                <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                  {orders.map((order, orderIndex) => (
                    <div key={order.orderId}>
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-slate-200">
                              {item.productName} × {item.quantity}
                            </p>
                            {(item.size || item.color) && (
                              <p className="text-xs text-slate-400 mt-1">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && ' • '}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            )}
                          </div>
                          <p className="text-blue-400 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-300">Total</span>
                  <span className="text-2xl font-bold text-blue-400">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Download order as JSON
                    const orderData = {
                      orders,
                      total: grandTotal,
                      timestamp: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(orderData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `order-${orders[orders.length - 1]?.orderId}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 rounded-lg bg-slate-700 py-3 font-semibold text-slate-200 hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download JSON
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}

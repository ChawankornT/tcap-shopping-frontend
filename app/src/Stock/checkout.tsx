"use client";

import { useContext, useState } from "react";
import { CartContext } from "./page";
import axios from "axios";

export default function CheckoutPage() {
  const { cart, setCart, isCheckout, setCheckout } = useContext(CartContext);
  const [stock, setStock] = useState([]);

  const handleCheckout = async () => {
    try {
      const res = async () => {
        cart.forEach(async (item: any) => {
          const payload = {
            id: item.id,
            productCode: item.productCode,
            productName: item.productName,
            quantity: item.quantity,
          };
          await axios.post(
            "http://localhost:5080/Stock/DecrementStock",
            payload
          );
        });
      };

      await res();
      setCart([]);
      setCheckout(false);
      alert("Checkout successful!");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  const totalAmount = () => {
    return cart.reduce((sum, item) => {
      return sum + item.pricePerUnit * item.quantity;
    }, 0);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">Checkout Page</h1>
      {cart.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <ul>
            {cart.map((item: any) => (
              <li key={item.id}>
                {item.productName}: {item.quantity} x {item.pricePerUnit} บาท
              </li>
            ))}
          </ul>

          <div className="mt-4">รวม: {totalAmount()} บาท</div>
          <button
            onClick={handleCheckout}
            className="mt-4 p-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            Checkout
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

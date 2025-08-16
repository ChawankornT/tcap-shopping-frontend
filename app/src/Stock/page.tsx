"use client";

import axios from "axios";
import { useState, useEffect, createContext } from "react";
import CheckoutPage from "./checkout";

export const CartContext = createContext<any>(undefined);

export default function StockPage() {
  const [stock, setStock] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCheckout, setCheckout] = useState(false);

  const fetchStock = async () => {
    try {
      const stockdata = await axios.get(
        "http://localhost:5080/Stock/GetStocks"
      );
      setStock(stockdata.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []); // fetch on start

  useEffect(() => {
    fetchStock();
  }, [isCheckout]);

  const handleAddToCart = (stock: any) => {
    setCart((prev: any) => {
      const existing = prev.find((item: any) => item.id === stock.id);
      if (existing) {
        if (existing.quantity < stock.quantity) {
          return prev.map((item: any) =>
            item.id === stock.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prev;
      }
      return [...prev, { ...stock, quantity: 1 }];
    });
  };

  const handleDecreaseFromCart = (stock: any) => {
    setCart((prev: any) => {
      const existing = prev.find((item: any) => item.id === stock.id);
      if (existing && existing.quantity > 1) {
        return prev.map((item: any) =>
          item.id === stock.id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item: any) => item.id !== stock.id);
    });
  };

  const handleRemoveFromCart = (stock: any) => {
    setCart((prev: any) => prev.filter((item: any) => item.id !== stock.id));
  };

  return (
    <div>
      {isCheckout && cart.length > 0 && stock.length > 0 ? (
        <CartContext.Provider
          value={{ cart, setCart, isCheckout, setCheckout }}
        >
          <CheckoutPage />
        </CartContext.Provider>
      ) : (
        <div className="flex flex-col items-center p-4">
          <h1 className="text-2xl font-bold">Stock Page</h1>

          {stock.map((item: any) => (
            <div
              key={item.id}
              className="border p-4 m-2 w-60 flex flex-col items-center"
            >
              <h2 className="text-lg font-bold">{item.productName}</h2>
              <p>ราคา: {item.pricePerUnit} บาท</p>

              {cart.some((cartItem: any) => cartItem.id === item.id) ? (
                <div>
                  <p>
                    จำนวนสินค้าในตะกร้า:{" "}
                    {
                      cart.find((cartItem: any) => cartItem.id === item.id)
                        ?.quantity
                    }
                  </p>
                  <button
                    className={`m-2 w-10 h-10 bg-green-500 text-white rounded cursor-pointer`}
                    onClick={() => handleAddToCart(item)}
                  >
                    +
                  </button>
                  <button
                    className="m-2 w-10 h-10 bg-yellow-500 text-white rounded cursor-pointer"
                    onClick={() => handleDecreaseFromCart(item)}
                  >
                    -
                  </button>
                  <button
                    className="m-2 w-10 h-10 bg-red-500 text-white rounded cursor-pointer"
                    onClick={() => handleRemoveFromCart(item)}
                  >
                    ลบ
                  </button>
                </div>
              ) : (
                <button
                  className={`mt-2 p-2 ${
                    item.quantity <= 0
                      ? "bg-gray-400 text-white"
                      : "bg-green-500 text-white rounded cursor-pointer"
                  }`}
                  onClick={() => handleAddToCart(item)}
                  disabled={item.quantity <= 0}
                >
                  เพิ่มลงตะกร้า
                </button>
              )}
            </div>
          ))}

          <div>
            <button
              className="m-2 w-20 h-10 bg-red-500 text-white rounded cursor-pointer"
              onClick={() => setCart([])}
            >
              Clear
            </button>
            <button
              className="m-2 w-20 h-10 bg-blue-500 text-white rounded cursor-pointer"
              onClick={() => setCheckout(true)}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

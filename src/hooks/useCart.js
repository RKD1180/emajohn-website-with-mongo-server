import { useState } from "react";
import { useEffect } from "react";
import { getStoredCart } from "../utilities/fakedb";

const useCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedProduct = getStoredCart();
    console.log(savedProduct);
    const keys = Object.keys(savedProduct);
    fetch("http://localhost:5000/products/bykeys", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(keys),
    })
      .then((res) => res.json())
      .then((products) => {
        console.log(products);
        if (products.length) {
          const storeCart = [];
          for (const key in savedProduct) {
            const cartProduct = products.find((product) => product.key === key);

            if (cartProduct) {
              const quantity = savedProduct[key];
              cartProduct.quantity = quantity;
              storeCart.push(cartProduct);
            }
          }
          setCart(storeCart);
        }
      });
  }, []);

  return [cart, setCart];
};

export default useCart;

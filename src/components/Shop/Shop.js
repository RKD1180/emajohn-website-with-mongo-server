import React, { useEffect } from "react";
import { useState } from "react";
import { addToDb, getStoredCart } from "../../utilities/fakedb";
import Carts from "../Cart/Carts";
import Product from "../Product/Product";
import { Link } from "react-router-dom";
import "./Shop.css";
import useCart from "./../../hooks/useCart";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [displayproducts, setDisplayproducts] = useState([]);
  const [cart, setCart] = useCart();
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const size = 10;

  useEffect(() => {
    fetch(`http://localhost:5000/products?page=${page}&&size=${size}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setDisplayproducts(data.products);
        const count = data.count;
        const pageNumber = Math.ceil(count / size);
        setPageCount(pageNumber);
      });
  }, [page]);

  const handleAddToCart = (product) => {
    const exists = cart.find((pd) => pd.key === product.key);
    let newCart = [];
    if (exists) {
      const rest = cart.filter((pd) => pd.key !== product.key);
      exists.quantity = exists.quantity + 1;
      newCart = [...rest, product];
    } else {
      product.quantity = 1;
      newCart = [...cart, product];
    }

    setCart(newCart);

    // save to local storage

    console.log(product.key);
    addToDb(product.key);
  };

  const handleSearch = (fetch) => {
    const getInput = fetch.target.value;
    const filterSearch = products.filter((product) =>
      product.name.toLowerCase().includes(getInput.toLowerCase())
    );
    setDisplayproducts(filterSearch);
  };

  return (
    <div className="show_products">
      <div className="search bg-dark p-2  ">
        <form className="d-flex w-50 mx-auto">
          <input
            onChange={handleSearch}
            className="form-control me-2 "
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-warning" type="submit">
            Search
          </button>
        </form>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            {displayproducts.map((product) => (
              <Product
                product={product}
                key={product.key}
                handleAddToCart={handleAddToCart}
              ></Product>
            ))}
            <div className="pagination mx-auto mb-5">
              {[...Array(pageCount).keys()].map((number) => (
                <button
                  className={
                    number === page ? "selected" : "btn btn-primary me-3 "
                  }
                  key={number}
                  onClick={() => setPage(number)}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="col-md-3 mt-4">
            <Carts cart={cart}>
              <div className="mx-2 mt-2">
                <Link to="/order_review">
                  <button className="btn btn-warning mx-5 ">
                    Review Order
                  </button>
                </Link>
              </div>
            </Carts>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

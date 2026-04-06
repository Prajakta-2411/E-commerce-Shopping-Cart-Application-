import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Navbar from "./components/Navbar";
import Products from "./pages/Product";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Deals from "./pages/Deals";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

function App() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/categories" element={<Categories />} />

        <Route path="/category/:categoryName" element={<Category />} />

        <Route path="/deals" element={<Deals />} />

        <Route path="/details/:productId" element={<Details />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<Orders />} />

      </Routes>

      <Toaster
        toastOptions={{
          style: {
            background: "#7c3aed", // purple
            color: "#ffffff",      // white text
            border: "none",
          },
        }}
      />
    </>
  );
}

export default App;
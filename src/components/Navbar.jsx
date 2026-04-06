import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Heart,
  ShoppingCart,
} from "lucide-react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { items } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const desktopNavItems = ["Home", "Products", "Categories", "Orders", "Deals"];
  const mobileNavItems = [...desktopNavItems, "Wishlist"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
          Modern<span className="text-primary">Store</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `text-sm font-medium hover:text-foreground transition-colors ${isActive ? "text-purple-500" : "text-muted-foreground"}`}
            >
              {item}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden md:flex w-10 h-10 rounded-full bg-secondary items-center justify-center hover:bg-accent transition-colors relative"
          >
            <Heart size={18} className="text-muted-foreground" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors relative"
          >
            <ShoppingCart size={18} className="text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {items.length}
            </span>
          </Link>

          {/* Clerk Auth */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-2 text-sm bg-purple-500 text-white rounded-lg">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={18} className="text-muted-foreground" />
            ) : (
              <Menu size={18} className="text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-border bg-card/95 backdrop-blur-lg"
          >
            <div className="px-4 sm:px-6 py-4 flex flex-col gap-2">
              {mobileNavItems.map((item) => (
                <NavLink
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `text-sm font-medium px-4 py-3 rounded-xl transition-colors ${isActive
                      ? "text-purple-500 bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
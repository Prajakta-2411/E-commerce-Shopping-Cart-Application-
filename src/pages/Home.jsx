import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  Menu,
  X,
  RotateCcw,
  ArrowRight,
  Smartphone,
  Watch,
  Home as HomeIcon,
  Shirt,
  Star,
  Heart,
  ShoppingCart,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-product.jpg";
import Navbar from "../components/Navbar";
import { toast } from "sonner";
import Card from "../components/Card";

// --- Shared Animation ---
const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
};

// --- Sub-components ---

const SectionTag = ({ children }) => (
  <span className="section-tag">{children}</span>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <motion.div
    {...fadeIn}
    className="flex flex-col items-start p-8 border border-border bg-card rounded-2xl transition-all duration-300 hover:shadow-(--card-shadow-hover)"
  >
    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-6">
      <Icon className="w-5 h-5 text-accent-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
  </motion.div>
);

const CategoryCard = ({ icon: Icon, name, count }) => (
  <Link
    to={`/category/${name.toLowerCase()}`}
    className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-(--card-shadow-hover)"
  >
    <div className="relative z-10">
      <div className="w-12 h-12 mb-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
        <Icon size={22} />
      </div>
      <p className="font-semibold text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground mt-1">{count} Products</p>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
      <Icon size={120} />
    </div>
  </Link>
);

const ProductCard = ({ image, name, price, oldPrice = null, rating }) => (
  <motion.div
    {...fadeIn}
    className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-(--card-shadow-hover)"
  >
    <div className="relative aspect-square bg-secondary overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
        <Heart size={18} />
      </button>
    </div>
    <div className="p-5">
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < rating ? "fill-primary text-primary" : "text-border"}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating}.0)</span>
      </div>
      <h3 className="font-semibold text-foreground text-sm">{name}</h3>
      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold text-foreground">{price}</span>
        {oldPrice && (
          <span className="text-sm text-muted-foreground line-through">{oldPrice}</span>
        )}
      </div>
      <Button variant="outline" size="sm" className="w-full mt-4 gap-2 rounded-full">
        <ShoppingCart size={14} />
        Add to Cart
      </Button>
    </div>
  </motion.div>
);

// --- Main Page ---

function Home() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  function handleSubscribe(e) {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const isValid = /\S+@\S+\.\S+/.test(email);

    if (!isValid) {
      toast.error("Enter a valid email");
      return;
    }

    toast.success("Subscribed successfully 🎉");
    setEmail("");
  }

  const sampleProducts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
      name: "Classic Minimalist Watch",
      price: 59.99,
      oldPrice: 79.99,
      discountPercentage: 25,
      rating: 5
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
      name: "Premium Wireless Headphones",
      price: 39.99,
      rating: 4
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600",
      name: "Instant Camera Retro",
      price: 64.99,
      oldPrice: 89.99,
      discountPercentage: 27,
      rating: 4

    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=600",
      name: "Sport Running Shoes",
      price: 34.99,
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAVBAR */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden px-4 sm:px-6">
        <div className="max-w-7xl mx-auto px-0 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeIn}>
            <SectionTag>New Collection {currentYear}</SectionTag>
            <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] mb-8 text-foreground">
              Shop Your
              <br />
              Favourite{" "}
              <span className="text-purple-600">Products</span> Online.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-10 leading-relaxed">
              Discover amazing deals on electronics, fashion, and more.
              Fast delivery, secure payment, and hassle-free returns.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/products" className="h-14 px-8">
                  Shop Now
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/categories" className="h-14 px-8">
                  Explore Categories
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-xs text-muted-foreground mt-1">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">10K+</p>
                <p className="text-xs text-muted-foreground mt-1">Products</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">4.8★</p>
                <p className="text-xs text-muted-foreground mt-1">Average Rating</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="relative aspect-square lg:aspect-auto lg:h-[600px] bg-secondary rounded-[2rem] overflow-hidden"
          >
            <img
              src={heroImage}
              alt="Premium products collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 p-5 bg-card/80 backdrop-blur-md rounded-xl border border-border flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Featured
                </p>
                <p className="font-semibold text-foreground">Series 7 Minimalist Watch</p>
              </div>
              <p className="font-mono font-semibold text-foreground">₹4,999</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Truck}
            title="Free Shipping"
            desc="Free express delivery on all orders above ₹999. Tracked from our warehouse to your doorstep."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Secure Payment"
            desc="100% secure and encrypted payments via UPI, Cards, and Wallets. Your data is never stored."
          />
          <FeatureCard
            icon={RotateCcw}
            title="Easy Returns"
            desc="Not satisfied? Return any item within 7 days for a full refund. No questions asked."
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
            <div>
              <SectionTag>Departments</SectionTag>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/products"
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary"
            >
              View All
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CategoryCard icon={Smartphone} name="Electronics" count="124" />
            <CategoryCard icon={Shirt} name="Fashion" count="450" />
            <CategoryCard icon={Watch} name="Accessories" count="89" />
            <CategoryCard icon={HomeIcon} name="Home & Living" count="210" />
          </div>
        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
            <div>
              <SectionTag>Popular Now</SectionTag>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Trending Products
              </h2>
            </div>
            <Link
              to="/products"
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary"
            >
              See All
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts.map((prod, i) => (
              <Card
                img={prod.image}
                price={prod.price}
                productId={prod.id}
                title={prod.name}
                key={prod.id}
                rating={prod.rating}
                showAddToCart={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto relative rounded-[2.5rem] bg-foreground overflow-hidden py-24 px-12 text-center">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full" />
          </div>
          <motion.div {...fadeIn} className="relative z-10">
            <SectionTag>Limited Time</SectionTag>
            <h2 className="text-4xl md:text-5xl font-bold text-background mb-6">
              Big Sale — Up to{" "}
              <span className="text-purple-600">50% OFF</span>
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
              Use code{" "}
              <span className="font-mono text-background px-3 py-1 bg-card/10 rounded-md">
                SALE50
              </span>{" "}
              at checkout. Limited time offer on selected items.
            </p>
            <Button variant="promo" size="lg" asChild>
              <Link to="/products" className="h-14 px-10">
                Shop the Sale
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 border-t border-border">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <Mail className="w-6 h-6 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Subscribe for exclusive deals, new arrivals, and insider-only discounts.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full min-w-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full min-w-0 h-14 px-5 py-3 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="hero" className="w-full sm:w-auto h-14 px-8 rounded-full">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Modern<span className="text-primary">Store</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your one-stop destination for premium products at unbeatable prices.
              </p>
              <div className="flex gap-3 mt-6">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">Shop</h4>
              <ul className="space-y-3">
                {["Electronics", "Fashion", "Accessories", "Home & Living"].map((item) => (
                  <li key={item}>
                    <Link to="/products" className="text-sm text-muted-foreground hover:text-background transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Careers", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <Link to="/" className="text-sm text-muted-foreground hover:text-background transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} /> Pune, Maharshtra
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} /> +91 01223456789
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} /> hello@modernstore.in
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-card/10 text-center">
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              © 2024 ModernStore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
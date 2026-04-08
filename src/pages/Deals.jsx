import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../redux/productSlice";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist } from "../redux/wishlistSlice";
import { Button } from "@/components/ui/button";
import Card from "../components/Card";
import { Heart, ShoppingCart, Sparkles, Tag, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

function getTimeLeft(target) {
    const now = new Date();
    const diff = Math.max(0, target.getTime() - now.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { hours, minutes, seconds, isExpired: diff === 0 };
}

function Deals() {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const [targetTime] = useState(() => {
        const nextHour = new Date();
        nextHour.setMinutes(0, 0, 0);
        nextHour.setHours(nextHour.getHours() + 2);
        return nextHour;
    });
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetTime));

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(targetTime));
        }, 1000);
        return () => clearInterval(timer);
    }, [targetTime]);

    const dealProducts = useMemo(() => {
        return [...products] // ✅ clone array
            .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
            .slice(0, 12);
    }, [products]);

    const featuredDeal = dealProducts.slice(0, 4);
    const categories = useMemo(() => {
        return [...new Set(dealProducts.map((product) => product.category))].slice(0, 5);
    }, [dealProducts]);

    const handleAddToCart = (product) => {
        if (!product) return;
        dispatch(addToCart(product));
        toast.success(`${product.title} added to cart`);
    };

    const handleAddToWishlist = (product) => {
        if (!product) return;
        dispatch(addToWishlist(product));
        toast.success(`${product.title} added to wishlist`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-24">
            <section className="max-w-7xl mx-auto px-6 py-14">
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
                    <motion.div {...fadeIn}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-600/10 text-purple-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
                            <Sparkles className="w-4 h-4" /> Hot Deals
                        </span>
                        <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
                            Limited-time deals, curated for your next purchase.
                        </h1>
                        <p className="mt-6 max-w-2xl text-base text-muted-foreground leading-7">
                            Find the best discounts on top-rated products, enjoy fast shipping, and shop with confidence. These deals are updated frequently so you always get the freshest offers.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Button variant="hero" size="lg" asChild>
                                <Link to="/products" className="inline-flex items-center gap-2">
                                    Browse all deals
                                    <ArrowRight size={18} />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link to="/categories" className="inline-flex items-center gap-2">
                                    Shop by category
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        {...fadeIn}
                        className="rounded-[2rem] bg-card border border-border p-8 shadow-xl"
                    >
                        <div className="flex items-center justify-between gap-4 mb-8">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                                    Flash Sale
                                </p>
                                <h2 className="text-2xl font-semibold mt-2">Extra savings for a limited time</h2>
                            </div>
                            <Tag className="w-10 h-10 rounded-full bg-purple-600 text-white p-2" />
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center mb-8">
                            {[
                                { label: "Hrs", value: String(timeLeft.hours).padStart(2, "0") },
                                { label: "Min", value: String(timeLeft.minutes).padStart(2, "0") },
                                { label: "Sec", value: String(timeLeft.seconds).padStart(2, "0") },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl bg-secondary p-4">
                                    <p className="text-2xl font-bold">{item.value}</p>
                                    <p className="text-xs uppercase text-muted-foreground mt-1">{item.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-3xl bg-linear-to-r from-purple-600 to-violet-500 p-6 text-white">
                            <p className="text-sm uppercase tracking-[0.24em] font-semibold mb-3">Save up to 50% off</p>
                            <h3 className="text-3xl font-bold leading-snug">Shop the freshest offers before time runs out.</h3>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="bg-card border-y border-border py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                        <div>
                            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Top deals</p>
                            <h2 className="text-3xl font-bold mt-3">Trending discounts</h2>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/products">View all products</Link>
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <div className="text-lg font-semibold">Loading hot deals...</div>
                        </div>
                    ) : dealProducts.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">No deals available right now.</div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {featuredDeal.map((product) => {
                                const image = product.thumbnail || product.images?.[0] || "https://via.placeholder.com/300";
                                const oldPrice = Math.round(product.price / (1 - product.discountPercentage / 100));
                                return (
                                    <motion.div
                                        key={product.id}
                                        {...fadeIn}
                                        className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <Card
                                            img={image}
                                            productId={product.id}
                                            title={product.title}
                                            price={product.price}
                                            rating={product.rating}
                                            discountPercentage={product.discountPercentage} // ✅ ONLY THIS NEEDED
                                            showAddToCart={true}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
                    <motion.div {...fadeIn}>
                        <span className="section-tag">Deal categories</span>
                        <h2 className="mt-4 text-3xl font-bold">Shop by discount category</h2>
                        <p className="mt-4 text-base text-muted-foreground leading-7">
                            Explore curated deal collections by category. Each group is selected for high discounts and strong customer ratings.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 mt-8">
                            {categories.map((category) => (
                                <Link
                                    key={category}
                                    to={`/category/${category}`}
                                    className="group rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Category</p>
                                            <h3 className="mt-2 text-xl font-semibold text-foreground capitalize">{category}</h3>
                                        </div>
                                        <div className="rounded-full bg-purple-600/10 p-3 text-purple-600">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Browse the best discounted {category} products and grab them before they sell out.
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div {...fadeIn} className="rounded-[2rem] border border-border bg-card p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Clock className="w-6 h-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Best value</p>
                                <p className="text-xl font-semibold">Fresh deals updated hourly</p>
                            </div>
                        </div>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="rounded-3xl border border-border bg-background p-4">
                                <p className="font-semibold text-foreground">Exclusive savings</p>
                                <p className="mt-1">Discounts on best sellers and trending collections.</p>
                            </li>
                            <li className="rounded-3xl border border-border bg-background p-4">
                                <p className="font-semibold text-foreground">Fast checkout</p>
                                <p className="mt-1">Quick add-to-cart action and easy checkout flow.</p>
                            </li>
                            <li className="rounded-3xl border border-border bg-background p-4">
                                <p className="font-semibold text-foreground">Trusted brands</p>
                                <p className="mt-1">Curated offers from top-rated items and categories.</p>
                            </li>
                        </ul>
                        <Button variant="hero" size="lg" asChild className="mt-8 w-full">
                            <Link to="/products">Start saving now</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default Deals;

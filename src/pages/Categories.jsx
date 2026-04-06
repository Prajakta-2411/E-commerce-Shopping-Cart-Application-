import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Card from "../components/Card";
import {
    ArrowRight,
    Smartphone,
    Shirt,
    Watch,
    Home,
    Heart,
    Laptop,
    Bike,
    ShoppingBasket,
    Sparkles,
    Sofa,
    Utensils,
    Dumbbell,
    Glasses,
    Tablet,
    Car
} from "lucide-react";
import { FaShoePrints } from "react-icons/fa";

// Shared animation
const fadeIn = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
};

const SectionTag = ({ children }) => (
    <span className="section-tag">{children}</span>
);

function Categories() {
    const [products, setProducts] = useState([]);
    // const [selectedCategory, setSelectedCategory] = useState("smartphones");
    const [selectedCategory, setSelectedCategory] = useState("smartphones");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    // Category mapping from dummyjson API
    // const categoryList = [
    //     { name: "Smartphones", value: "smartphones", icon: Smartphone },
    //     { name: "Womens Jewellery", value: "womens-jewellery", icon: Watch },
    //     { name: "Mens Shirts", value: "mens-shirts", icon: Shirt },
    //     { name: "Womens Dresses", value: "womens-dresses", icon: HomeIcon },
    // ];
    const iconMap = {
        beauty: Sparkles,
        fragrances: Heart,
        furniture: Sofa,
        groceries: ShoppingBasket,
        "home-decoration": Home,
        "kitchen-accessories": Utensils,
        laptops: Laptop,
        "mens-shirts": Shirt,
        "mens-shoes": FaShoePrints, // (import Shoe if needed)
        "mens-watches": Watch,
        "mobile-accessories": Smartphone,
        motorcycle: Bike,
        "skin-care": Sparkles,
        smartphones: Smartphone,
        "sports-accessories": Dumbbell,
        sunglasses: Glasses,
        tablets: Tablet,
        tops: Shirt,
        vehicle: Car,
        "womens-bags": ShoppingBasket,
        "womens-dresses": Shirt,
        "womens-jewellery": Watch,
        "womens-shoes": FaShoePrints,
        "womens-watches": Watch,
    };
    const DefaultIcon = Home;
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("https://dummyjson.com/products/categories");
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);
    useEffect(() => {
        if (categories.length > 0) {
            setSelectedCategory(categories[0].slug);
        }
    }, [categories]);
    useEffect(() => {
        const fetchProductsByCategory = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `https://dummyjson.com/products/category/${selectedCategory}`
                );
                setProducts(res.data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            setLoading(false);
        };

        fetchProductsByCategory();
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* HEADER */}
            <div className="w-full bg-card border-b border-border mt-16 sm:mt-20 py-8 sm:py-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div {...fadeIn}>
                        <SectionTag>Shop By Category</SectionTag>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-foreground">
                            Explore <span className="text-purple-700">All Categories</span>
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
                            Browse through our extensive collection of products across different categories.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* CATEGORY TABS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12 justify-center">
                    {/* {categoryList.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => setSelectedCategory(category.value)}
                            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 ${selectedCategory === category.value
                                ? "bg-purple-700 text-white shadow-lg hover:bg-purple-800"
                                : "bg-card border border-border text-foreground hover:bg-muted"
                                }`}
                        >
                            <category.icon size={16} className="sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">{category.name}</span>
                            <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                        </button>
                    ))} */}
                    {categories.map((category) => {
                        const Icon = iconMap[category.slug] || DefaultIcon;

                        return (
                            <button
                                key={category.slug}
                                onClick={() => setSelectedCategory(category.slug)}
                                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 ${selectedCategory === category.slug
                                    ? "bg-purple-700 text-white shadow-lg hover:bg-purple-800"
                                    : "bg-card border border-border text-foreground hover:bg-muted"
                                    }`}
                            >
                                <Icon size={16} className="sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">{category.name}</span>
                                <span className="sm:hidden">{category.name.split(" ")[0]}</span>
                            </button>
                        );
                    })}
                </div>

                {/* PRODUCTS GRID */}
                <motion.div {...fadeIn}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                        {loading ? (
                            <div className="col-span-full text-center py-12">
                                <div className="text-gray-500 text-base sm:text-lg">Loading products...</div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <div className="text-gray-500 text-base sm:text-lg">No products found in this category.</div>
                            </div>
                        ) : (
                            products.map((product) => (
                                <Card
                                    key={product.id}
                                    img={product.thumbnail || product.image || product.images?.[0]}
                                    productId={product.id}
                                    title={product.title}
                                    price={product.price}
                                />
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* FOOTER CTA */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 mt-8 sm:mt-12 border-t border-border">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div {...fadeIn}>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                            Can't find what you're looking for?
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                            Visit our products page to search through our entire collection.
                        </p>
                        <a
                            href="/products"
                            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-purple-700 text-white rounded-full font-semibold hover:bg-purple-800 transition-all duration-300"
                        >
                            View All Products
                            <ArrowRight size={18} />
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default Categories;

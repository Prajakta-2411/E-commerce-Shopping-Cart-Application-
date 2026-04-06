import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Star, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist } from "../redux/wishlistSlice";
import { formatPrice } from "@/lib/utils";

function Category() {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Map display names to dummyjson categories
    const categoryMap = {
        "electronics": ["smartphones", "laptops", "lighting"],
        "fashion": ["mens-shirts", "mens-shoes", "womens-dresses", "womens-shoes", "tops"],
        "accessories": ["sunglasses", "womens-jewellery", "mens-watches", "womens-watches", "womens-bags"],
        "home & living": ["home-decoration", "furniture", "groceries"],
        "home-&-living": ["home-decoration", "furniture", "groceries"],
    };

    useEffect(() => {
        const normalizedCategory = categoryName.toLowerCase();
        const apiCategories = categoryMap[normalizedCategory] || [];

        if (apiCategories.length === 0) {
            setLoading(false);
            setProducts([]);
            return;
        }

        const fetchProducts = async () => {
            try {
                setLoading(true);
                let allProducts = [];

                for (const category of apiCategories) {
                    const response = await axios.get(
                        `https://dummyjson.com/products/category/${category}`
                    );
                    allProducts = [...allProducts, ...(response.data.products || [])];
                }

                setProducts(allProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success("Added to cart!");
    };

    const handleAddToWishlist = (product) => {
        dispatch(addToWishlist(product));
        toast.success("Added to wishlist!");
    };

    const getCategoryDisplayName = () => {
        const name = categoryName.replace(/-/g, " ");
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                    <div className="text-center py-20">
                        <div className="text-lg font-semibold mb-2">Loading {categoryName.toLowerCase()} products...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                    <Card className="text-center py-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardContent>
                            <div className="text-6xl mb-6">📦</div>
                            <h1 className="text-3xl font-bold mb-4 bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                No Products in {getCategoryDisplayName()}
                            </h1>
                            <p className="text-gray-600 mb-8 text-lg">
                                Sorry, this category doesn't have any products available right now.
                                Check back soon or explore other categories!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="hero" size="lg" onClick={() => navigate("/")} className="bg-purple-600 hover:bg-purple-700">
                                    Back to Home
                                </Button>
                                <Button variant="outline" size="lg" onClick={() => navigate("/products")}>
                                    Browse All Products
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="mb-4"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            {getCategoryDisplayName()}
                        </h1>
                        <p className="text-gray-600">{products.length} products available</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="group shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
                                    <img
                                        src={product.thumbnail || product.image || product.images?.[0]}
                                        alt={product.title}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        onClick={() => handleAddToWishlist(product)}
                                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-600 hover:text-white shadow-md"
                                    >
                                        <Heart size={18} />
                                    </button>
                                </div>
                                <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex items-center gap-1 mb-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={i < Math.floor(product.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                    <span className="text-xs text-gray-500 ml-1">({product.stock ?? 0} in stock)</span>
                                </div>
                                <p className="text-2xl font-bold text-purple-600 mb-4">
                                    {formatPrice(product.price * 100)}
                                </p>
                                <Button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                    size="sm"
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Category;

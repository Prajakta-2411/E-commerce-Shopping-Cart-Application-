import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/Card";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

function Wishlist() {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.wishlist);
    const validItems = Array.isArray(items)
        ? items.filter(
            (item) =>
                item &&
                item.id != null &&
                (item.title || item.image || typeof item.price === "number")
        )
        : [];

    if (validItems.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => window.history.back()}
                            className="mb-6"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shopping
                        </Button>
                        <Card className="py-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                            <CardContent>
                                <div className="text-6xl mb-6">💖</div>
                                <h1 className="text-3xl font-bold mb-4 bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Your Wishlist is Empty
                                </h1>
                                <p className="text-gray-600 mb-8 text-lg">Save items you love for later and they'll appear here</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button variant="hero" size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
                                        <Link to="/products">Browse Products</Link>
                                    </Button>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link to="/categories">Explore Categories</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    const handleRemoveFromWishlist = (id, title) => {
        dispatch(removeFromWishlist(id));
        toast.success(`${title.substring(0, 20)}... removed from wishlist`);
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success("Added to cart!");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            My Wishlist
                        </h1>
                        <p className="text-gray-600">{validItems.length} item{validItems.length > 1 ? 's' : ''} saved</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </Button>
                </div>

                {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {items.map((item) => (
                        <Card key={item.id} className="group shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-4">
                                <Link to={`/details/${item.id}`} className="block">
                                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-50">
                                        <img
                                            src={item.image}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            alt={item.title}
                                        />
                                    </div>
                                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                                        {item.description}
                                    </p>
                                    <p className="text-lg font-bold text-purple-600 mb-3">
                                        {formatPrice(item.price * 100)}
                                    </p>
                                </Link>

                                <div className="space-y-1">
                                    <Button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs py-1 h-7"
                                        size="sm"
                                    >
                                        <ShoppingCart className="mr-1 h-3 w-3" />
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleRemoveFromWishlist(item.id, item.title)}
                                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs py-1 h-7"
                                        size="sm"
                                    >
                                        <Trash2 className="mr-1 h-3 w-3" />
                                        Remove
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div> */}

                {validItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 mt-24">
                        {validItems.map((item) => (
                            <ProductCard
                                key={item.id}
                                img={item.image}
                                productId={item.id}
                                title={item.title}
                                price={item.price}
                                rating={item.rating}
                                showAddToCart={true}
                            />
                        ))}
                    </div>
                ) : null}

            </div>
        </div>
    );
}

export default Wishlist;
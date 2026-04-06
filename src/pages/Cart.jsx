import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ShoppingCart, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="text-center py-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="text-6xl mb-6">🛒</div>
              <h1 className="text-3xl font-bold mb-4 bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your cart is empty
              </h1>
              <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added anything to your cart yet</p>
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
    );
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.success('Cart cleared successfully');
    }
  };

  const handleRemoveItem = (id, title) => {
    dispatch(removeFromCart(id));
    toast.success(`${title.substring(0, 20)}... removed from cart`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>
          </div>
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <AlertTriangle className="h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex gap-4 sm:gap-6">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg bg-gray-50"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                              disabled={(item.quantity || 1) <= 1}
                              className="h-8 w-8 p-0"
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity || 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.title)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} className="sm:mr-2" />
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-purple-600">{formatPrice(item.price * (item.quantity || 1) * 100)}</p>
                          <p className="text-sm text-gray-500">{formatPrice(item.price * 100)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-medium">{formatPrice(totalPrice * 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (12%)</span>
                    <span className="font-medium">{formatPrice(totalPrice * 100 * 0.12)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">{formatPrice(totalPrice * 100 * 1.12)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="hero" size="lg" className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" asChild>
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-purple-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Free shipping on orders over ₹ 5000</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-700 mt-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>10 days return policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

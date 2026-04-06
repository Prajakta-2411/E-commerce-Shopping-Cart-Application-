import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../redux/cartSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Minus, CreditCard, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";


function Checkout() {
    const { items } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        phone: ''
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
    });
    const { user } = useUser();
    useEffect(() => {
        if (user) {
            setShippingInfo((prev) => ({
                ...prev,
                name: user.fullName || "",
                email: user.primaryEmailAddress?.emailAddress || "",
            }));
        }
    }, [user]);

    const total = items.reduce(
        (acc, item) => acc + item.price * (item.quantity || 1),
        0
    );
    const convertToINR = (price) => Math.floor(price * 83);

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
        toast.success("Item removed from cart");
    };

    const handleFillFakeData = () => {
        setShippingInfo({
            name: 'John Doe',
            email: 'john.doe@example.com',
            address: '123 Main Street, Apartment 4B',
            city: 'New York',
            zipCode: '10001',
            phone: '+1 (555) 123-4567'
        });

        setPaymentInfo({
            cardNumber: '4111111111111111',
            expiryDate: '12/28',
            cvv: '123',
            cardHolder: 'John Doe'
        });

        toast.success("Form filled with demo data!");
    };

    const handlePlaceOrder = () => {
        if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address) {
            toast.error("Please fill in all required shipping information");
            return;
        }

        if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
            toast.error("Please fill in all payment information");
            return;
        }

        // Create order object
        const order = {
            id: Date.now().toString(),
            items: items,
            total: total,
            shippingInfo: shippingInfo,
            paymentInfo: { ...paymentInfo, cardNumber: paymentInfo.cardNumber.slice(-4) }, // Only store last 4 digits
            status: 'confirmed',
            orderDate: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };

        // Save order to localStorage (in a real app, this would be an API call)
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(existingOrders));

        // Clear cart
        dispatch(clearCart());

        toast.success("Order placed successfully!", {
            description: `Order #${order.id} has been confirmed.`
        });

        // Navigate to orders page
        navigate('/orders');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <Card className="text-center py-16">
                        <CardContent>
                            <div className="text-6xl mb-4">🛒</div>
                            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-6">Add some items to your cart before checking out</p>
                            <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700">
                                Continue Shopping
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        Secure Checkout
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">Complete your purchase with confidence</p>
                    <Button
                        onClick={handleFillFakeData}
                        variant="outline"
                        className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    >
                        🚀 Fill Demo Data
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-purple-600" />
                                    Shipping Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={shippingInfo.name}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                            placeholder="Enter your full name"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={shippingInfo.email}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                            placeholder="Enter your email"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="address">Address *</Label>
                                    <Textarea
                                        id="address"
                                        value={shippingInfo.address}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                        placeholder="Enter your full address"
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={shippingInfo.city}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                            placeholder="City"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="zipCode">ZIP Code</Label>
                                        <Input
                                            id="zipCode"
                                            value={shippingInfo.zipCode}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                                            placeholder="ZIP Code"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={shippingInfo.phone}
                                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                            placeholder="Phone number"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-purple-600" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="cardHolder">Card Holder Name</Label>
                                    <Input
                                        id="cardHolder"
                                        value={paymentInfo.cardHolder}
                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })}
                                        placeholder="Name on card"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                        id="cardNumber"
                                        value={paymentInfo.cardNumber}
                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                                        placeholder="1234 5678 9012 3456"
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="expiryDate">Expiry Date</Label>
                                        <Input
                                            id="expiryDate"
                                            value={paymentInfo.expiryDate}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                                            placeholder="MM/YY"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            value={paymentInfo.cvv}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                                            placeholder="123"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="space-y-6">
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-purple-600" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-12 h-12 object-contain rounded"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.title}</p>
                                                <p className="text-sm text-gray-600">Rs.{convertToINR(item.price)}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>Rs.{convertToINR(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>Rs.{convertToINR(total * 0.08)}</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-purple-600">Rs.{convertToINR(total + total * 0.08)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePlaceOrder}
                                    className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-lg font-semibold shadow-lg"
                                    size="lg"
                                >
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Place Order - Rs.{convertToINR(total + total * 0.08)}
                                </Button>

                                <p className="text-xs text-gray-500 text-center">
                                    Your payment information is secure and encrypted
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
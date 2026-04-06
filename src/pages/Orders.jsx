import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, ArrowLeft, Eye } from "lucide-react";

function Orders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const convertToINR = (price) => Math.floor(price * 83);
    useEffect(() => {
        // Load orders from localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'shipped':
                return <Truck className="h-4 w-4 text-blue-500" />;
            case 'delivered':
                return <Package className="h-4 w-4 text-purple-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="mb-6"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shopping
                        </Button>
                        <Card className="py-16">
                            <CardContent>
                                <div className="text-6xl mb-4">📦</div>
                                <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
                                <p className="text-gray-600 mb-6">Your order history will appear here once you place your first order</p>
                                <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700">
                                    Start Shopping
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                            My Orders
                        </h1>
                        <p className="text-gray-600">Track and manage your orders</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </Button>
                </div>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                        <Badge className={getStatusColor(order.status)}>
                                            <div className="flex items-center gap-1">
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </div>
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Ordered on</p>
                                        <p className="font-medium">{formatDate(order.orderDate)}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Order Items */}
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold mb-3">Items Ordered</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-12 h-12 object-contain rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{item.title}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Quantity: {item.quantity || 1} × Rs.{convertToINR(item.price)}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold">Rs.{convertToINR((item.quantity || 1) * item.price)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">Order Total</h4>
                                            <p className="text-2xl font-bold text-purple-600">Rs.{convertToINR(order.total)}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Shipping Address</h4>
                                            <div className="text-sm text-gray-600">
                                                <p>{order.shippingInfo.name}</p>
                                                <p>{order.shippingInfo.address}</p>
                                                <p>{order.shippingInfo.city}, {order.shippingInfo.zipCode}</p>
                                            </div>
                                        </div>

                                        {order.estimatedDelivery && (
                                            <div>
                                                <h4 className="font-semibold mb-2">Estimated Delivery</h4>
                                                <p className="text-sm text-gray-600">{formatDate(order.estimatedDelivery)}</p>
                                            </div>
                                        )}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full flex items-center gap-2"
                                            onClick={() => {
                                                // In a real app, this would navigate to order details
                                                alert(`Order details for #${order.id}`);
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Orders;
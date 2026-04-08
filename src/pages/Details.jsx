import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { fetchProductById } from "../redux/productSlice";
import { ArrowLeft, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { formatPrice } from "@/lib/utils";

function Details() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();

  const { products, singleProduct, loading } = useSelector(
    (state) => state.products
  );

  const product =
    products.find((p) => p.id === Number(productId)) || singleProduct;

  useEffect(() => {
    const existingProduct = products.find(
      (p) => p.id === Number(productId)
    );

    if (!existingProduct) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId, products]);

  function handleAddToCart() {
    if (!product) return;
    dispatch(addToCart(product));
    toast.success("Added to cart!");
  }

  function handlePurchaseNow() {
    if (!product) return;
    dispatch(addToCart(product));
    navigate("/checkout");
  }

  if (loading || !product) {
    return (
      <div className="mt-24 w-full">

        <div className="max-w-7xl mx-auto px-6 mb-6">
          <Button variant="outline" size="lg" onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-center text-gray-500">
            <div className="text-lg font-semibold mb-2">
              Loading product details...
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-24">
      <div className="max-w-7xl mx-auto px-6">

        <Button
          variant="outline"
          size="lg"
          className="mb-6 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back
        </Button>

        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">

            <img
              src={product.thumbnail || product.image || product.images?.[0]}
              className="mx-auto h-56 w-64 object-contain"
              alt={product.title}
            />

            <div className="flex-1">
              <p className="text-2xl lg:text-[25px] font-bold">
                {product.title}
              </p>

              <p className="text-base lg:text-[16px] text-neutral-800 mt-2">
                {product.description}
              </p>

              {product.discountPercentage && Number(product.discountPercentage) > 0 && (
                <div className="mt-3 inline-block">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <p className="text-sm font-semibold">
                  {formatPrice(product.price * 83)}
                </p>
                {product.discountPercentage && Number(product.discountPercentage) > 0 && (
                  <p className="text-sm text-gray-400 line-through">
                    {formatPrice((product.price / (1 - product.discountPercentage / 100)) * 83)}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">

                <Button variant="hero-outline" size="lg" onClick={handleAddToCart} className="cursor-pointer">
                  <ShoppingCart className="mr-2" size={18} />
                  Add to cart
                </Button>

                {/* <Button
                  variant="hero"
                  size="lg"
                  className="hover:bg-purple-700"
                  onClick={handlePurchaseNow}
                >
                  <CreditCard className="mr-2" size={18} />
                  Purchase Now
                </Button> */}

                {isSignedIn ? (
                  <button
                    className="px-5 py-2 text-white bg-black text-sm font-medium rounded-lg cursor-pointer hover:bg-purple-700"
                    onClick={handlePurchaseNow}
                  >
                    Purchase Now
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button className="px-5 py-2 text-white bg-black text-sm font-medium rounded-lg cursor-pointer hover:bg-purple-700">
                      Buy at {formatPrice(product.price * 83)}
                    </button>
                  </SignInButton>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
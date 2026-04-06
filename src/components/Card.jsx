import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

function Card({ img, title, price, productId, rating = 4, showAddToCart = true, badgeText, oldPrice }) {
  if (productId == null) {
    return null;
  }

  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  const isWishlisted = items.some((item) => item.id === productId);
  const imageSrc = img || "https://via.placeholder.com/300?text=No+Image";
  const displayPrice = Number(price) || 0;
  const displayRating = Number.isFinite(Number(rating)) ? rating : 0;
  const displayOldPrice = Number(oldPrice) > displayPrice ? Number(oldPrice) : null;
  const computedBadgeText = badgeText || null;

  const handleWishlist = (e) => {
    e.preventDefault();

    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
      toast.success("Removed from wishlist!");
    } else {
      dispatch(
        addToWishlist({
          id: productId,
          image: img,
          title,
          price,
          rating,
          oldPrice,
        })
      );
      toast.success("Added to wishlist!");
    }
  };

  return (
    <Link to={`/Details/${productId}`}>
      <div className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg">

        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {computedBadgeText ? (
            <div className="absolute left-3 top-3 rounded-full bg-purple-600 px-3 py-1 text-[11px] font-semibold uppercase text-white shadow-sm">
              {computedBadgeText}
            </div>
          ) : null}
          <img
            src={imageSrc}
            alt={title || "Product image"}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
          >
            <Heart
              size={16}
              className={
                isWishlisted
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400"
              }
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col h-full">

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < displayRating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({displayRating}.0)
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium line-clamp-2 min-h-6">
            {title}
          </h3>

          <div className="grow" />

          {/* Price */}
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-black">
              {formatPrice(displayPrice * 83)}
            </p>
            {displayOldPrice ? (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(displayOldPrice * 83)}
              </p>
            ) : null}
          </div>

          {/* Add to Cart */}
          {showAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  addToCart({
                    id: productId,
                    image: img,
                    title,
                    price,
                  })
                );
                toast.success("Added to cart 🛒");
              }}
              className="mt-3 w-full bg-neutral-50 text-black text-sm py-2 rounded-full flex items-center justify-center gap-2 hover:bg-neutral-100 cursor-pointer"
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Card;
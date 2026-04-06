function Footer() {
    return (
        <div className="bg-black text-white mt-20">
            <div className="w-[90vw] mx-auto py-10 grid grid-cols-3 gap-6">

                <div>
                    <h2 className="font-bold text-lg mb-3">ReactShop</h2>
                    <p className="text-sm">
                        A modern e-commerce application built using React and Redux.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Quick Links</h3>
                    <ul className="text-sm space-y-1">
                        <li>Products</li>
                        <li>Cart</li>
                        <li>Wishlist</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <p className="text-sm">support@reactshop.com</p>
                </div>

            </div>
        </div>
    );
}

export default Footer;
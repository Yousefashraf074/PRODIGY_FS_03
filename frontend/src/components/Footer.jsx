export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">LocalStore</h3>
            <p className="text-sm">
              Your one-stop local shop for quality products at great prices.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/cart" className="hover:text-white transition">Cart</a></li>
              <li><a href="/orders" className="hover:text-white transition">Orders</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">Contact</h3>
            <p className="text-sm">support@localstore.com</p>
            <p className="text-sm">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          &copy; {new Date().getFullYear()} LocalStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

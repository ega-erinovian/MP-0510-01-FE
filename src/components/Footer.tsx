import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white">
      <div className="container mx-auto px-6 py-12 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-white">About Us</h3>
            <p className="text-purple-300">
              We are a company dedicated to providing excellent services and
              products to our customers. We strive for innovation and customer
              satisfaction.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3 text-purple-300">
              <li>
                <Link href="/" className="hover:text-white transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-all">
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-white transition-all">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <p className="text-purple-300">123 In The Street, In City, 12345</p>
            <p className="text-purple-300">Phone: (123) 456-7890</p>
            <p className="text-purple-300">Email: moreinfo@eventin.com</p>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 pt-8 border-t border-purple-600">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-purple-300 text-sm md:text-base">
              &copy; 2024 EventIn. All rights reserved.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-6 mt-6 md:mt-0">
              <Link
                href="#"
                className="text-purple-300 hover:text-white transition-all">
                <Facebook size={24} />
              </Link>
              <Link
                href="#"
                className="text-purple-300 hover:text-white transition-all">
                <Twitter size={24} />
              </Link>
              <Link
                href="#"
                className="text-purple-300 hover:text-white transition-all">
                <Instagram size={24} />
              </Link>
              <Link
                href="#"
                className="text-purple-300 hover:text-white transition-all">
                <Linkedin size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

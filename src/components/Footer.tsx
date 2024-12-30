import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-purple-700 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-purple-200">
              We are a company dedicated to providing excellent services and
              products to our customers.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-purple-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-purple-300">
                  Browse
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-purple-300">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-purple-200">123 In The Street, In City, 12345</p>
            <p className="text-purple-200">Phone: (123) 456-7890</p>
            <p className="text-purple-200">Email: moreinfo@eventin.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-purple-600">
          <div className="flex justify-between items-center">
            <p className="text-purple-200">
              &copy; 2024 EventIn. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-purple-200 hover:text-white">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-purple-200 hover:text-white">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-purple-200 hover:text-white">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-purple-200 hover:text-white">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


import React from "react";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            <div>
              <h2 className="text-2xl font-bold text-white">
                Stay Updated
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Get the latest deals and offers directly in your inbox.
              </p>
            </div>

            <div className="flex w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-l-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />

              <button className="flex items-center gap-2 rounded-r-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Manoj<span className="text-blue-500">Mart</span>
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
              Your trusted destination for smartphones, laptops,
              electronics and everyday technology.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">

              <a
                href="https://www.facebook.com/manoj.nahak.1426/"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>

              <a
                href="https://www.instagram.com/manojnahak03/"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-pink-600 hover:text-white"
              >
                <FaInstagram className="h-5 w-5" />
              </a>

              <a
                href="https://www.linkedin.com/in/manoj-nahak-50369538b"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-500 hover:text-white"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>

              <a
                href="https://github.com/manojnahak03"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-700 hover:text-white"
              >
                <FaGithub className="h-5 w-5" />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Home
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Shop
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Categories
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Deals
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-blue-400">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-5 font-bold text-white">
              Customer Service
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Contact Us
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Shipping & Delivery
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Returns & Refunds
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-blue-400">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 font-bold text-white">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm">

              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />

                <span>
                  Mumbai, Maharashtra
                  <br />
                  India
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <span>+91 85917 29107</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>support@manojmart.com</span>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-center text-sm text-gray-500 sm:flex-row lg:px-8">

          <p>
            © {new Date().getFullYear()} ManojMart. All rights reserved.
          </p>

          <p>
            Made with ❤️ by{" "}
            <span className="font-semibold text-white">
              Manoj
            </span>
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;


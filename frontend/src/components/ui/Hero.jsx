
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white">
      {/* Background Effects */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>Smart Shopping Starts Here</span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-200 bg-clip-text text-transparent">
                ManojMart
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-blue-100 sm:text-xl lg:mx-0">
              Discover the latest smartphones, laptops, gadgets and more —
              all at unbeatable prices.
            </p>

            {/* Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="group h-12 rounded-full bg-white px-7 text-base font-bold text-blue-700 shadow-xl shadow-blue-950/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-2xl"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/50 bg-white/10 px-7 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-blue-700"
              >
                View Deals
              </Button>
            </div>

            {/* Trust Info */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-blue-100 lg:justify-start">
              <div>
                <span className="font-bold text-white">10K+</span> Products
              </div>
              <div>
                <span className="font-bold text-white">5K+</span> Happy Customers
              </div>
              <div>
                <span className="font-bold text-white">24/7</span> Support
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl" />

              {/* Product Card */}
              <div className="relative flex h-72 w-72 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl sm:h-96 sm:w-96">
                <div className="text-center">
                  <div className="mb-4 text-7xl drop-shadow-2xl sm:text-8xl">
                    🛍️
                  </div>

                  <h2 className="text-2xl font-extrabold sm:text-3xl">
                    ManojMart
                  </h2>

                  <p className="mt-2 text-sm text-blue-100 sm:text-base">
                    Everything you need. One place.
                  </p>
                </div>

                {/* Floating Badge */}
                <div className="absolute -right-4 top-8 rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-xl">
                  🔥 Hot Deals
                </div>

                <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm font-bold text-purple-700 shadow-xl">
                  ⚡ Best Prices
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;


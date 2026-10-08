
import React from "react";
import {
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your orders delivered quickly and safely to your doorstep.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "Your payments and personal information are protected with us.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our support team is always ready to help you whenever you need.",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Simple and hassle-free returns for a smooth shopping experience.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
            Why ManojMart?
          </p>

          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Shopping Made{" "}
            <span className="text-blue-600">Simple & Better</span>
          </h2>

          <p className="mt-4 text-gray-500">
            Everything you need for a safe, easy and enjoyable shopping
            experience.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group rounded-2xl border border-gray-100 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200">
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;


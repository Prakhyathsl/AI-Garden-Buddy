import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Garden Buddy | Intelligent Garden Planner & Plant Health Assistant",
  description: "Grow smarter. Waste less. Get outside. Practical, personalized garden planning and plant health diagnostics designed for everyday gardeners.",
  keywords: ["gardening", "garden planner", "plant care", "balcony gardening", "urban gardening", "outdoor habits", "organic plant care"],
  authors: [{ name: "AI Garden Buddy Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#fbfbf7] text-[#1f2937]">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Garden Buddy | Open-Weight Gemma Garden Planner",
  description: "Grow smarter. Waste less. Get outside. Personalized, practical garden planning and plant health diagnostics powered by Google's open-weight Gemma model.",
  keywords: ["gardening", "AI garden planner", "Gemma", "open-weight AI", "balcony gardening", "plant care", "Hacktoberfest 2026"],
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

// src/app/page.tsx
// import { redirect } from "next/navigation";

// 'use client'

import Footer from "@/components/LandingPage/Footer";
import HeroSection from "@/components/LandingPage/HeroSection";
import Reviews from "@/components/LandingPage/Reviews";
import Navbar from "@/components/Navbar";
// import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <Reviews/>
      <Footer />
    </div>
  )
}

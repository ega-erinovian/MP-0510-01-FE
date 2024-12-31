"use client";

import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import { Footer } from "./Footer";

interface LandingPageLayoutProps {
  children: ReactNode;
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="mt-16">{children}</main>
      <Footer />
    </>
  );
};

export default LandingPageLayout;

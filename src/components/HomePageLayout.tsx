import React, { ReactNode } from "react";

interface LandingPageLayoutProps {
  children: ReactNode;
}

const HomePageLayout: React.FC<LandingPageLayoutProps> = ({ children }) => {
  return (
    <>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10 grid gap-4 sm:gap-6 md:gap-8">
        {children}
      </section>
    </>
  );
};

export default HomePageLayout;

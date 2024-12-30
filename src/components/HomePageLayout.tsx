import React, { ReactNode } from "react";

interface LandingPageLayoutProps {
  children: ReactNode;
}

const HomePageLayout: React.FC<LandingPageLayoutProps> = ({ children }) => {
  return (
    <>
      <section className="container mx-auto py-8 grid">{children}</section>
    </>
  );
};

export default HomePageLayout;

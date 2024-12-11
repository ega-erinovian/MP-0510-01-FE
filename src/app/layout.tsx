import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/utils/font";
import ReactQueryProvider from "@/providers/ReactQueryProviders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "EventZen",
  description:
    "EventZen - Simplify event ticketing and management with our user-friendly platform. Buy, sell, and manage tickets effortlessly for any event, big or small. Experience seamless event organization today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <ToastContainer />
      </body>
    </html>
  );
}

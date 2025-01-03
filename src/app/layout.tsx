import NextAuthProvider from "@/providers/NextAuthProvider";
import NuqsProvider from "@/providers/NuqsProvider";
import ReactQueryProvider from "@/providers/ReactQueryProviders";
import { poppins } from "@/utils/font";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventIn",
  description:
    "EventIn - Simplify event ticketing and management with our user-friendly platform. Buy, sell, and manage tickets effortlessly for any event, big or small. Experience seamless event organization today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <NextAuthProvider>
          <NuqsProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </NuqsProvider>
        </NextAuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}

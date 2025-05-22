import React from "react";
import { Roboto } from "next/font/google";
import "./globals.css"

const font = Roboto ({
  variable: "--font",
  subsets: ["latin"],
});

export const metadata = {
    title: "Petshop Avaliação",
    icons: {
    icon: "/icons/pet-shop.ico",
  },
    description: "Avaliação de Front-end",

};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body className={font.variable}>{children}</body>
        </html>
    );
}
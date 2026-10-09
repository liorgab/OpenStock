import type { Metadata } from "next";
import { Heebo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import {Toaster} from "@/components/ui/sonner";
import OntoLaunchCard from "@/components/OntoLaunchCard";
import "./globals.css";

// Heebo carries Hebrew glyphs; Plus Jakarta Sans did not.
const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "OpenStock",
  description: "OpenStock — פלטפורמת מעקב מניות בקוד פתוח. מחירים בזמן אמת, התראות אישיות ומידע מעמיק על חברות. חינם, לתמיד.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="he" dir="rtl" className="dark">
            <body
                className={`${heebo.variable} ${plexMono.variable} font-sans antialiased`}
            >
                {children}
                <Toaster/>
                <OntoLaunchCard />
                <Analytics />
            </body>
        </html>
    );
}

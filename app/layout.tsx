import type {Metadata,Viewport} from "next";
import "./globals.css";
import {PwaRegister} from "@/components/pwa-register";
export const metadata:Metadata={title:"Northstar — Customer care, in focus",description:"A clear, calm command center for customer support teams.",applicationName:"Northstar Desk",manifest:"/manifest.webmanifest"};
export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:"#111820"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}<PwaRegister/></body></html>}
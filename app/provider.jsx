"use client"
import React, { useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from "@/components/ui/custom/Header"
import { MessagesContext } from "@/context/MessagesContext"      // ✅ fixed path
import { UserDetailContext } from "@/context/UserDetailContext"  // ✅ fixed path
import { GoogleOAuthProvider } from "@react-oauth/google"
import { useConvex } from "convex/react"
import { api } from "@/convex/_generated/api"
import AppSideBar from "@/components/ui/custom/AppSideBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { ActionContext } from "@/context/ActionContext"          // ✅ fixed path
import { useRouter } from "next/navigation"

function Provider({ children }) {
  const [messages, setMessages] = useState([])       // safe default
  const [userDetail, setUserDetail] = useState(null) // safe default
  const [action, setAction] = useState(null)         // safe default
  const convex = useConvex()
  const router = useRouter()

  useEffect(() => {
    IsAuthenticated()
  }, [])

  const IsAuthenticated = async () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"))
      if (!user) {
        router.push("/")
        return
      }
      // Fetch from database
      const result = await convex.query(api.users.getUser, {
        email: user?.email,
      })
      setUserDetail(result)
      console.log(result)
    }
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <SidebarProvider defaultOpen={false}>
                  <Header />
                  <AppSideBar />
                  {children}
                </SidebarProvider>
              </NextThemesProvider>
            </ActionContext.Provider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </PayPalScriptProvider>
    </GoogleOAuthProvider>
  )
}

export default Provider

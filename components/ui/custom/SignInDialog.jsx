"use client";
import React, { useContext } from "react";
import Lookup from "@/app/data/Lookup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";

function SignInDialog({ open, onOpenChange }) {
  const { setUserDetail } = useContext(UserDetailContext);
  const createUser = useMutation(api.users.createUser);

  // read existing user (if any)
  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  const existingUser = useQuery(
    api.users.getUser,
    storedUser?.email ? { email: storedUser.email } : undefined
  );

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data: googleUser } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse?.access_token}` },
          }
        );

        // If Convex query still loading
        if (googleUser?.email && existingUser === undefined) {
          console.log("Convex query still loading...");
          return;
        }

        let convexUser = existingUser;

        // Create new user in Convex if not exists
        if (googleUser?.email && !existingUser) {
          convexUser = await createUser({
            name: googleUser?.name || "",
            email: googleUser?.email,
            picture: googleUser?.picture || "",
            uid: uuidv4(),
          });
        }

        // ✅ Store Convex user (with _id) in localStorage + context
        localStorage.setItem("user", JSON.stringify(convexUser));
        setUserDetail(convexUser);

        onOpenChange(false);
      } catch (err) {
        console.error("Login error:", err);
      }
    },
    onError: (err) => console.error("Google login error:", err),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{Lookup.SIGNIN_HEADING}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col items-center justify-center gap-3">
              <h2 className="font-bold text-2xl text-center text-white">
                {Lookup.SIGNIN_HEADING}
              </h2>
              <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>

              <Button
                className="bg-blue-500 text-white hover:bg-blue-400 mt-3"
                onClick={googleLogin}
              >
                Sign In With Google
              </Button>

              {existingUser === undefined && (
                <p className="text-sm text-gray-400 mt-2">
                  Checking your account...
                </p>
              )}

              <p className="text-xs text-gray-400 mt-2">
                {Lookup?.SIGNIn_AGREEMENT_TEXT}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;

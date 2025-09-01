import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";

function SideBarFooter() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);

  const options = [
    { name: "Settings", icon: Settings, path: "/settings" },
    { name: "Help Center", icon: HelpCircle, path: "/help" },
    { name: "My Subscription", icon: Wallet, path: "/pricing" },
    { name: "Sign Out", icon: LogOut }, // handled separately
  ];

  const onOptionClick = (option) => {
    if (option?.path) {
      router.push(option.path);
    } else if (option.name === "Sign Out") {
      // ✅ real sign out logic
      setUserDetail(null); // clear user context
      localStorage.removeItem("token"); // clear token if you store it
      router.push("/"); // go back to homepage
    }
  };

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="ghost"
          onClick={() => onOptionClick(option)}
          className="w-full flex justify-start my-3"
        >
          <option.icon className="mr-2" />
          {option.name}
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;

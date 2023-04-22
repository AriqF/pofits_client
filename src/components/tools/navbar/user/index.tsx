import "flowbite";
import UserMobileNavbar from "./mobile-navbar";
import UserDesktopNavbar from "./desktop-navbar";
import BottomBar from "./bottom-bar";
import { useEffect } from "react";

export default function UserNavbar() {
  return (
    <>
      <nav className="lg:hidden w-full">
        {/* <UserMobileNavbar /> */}
        <BottomBar />
      </nav>
      <nav className="lg:block hidden px-2 py-3 bg-palepurple text-white drop-shadow-xl">
        <UserDesktopNavbar />
      </nav>
    </>
  );
}

import MenuOption from "./menu-option";
import {
  AiFillProfile,
  AiOutlineFolderAdd,
  AiOutlineFolderOpen,
  AiOutlineHome,
  AiOutlineMoneyCollect,
  AiOutlineRedEnvelope,
  AiOutlineUser,
  AiOutlineWallet,
} from "react-icons/ai";
import UserMobileNavbar from "./mobile-navbar";
import UserDesktopNavbar from "./desktop-navbar";
import BottomBar from "./bottom-bar";

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

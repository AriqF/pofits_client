import { MdMenu, MdNotes } from "react-icons/md";
import { useEffect, useState } from "react";
import Avatar from "@/components/tools/avatar";
import Image from "next/image";

import UserSideBar from "./sidebar";
import UserAvatarMenu from "./avatar-menu";
import Backdrop from "../../backdrop";
interface Props {
  firstname: string;
  lastname: string;
  userEmail: string;
}

export default function UserNavigation(props: Props) {
  const { firstname, lastname, userEmail } = props;
  const fullname = firstname + " " + lastname;
  const [showProfMenu, setShowProfMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const handleWidthResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWidthResize, false);
  }, []);

  useEffect(() => {
    if (showSidebar) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    if (windowWidth > 768) {
      // document.body.classList.remove("overflow-y-hidden");
      setShowSidebar(false);
    }
    if (windowWidth < 768) {
      // document.body.classList.add("overflow-y-hidden");
    }
  }, [windowWidth]);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-2 border-gray-200 shadow-md">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ">
                <span className="sr-only">Open sidebar</span>
                <MdMenu className="text-2xl" />
              </button>
              <a href="#" className="flex ml-2 md:mr-24">
                <Image
                  src="/pofitsApp.png"
                  height={30}
                  width={30}
                  className="mr-3 w-auto h-auto"
                  alt="Pofits Logo"
                />
                <span className="self-center text-lg my-auto font-semibold sm:text-2xl whitespace-nowrap">
                  Pofits
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ml-3">
                <div>
                  <button
                    type="button"
                    onClick={() => setShowProfMenu(!showProfMenu)}
                    className="flex text-sm bg-gray-800 rounded-lg focus:ring-4 focus:ring-gray-300"
                    // aria-expanded="false"
                    // data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open menu</span>
                    <Avatar
                      name={fullname}
                      round={false}
                      className="m-auto"
                      bgColor="bg-palepurple"
                    />
                  </button>
                </div>
                <UserAvatarMenu username={fullname} email={userEmail} show={showProfMenu} />
              </div>
            </div>
          </div>
        </div>
      </nav>
      <UserSideBar show={showSidebar} />
      {showSidebar ? <Backdrop /> : ""}
    </>
  );
}

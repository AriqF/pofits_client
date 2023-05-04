import { MdMenu, MdNotes } from "react-icons/md";
import TopDropdownOption from "./menu-option";
import UserMenuTopBar from "./user-menu";
import { useEffect, useState } from "react";
import { requestAxios } from "@/utils/helper/axios-helper";
import { baseUrl } from "@/utils/interfaces/constants";
import Avatar from "@/components/tools/avatar";
interface Props {
  firstname: string;
  lastname: string;
  userEmail: string;
}

export default function NavTopBar(props: Props) {
  const { firstname, lastname, userEmail } = props;
  const fullname = firstname + " " + lastname;
  const [showProfMenu, setShowProfMenu] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-2 border-gray-200 shadow-md">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ">
              <span className="sr-only">Open sidebar</span>
              <MdMenu className="text-2xl" />
            </button>
            <a href="https://flowbite.com" className="flex ml-2 md:mr-24">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="FlowBite Logo"
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
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
                    name={"Ariq Fachry"}
                    round={false}
                    className="m-auto"
                    bgColor="bg-palepurple"
                  />
                </button>
              </div>
              <UserMenuTopBar username={fullname} email={userEmail} show={showProfMenu} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

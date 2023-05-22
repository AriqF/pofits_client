import { useState } from "react";
import { MdLogout, MdMenu } from "react-icons/md";
import Avatar from "../../avatar";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { baseAlertStyle, deleteAlertStyle } from "@/utils/global/style";
import { logoutHandler } from "@/utils/helper/axios-helper";
import Image from "next/image";

export default function AdminNavbar() {
  //   const [showProfMenu, setShowProfMenu] = useState(false);
  const swal = withReactContent(Swal);
  const router = useRouter();

  const logoutConfirmHandler = () => {
    swal
      .fire({
        title: "Keluar?",
        icon: "question",
        ...deleteAlertStyle,
        showCancelButton: true,
        cancelButtonText: "Tidak",
        confirmButtonText: "Keluar",
      })
      .then((res) => {
        if (res.isConfirmed) {
          return logoutHandler();
        }
      });
  };

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
            <a href="#" className="flex ml-2 md:mr-24">
              <Image
                src="/pofitsApp.png"
                height={30}
                width={30}
                className="mr-3 w-auto h-auto"
                alt="Pofits Logo"
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
                Pofits
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ml-3">
              <div>
                <button onClick={() => logoutConfirmHandler()}>
                  <MdLogout className="text-2xl hover:text-errorRed" />
                </button>
                {/* <button
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
                </button> */}
              </div>
              {/* <UserMenuTopBar username={"Ariq Fachry"} email={"sample@mail.com"} show={showProfMenu} /> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

import AdminNavbar from "@/components/tools/sidebar/admin/admin-navbar";
import AdminSideBar from "@/components/tools/sidebar/admin/admin-sidebar";
import { ReactNode } from "react";
import { MdChevronLeft } from "react-icons/md";

interface Props {
  classname?: string;
  children: ReactNode;
  title?: string;
  backTo?: string;
}

export default function AdminLayout(props: Props) {
  return (
    <>
      <AdminNavbar />
      <AdminSideBar />
      <div className={" p-4 sm:ml-64 md:bg-white bg-white max-h-fit"}>
        <div className={props.classname + " flex flex-col mt-20 md:mx-5"}>
          {props.backTo ? (
            <header className="p-0 min-h-fit flex-col gap-y-4 mb-4 md:mb-2">
              <a
                href={props.backTo}
                className="text-blue hover:text-hovblue font-semibold inline-flex cursor-pointer">
                <MdChevronLeft className="my-auto text-2xl" /> <p>Kembali</p>
              </a>
            </header>
          ) : (
            ""
          )}
          {props.title ? (
            <h2 className="text-2xl font-semibold capitalize mb-8">{props.title}</h2>
          ) : (
            ""
          )}
          {props.children}
        </div>
      </div>
    </>
  );
}

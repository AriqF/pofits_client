import { UserPath } from "@/utils/global/route-path";
import { ReactNode } from "react";
import { MdChevronLeft } from "react-icons/md";
import UserBaseLayout from "../layouts";
import UserSideBar from "@/components/tools/sidebar/user/sidebar";
import NavTopBar from "@/components/tools/sidebar/user/top-bar";

interface Props {
  children: ReactNode;
  backTo?: UserPath;
}

export default function TransactionLayout(props: Props) {
  return (
    <>
      <NavTopBar />
      <UserSideBar />
      <main className="p-4 sm:ml-64 md:bg-white bg-white max-h-fit">
        <div className="mt-20 md:mx-5">
          {props.backTo ? (
            <header className="p-0 min-h-fit inline-flex flex-col gap-y-4 mb-4 md:mb-2">
              <a
                href={props.backTo}
                className="text-blue hover:text-hovblue font-semibold inline-flex cursor-pointer">
                <MdChevronLeft className="my-auto text-2xl" /> <p>Kembali</p>
              </a>
            </header>
          ) : (
            ""
          )}
          <section
            className={
              "min-h-screen lg:mb-0 lg:grid lg:grid-cols-4 lg:gap-x-10 space-y-4 md:space-y-0 "
            }>
            {props.children}
          </section>
        </div>
      </main>
    </>
  );
}

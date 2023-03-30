import UserSideBar from "@/components/tools/sidebar/user/sidebar";
import NavTopBar from "@/components/tools/sidebar/user/top-bar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function UserBaseLayout(props: Props) {
  return (
    <>
      <NavTopBar />
      <UserSideBar />
      {/* <Sidebar.Item></Sidebar> */}

      <main className="p-4 sm:ml-64 md:bg-white bg-white max-h-fit">
        <div className="mt-20 md:mx-5">{props.children}</div>
      </main>
    </>
  );
}

import UserNavbar from "@/components/tools/navbar/user";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function UserLayout(props: LayoutProps) {
  return (
    <>
      <UserNavbar />
      <section id="user-body-content" className="min-h-screen p-5 bg-whitegrey">
        {props.children}
      </section>
    </>
  );
}

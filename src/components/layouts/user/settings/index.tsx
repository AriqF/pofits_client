import UserNavbar from "@/components/tools/navbar/user";
import { ReactNode } from "react";
import SettingMenuBox from "./menu-box";
import SettingProfileBox from "./profile-box";

interface USettingsProps {
  children: ReactNode;
}

export default function UserSettingsLayout(props: USettingsProps) {
  const { children } = props;
  return (
    <>
      <UserNavbar />
      <main className="min-h-screen lg:grid lg:grid-cols-3 lg:grid-flow-col lg:gap-x-10 lg:px-14 lg:py-8 bg-whitegrey">
        <section id="settings-menu" className="hidden lg:flex lg:flex-col md:col-span-1 gap-y-4">
          <SettingProfileBox />
          <SettingMenuBox />
        </section>
        <section id="settings-content" className={"md:col-span-2 w-full "}>
          {children}
        </section>
      </main>
    </>
  );
}

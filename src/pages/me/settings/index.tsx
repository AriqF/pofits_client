import UserSettingsLayout from "@/components/layouts/user/settings";
import SettingMenuBox from "@/components/layouts/user/settings/menu-box";
import SettingProfileBox from "@/components/layouts/user/settings/profile-box";
import UserNavbar from "@/components/tools/navbar/user";
import UserProfileSettings from "../profile";

export default function UserSettings() {
  return (
    <>
      <UserNavbar />
      <main className="lg:grid lg:grid-cols-3 lg:grid-flow-col lg:gap-x-10 lg:px-14 lg:py-8 bg-white md:bg-whitegrey">
        <section id="settings-menu" className="lg:flex lg:flex-col md:col-span-1 gap-y-4">
          <div className="p-5 md:p-0">
            <SettingProfileBox />
          </div>
          <div>
            <SettingMenuBox />
          </div>
        </section>
        <section id="settings-content" className={"md:col-span-2 w-full hidden"}>
          <UserProfileSettings />
        </section>
      </main>
    </>
  );
}

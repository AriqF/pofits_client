import { MdGroups, MdHistory, MdHome, MdManageAccounts } from "react-icons/md";
import { AdminPath } from "@/utils/global/route-path";
import SidebarItem from "../../sidebar/sidebar-item";

interface Props {
  show: boolean;
}

export default function AdminSideBar(props: Props) {
  return (
    <aside
      id="logo-sidebar"
      className={
        "fixed top-0 left-0 z-40 h-screen pt-20 transition-transform bg-gradient-to-b from-palepurple to-blue " +
        "w-64 transition-transform fixed top-0 left-0 z-40 h-screen " +
        (props.show ? " transform-none" : "-translate-x-full md:translate-x-0 ")
      }
      aria-label="Sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-gradient-to-b from-palepurple to-blue text-white ">
        <ul className="space-y-3">
          <SidebarItem text={"Beranda"} linkTo={AdminPath.HOME} icon={MdHome} />
          <SidebarItem text={"List Pengguna"} linkTo={AdminPath.USERS} icon={MdGroups} />
          <SidebarItem text={"Logs"} linkTo={AdminPath.ADMIN_LOG} icon={MdHistory} />
          <SidebarItem text={"Profil"} linkTo={AdminPath.PROFILE} icon={MdManageAccounts} />
        </ul>
      </div>
    </aside>
  );
}

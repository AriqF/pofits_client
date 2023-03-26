import { UserPath } from "@/utils/global/route-path";
import { Sidebar } from "flowbite-react";
import {
  MdAccountBalanceWallet,
  MdHome,
  MdAssignment,
  MdAttachMoney,
  MdKeyboardArrowDown,
  MdSettings,
  MdRule,
  MdTune,
  MdFlag,
  MdReceiptLong,
  MdRequestQuote,
} from "react-icons/md";
import SidebarItemDropdown from "./dropdown/sidebar-dropdown";
import SidebarItem from "./sidebar-item";

export default function UserSideBar() {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-gradient-to-b from-palepurple to-blue sm:translate-x-0 "
      aria-label="Sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-gradient-to-b from-palepurple to-blue text-white ">
        <ul className="space-y-3">
          <SidebarItem text={"Beranda"} linkTo={UserPath.HOME} icon={MdHome} />
          <SidebarItem text={"Anggaran"} linkTo={UserPath.BUDGET} icon={MdRequestQuote} />
          <SidebarItem
            text={"Transaksi"}
            linkTo={UserPath.BUDGET}
            icon={MdReceiptLong}
            badgeText="404"
          />
          <SidebarItem
            text={"Tujuan Keuangan"}
            linkTo={UserPath.FINANCE_GOAL}
            icon={MdFlag}
            badgeText="404"
          />
          <SidebarItemDropdown text={"Atur Data"} linkTo={UserPath.SETTINGS} icon={MdTune}>
            <SidebarItem text={"Dompet"} linkTo={UserPath.WALLETS} dropdownItem={true} />
            <SidebarItem
              text={"Kategori Pemasukan"}
              linkTo={UserPath.INCOME_CATEGORY}
              dropdownItem={true}
            />
            <SidebarItem
              text={"Kategori Pengeluaran"}
              linkTo={UserPath.EXPENSE_CATEGORY}
              dropdownItem={true}
            />
          </SidebarItemDropdown>
        </ul>
      </div>
    </aside>
  );
}

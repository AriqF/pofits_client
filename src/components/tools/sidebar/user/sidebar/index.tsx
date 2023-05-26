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
  MdFactCheck,
  MdMoveToInbox,
  MdOutbox,
  MdAnalytics,
  MdStickyNote2,
} from "react-icons/md";
import SidebarItemDropdown from "./dropdown/sidebar-dropdown";
import SidebarItem from "./sidebar-item";

interface SidebarProps {
  show: boolean;
}

export default function UserSideBar(props: SidebarProps) {
  return (
    <aside
      className={
        "fixed top-0 left-0 z-40 h-screen pt-20 transition-transform bg-gradient-to-b from-palepurple to-blue " +
        "w-64 transition-transform fixed top-0 left-0 z-40 h-screen " +
        (props.show ? " transform-none" : "-translate-x-full md:translate-x-0 ")
      }
      role="dialog"
      aria-modal="true">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-gradient-to-b from-palepurple to-blue text-white ">
        <ul className="space-y-3">
          <SidebarItem text={"Beranda"} linkTo={UserPath.HOME} icon={MdHome} />
          <SidebarItem text={"Anggaran"} linkTo={UserPath.BUDGET} icon={MdRequestQuote} />
          <SidebarItem text={"Target Pemasukan"} linkTo={UserPath.ESTIMATION} icon={MdFactCheck} />
          <SidebarItem text={"Transaksi"} linkTo={UserPath.TRANSACTION} icon={MdReceiptLong} />
          <SidebarItem
            text={"Laporan Keuangan"}
            linkTo={UserPath.MONTHLY_REPORT}
            icon={MdAnalytics}
          />
          <SidebarItem
            text={"Rencana Keuangan"}
            linkTo={UserPath.FINANCE_GOAL}
            icon={MdStickyNote2}
          />
          <SidebarItemDropdown text={"Atur Data"} linkTo={UserPath.SETTINGS} icon={MdTune}>
            <SidebarItem
              text={"Kategori Pemasukan"}
              linkTo={UserPath.INCOME_CATEGORY}
              // dropdownItem={true}
              icon={MdMoveToInbox}
            />
            <SidebarItem
              text={"Dompet"}
              linkTo={UserPath.WALLETS}
              // dropdownItem={true}
              icon={MdAccountBalanceWallet}
            />

            <SidebarItem
              text={"Kategori Pengeluaran"}
              linkTo={UserPath.EXPENSE_CATEGORY}
              // dropdownItem={true}
              icon={MdOutbox}
            />
          </SidebarItemDropdown>
        </ul>
      </div>
    </aside>
  );
}

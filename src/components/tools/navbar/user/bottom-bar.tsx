import { useRouter } from "next/router";
import {
  MdAccountBalanceWallet,
  MdAttachMoney,
  MdHome,
  MdSettings,
  MdTableView,
} from "react-icons/md";
export default function BottomBar() {
  const iconClass = "text-3xl ";
  const iconTextClass = "text-xs group-hover:text-blue-600";
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white text-gray-500 border-t border-gray-300 drop-shadow-xl">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto px-2">
        <div className={"m-auto " + (router.pathname === "/me" ? " text-palepurple" : " ")}>
          <a
            href={"/me"}
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50">
            <MdHome className={iconClass} />
            <span className={iconTextClass}>Beranda</span>
          </a>
        </div>
        <div
          className={
            "m-auto " + (router.pathname.startsWith("/me/budget") ? "text-palepurple" : " ")
          }>
          <a
            href={"/me/budget"}
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 ">
            <MdAccountBalanceWallet className={iconClass} />
            <span className={iconTextClass}>Anggaran</span>
          </a>
        </div>
        <div
          className={
            "m-auto " + (router.pathname.startsWith("/me/transactions") ? "text-palepurple" : " ")
          }>
          <a
            href={"/me/transactions"}
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 ">
            <MdTableView className={iconClass} />
            <span className={iconTextClass}>Transaksi</span>
          </a>
        </div>
        <div
          className={
            "m-auto " + (router.pathname.startsWith("/me/settings") ? "text-palepurple" : " ")
          }>
          <a
            href={"/me/settings"}
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 ">
            <MdSettings className={iconClass} />
            <span className={iconTextClass}>Pengaturan</span>
          </a>
        </div>
        {/* <a
          href={""}
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 ">
          <MdLogout className={iconClass} />
          <span className="text-sm   group-hover:text-blue-600">Keluar</span>
        </a> */}
      </div>
    </div>
  );
}

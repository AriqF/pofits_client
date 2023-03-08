import { useRouter } from "next/router";
import { MdAttachMoney, MdHome, MdLogout, MdSettings } from "react-icons/md";
export default function BottomBar() {
  const iconClass = "text-3xl ";
  const router = useRouter();
  const settingsPath: string[] = [
    "/me/wallets",
    "/me/profile",
    "/me/income-category",
    "/me/expense-category",
    "me/settings",
  ];

  if (router.pathname.includes("/me"))
    return (
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white text-gray-500 border-t border-gray-300 drop-shadow-xl">
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto px-2">
          <div className={"m-auto " + (router.pathname === "/me" ? " text-palepurple" : " ")}>
            <a
              href={"/me"}
              type="button"
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50">
              <MdHome className={iconClass} />
              <span className="text-sm group-hover:text-blue-600">Beranda</span>
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
              <MdAttachMoney className={iconClass} />
              <span className="text-sm group-hover:text-blue-600">Transaksi</span>
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
              <span className="text-sm group-hover:text-blue-600">Pengaturan</span>
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

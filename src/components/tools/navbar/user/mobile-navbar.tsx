import { AiOutlineSetting, AiOutlineHome, AiOutlineBook } from "react-icons/ai";

export default function UserMobileNavbar() {
  const boxClassName: string =
    "w-full focus:text-palepurple hover:text-palepurple justify-center inline-block text-center pt-2 pb-1";
  const iconClassName: string = "inline-block mb-1 text-3xl";
  const spanClassName: string = "tab tab-home block text-xs md:text-md font-medium";

  return (
    <section id="bottom-navigation" className="block fixed inset-x-0 bottom-0 z-10 bg-white shadow">
      <div id="tabs" className="flex justify-between border-t-2 gap-x-2">
        <a href="/me" className={boxClassName}>
          <AiOutlineHome width={50} height={50} className={iconClassName} />
          <span className={spanClassName}>Beranda</span>
        </a>
        <a href="#" className={boxClassName}>
          <AiOutlineBook width={50} height={50} className={iconClassName} />
          <span className={spanClassName}>Transaksi</span>
        </a>
        <a href="/me/settings" className={boxClassName}>
          <AiOutlineSetting width={50} height={50} className={iconClassName} />
          <span className={spanClassName}>Pengaturan</span>
        </a>
      </div>
    </section>
  );
}

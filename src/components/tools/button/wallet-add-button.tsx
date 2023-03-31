import { BiListPlus } from "react-icons/bi";

export default function WalletAddButton() {
  return (
    <a
      className="max-w-full text-center text-white hover:text-white font-semibold bg-palepurple hover:bg-hovpalepurple border-2 border-palepurple inline-flex px-6 py-7  drop-shadow-lg rounded-md"
      href="/me/settings/wallets/add">
      {/* <span className="md:hidden text-xl">Tambah Dompet</span> */}
      <BiListPlus className="text-3xl m-auto" />
    </a>
  );
}

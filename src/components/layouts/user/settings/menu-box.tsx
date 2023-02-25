import MenuOptionItem from "./menu-option";
import { BiExport, BiHelpCircle, BiImport, BiLogOut, BiUser, BiWallet } from "react-icons/bi";
interface Props {
  className?: string;
}

export default function SettingMenuBox(props: Props) {
  return (
    <div
      id="settings-option"
      className={
        "bg-white rounded-md md:shadow-md p-6 grid grid-flow-row space-y-3 text-darktext" +
        props.className
      }>
      <MenuOptionItem linkTo="/me/wallets">
        <BiWallet className="flex-inline my-auto text-2xl mr-2" />
        <h4>Dompet</h4>
      </MenuOptionItem>
      <MenuOptionItem linkTo="#">
        <BiExport className="flex-inline my-auto text-2xl mr-2" />
        <h4>Kategori pengeluaran</h4>
      </MenuOptionItem>
      <MenuOptionItem linkTo="#">
        <BiImport className="flex-inline my-auto text-2xl mr-2" />
        <h4>Kategori pemasukan</h4>
      </MenuOptionItem>
      <MenuOptionItem linkTo="#">
        <BiUser className="flex-inline my-auto text-2xl mr-2" />
        <h4>Akun</h4>
      </MenuOptionItem>
      <MenuOptionItem linkTo="#">
        <BiHelpCircle className="flex-inline my-auto text-2xl mr-2" />
        <h4>Bantuan</h4>
      </MenuOptionItem>
      <MenuOptionItem linkTo="#">
        <BiLogOut className="flex-inline my-auto text-2xl mr-2" />
        <h4>Keluar</h4>
      </MenuOptionItem>
    </div>
  );
}

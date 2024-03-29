import MenuOptionItem from "../../../tools/menu/menu-box/menu-option";
import { BiExport, BiHelpCircle, BiImport, BiLogOut, BiUser, BiWallet } from "react-icons/bi";
import { logoutHandler } from "@/utils/helper/axios-helper";
import Container from "@/components/tools/container";

interface Props {
  className?: string;
}

export default function SettingMenuBox(props: Props) {
  return (
    <Container id="settings-option" className={props.className}>
      <MenuOptionItem linkTo="/me/settings/wallets">
        <BiWallet className="flex-inline my-auto text-2xl mr-2" />
        <h4>Dompet</h4>
      </MenuOptionItem>
      <MenuOptionItem linkTo="/me/settings/income-category">
        <BiImport className="flex-inline my-auto text-2xl mr-2" />
        <h4>Kategori pemasukan</h4>
      </MenuOptionItem>
      <MenuOptionItem linkTo="/me/settings/expense-category">
        <BiExport className="flex-inline my-auto text-2xl mr-2" />
        <h4>Kategori pengeluaran</h4>
      </MenuOptionItem>
      <MenuOptionItem linkTo="/me/settings/account">
        <BiUser className="flex-inline my-auto text-2xl mr-2" />
        <h4>Akun</h4>
      </MenuOptionItem>
      <MenuOptionItem linkTo="#">
        <BiHelpCircle className="flex-inline my-auto text-2xl mr-2" />
        <h4>Bantuan</h4>
      </MenuOptionItem>
      <MenuOptionItem onClick={logoutHandler} className="cursor-pointer">
        <BiLogOut className="flex-inline my-auto text-2xl mr-2" />
        <h4>Keluar</h4>
      </MenuOptionItem>
    </Container>
  );
}

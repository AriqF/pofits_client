import { UserPath } from "@/utils/global/route-path";
import { ReactNode } from "react";
import { MdKeyboardArrowDown, MdRequestPage } from "react-icons/md";
import MenuOptionItem from "./menu-box/menu-option";

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function MenuCollapse(props: Props) {
  const { title, children } = props;
  return (
    <div className="relative w-full overflow-hidden hover:drop-shadow-md">
      <input
        type="checkbox"
        className="peer absolute top-0 inset-x-0 w-full h-12 z-10 opacity-0 cursor-pointer"
      />
      <div className="h-12 w-full pl-5 flex items-center font-bold">
        <p>{title}</p>
      </div>
      {/* arrow icon */}
      <div className="absolute top-3 right-3 transition-transform duration-500 rotate-0 peer-checked:rotate-180">
        <MdKeyboardArrowDown className="text-2xl" />
      </div>
      {/* content */}
      <div className="bg-transparent overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-40">
        <div className="flex flex-col pl-4">{children}</div>
      </div>
    </div>
  );
}

//EXAMPLE CODE:
// <Container id="budget-menu">
//   <MenuCollapse title="Anggaran Pengeluaran">
//     <MenuOptionItem
//       linkTo={UserPath.ESTIMATION}
//       className="hover:bg-palepurple hover:text-white">
//       {/* <MdShoppingBag className="flex-inline my-auto text-2xl mr-2" /> */}
//       <h4>Tambah Anggaran</h4>
//     </MenuOptionItem>
//   </MenuCollapse>
//   <MenuCollapse title="Estimasi Pemasukan">
//     <MenuOptionItem
//       linkTo={UserPath.ESTIMATION}
//       className="hover:bg-palepurple hover:text-white hover:opacity-70">
//       <MdRequestPage className="flex-inline my-auto text-2xl mr-2" />
//       <h4>Estimasi Pemasukan</h4>
//     </MenuOptionItem>
//   </MenuCollapse>
// </Container>

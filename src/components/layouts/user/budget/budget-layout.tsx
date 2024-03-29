import { UserPath } from "@/utils/global/route-path";
import { ReactNode } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { MdChevronLeft } from "react-icons/md";
import UserBaseLayout from "../layouts";
import Link from "next/link";

interface Props {
  children: ReactNode;
  backTo: string;
}

export default function BudgetPageLayout(props: Props) {
  return (
    <UserBaseLayout>
      <header className="p-0 min-h-fit inline-flex flex-col gap-y-4 mb-4 md:mb-2">
        <Link
          href={props.backTo}
          className="text-blue hover:text-hovblue font-semibold w-fit inline-flex cursor-pointer">
          <MdChevronLeft className="my-auto text-2xl" /> <p>Kembali</p>
        </Link>
      </header>
      <section
        className={
          "min-h-screen lg:mb-0 lg:grid lg:grid-cols-3 lg:grid-flow-col lg:gap-x-10 space-y-4 md:space-y-0 "
        }>
        {props.children}
      </section>
    </UserBaseLayout>
  );
}

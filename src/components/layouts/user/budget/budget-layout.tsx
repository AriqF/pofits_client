import { UserPath } from "@/utils/global/route-path";
import { ReactNode } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { MdChevronLeft } from "react-icons/md";
import UserLayout from "..";
import UserBaseLayout from "../layouts";

interface Props {
  children: ReactNode;
  backTo: UserPath;
}

export default function BudgetPageLayout(props: Props) {
  return (
    <UserBaseLayout>
      <section
        className={
          "min-h-screen lg:mb-0 lg:grid lg:grid-cols-3 lg:grid-flow-col lg:gap-x-10 space-y-4 md:space-y-0 "
        }>
        <header className="p-0 min-h-fit flex flex-col gap-y-4 md:hidden">
          <a
            href={props.backTo}
            className="text-blue hover:text-hovblue font-semibold inline-flex cursor-pointer">
            <MdChevronLeft className="my-auto text-2xl" /> <p>Kembali</p>
          </a>
        </header>
        {props.children}
      </section>
    </UserBaseLayout>
  );
}

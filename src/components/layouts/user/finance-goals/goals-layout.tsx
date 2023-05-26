import { UserPath } from "@/utils/global/route-path";
import { ReactNode } from "react";
import { MdChevronLeft } from "react-icons/md";
import UserBaseLayout from "../layouts";

interface Props {
  children: ReactNode;
  backTo: string;
}
export default function GoalsLayout(props: Props) {
  return (
    <UserBaseLayout>
      <header className="p-0 min-h-fit inline-flex flex-col gap-y-4 mb-4 md:mb-2">
        <a
          href={props.backTo}
          className="text-blue hover:text-hovblue font-semibold w-fit inline-flex cursor-pointer">
          <MdChevronLeft className="my-auto text-2xl" /> <p>Kembali</p>
        </a>
      </header>
      <section className={"min-h-screen lg:mb-0 space-y-6"}>{props.children}</section>
    </UserBaseLayout>
  );
}

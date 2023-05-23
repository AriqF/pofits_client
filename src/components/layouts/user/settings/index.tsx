import { ReactNode } from "react";
import { MdChevronLeft } from "react-icons/md";
import UserBaseLayout from "../layouts";
import Link from "next/link";

interface USettingsProps {
  children: ReactNode;
  backTo: string;
}

export default function UserSettingsLayout(props: USettingsProps) {
  const { children } = props;
  return (
    <>
      <UserBaseLayout>
        <header className="p-0 min-h-fit inline-flex flex-col gap-y-4 mb-5 md:mb-2 no-select">
          <Link
            href={props.backTo}
            className="text-blue hover:text-hovblue font-semibold inline-flex cursor-pointer">
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
    </>
  );
}

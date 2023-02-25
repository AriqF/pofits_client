import { useRouter } from "next/router";
import { ReactNode } from "react";
import { BiChevronLeft } from "react-icons/bi";

interface HeaderProps {
  backTo: string;
  children: ReactNode;
}

export default function UserSettingsHeader(props: HeaderProps) {
  const router = useRouter();
  function stepBack() {
    return router.back();
  }
  return (
    <header className="bg-white border-gray-500 rounded-sm p-6 shadow-md min-h-fit flex flex-col gap-y-4">
      <div className="basis-1">
        <a
          // onClick={stepBack}
          href={props.backTo}
          className="text-blue hover:text-hovblue font-semibold inline-flex cursor-pointer">
          <BiChevronLeft className="my-auto text-2xl" /> <p>Kembali</p>
        </a>
      </div>
      {props.children}
    </header>
  );
}

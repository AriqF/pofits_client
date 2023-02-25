import { icon } from "@fortawesome/fontawesome-svg-core";
import { ReactNode } from "react";
import { IconType } from "react-icons";
import { AiOutlineWallet } from "react-icons/ai";

interface Props {
  //   title: string;
  linkTo: string;
  children: ReactNode;
}

export default function MenuOptionItem(props: Props) {
  return (
    <a
      className="bg-white inline-flex border-b border-gray-200 px-3 py-3 text-base font-semibold capitalize"
      href={props.linkTo}>
      {props.children}
    </a>
  );
}

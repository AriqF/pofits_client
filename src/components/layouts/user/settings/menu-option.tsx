import { MouseEventHandler, ReactNode } from "react";

interface Props {
  //   title: string;
  linkTo?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  className?: string;
}

export default function MenuOptionItem(props: Props) {
  return (
    <a
      onClick={props.onClick}
      className={
        "bg-white inline-flex border-b border-gray-200 px-3 py-3 text-base font-semibold capitalize " +
        props.className
      }
      href={props.linkTo}>
      {props.children}
    </a>
  );
}

import { MouseEventHandler, ReactNode } from "react";

interface Props {
  //   title: string;
  linkTo?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  className?: string;
  bgActive?: boolean;
  // bgClass?: string;
}

export default function MenuOptionItem(props: Props) {
  let { bgActive } = props;

  return (
    <a
      onClick={props.onClick}
      className={
        props.className +
        (bgActive ? " bg-palepurple " : " ") +
        " inline-flex border-b border-gray-200 px-3 py-3 text-base capitalize "
        // (bgClass ? bgClass : "bg-white")
      }
      href={props.linkTo}>
      {props.children}
    </a>
  );
}

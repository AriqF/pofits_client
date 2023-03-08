import { MouseEventHandler, useState } from "react";
import { BiChevronDown, BiChevronLeft } from "react-icons/bi";

interface Props {
  className?: string;
  isToggled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

export default function ButtonToggleDown(props: Props) {
  return (
    <button
      onClick={props.onClick}
      className={
        "ml-auto text-2xl border-2 border-palepurple hover:bg-palepurple hover:text-white rounded-md p-1 " +
        props.className
      }>
      {/* <span className={props.isToggled ? "translate-y-6" : ""}>
        <BiChevronDown />
      </span> */}
      {props.isToggled ? <BiChevronLeft /> : <BiChevronDown />}
    </button>
  );
}

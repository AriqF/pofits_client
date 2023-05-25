import React, { MouseEventHandler, ReactNode } from "react";
import { IconType } from "react-icons";
import Spinner from "../spinner";

interface ButtonProps {
  type: "button" | "submit" | "reset" | undefined;
  ref?: React.LegacyRef<HTMLButtonElement> | undefined;
  className?: string;
  isSubmitting?: boolean;
  color: "default" | "warning" | "success" | "danger" | "info";
  icon?: IconType;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function DefaultButton(props: ButtonProps) {
  let { type, ref, className, color } = props;
  let colorClass: string = "";

  switch (color) {
    case "default":
      colorClass = "text-white bg-palepurple hover:bg-hovpalepurple focus:ring-hovpalepurple";
      break;
    case "warning":
      colorClass = "text-white bg-warnYellow hover:bg-hovWarnYellow focus:ring-hovWarnYellow";
      break;
    case "success":
      colorClass = "text-white bg-successGreen hover:bg-hovSuccessGreen focus:ring-hovSuccessGreen";
      break;
    case "danger":
      colorClass = "text-white bg-errorRed hover:bg-hovErrorRed focus:ring-hovErrorRed";
      break;
    case "info":
      colorClass = "text-white bg-blue hover:bg-hovblue focus:ring-hovblue";
      break;
    default:
  }

  return (
    <button
      onClick={props.onClick}
      type={type}
      ref={ref}
      className={
        colorClass +
        " " +
        className +
        " inline-flex place-content-center text-center focus:ring-1 focus:outline-none " +
        "rounded-md text-base px-4 py-3 md:py-2.5 w-full lg:w-fit m-auto transition-colors duration-200 "
      }>
      {props.type === "submit" ? props.isSubmitting ? <Spinner /> : "" : ""}
      {props.children}
    </button>
  );
}

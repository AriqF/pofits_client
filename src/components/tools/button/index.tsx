import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  type: "button" | "submit" | "reset" | undefined;
  ref?: React.LegacyRef<HTMLButtonElement> | undefined;
  className?: string;
  text: string;
  color: "default" | "warning" | "success" | "danger" | "info";
  icon?: IconType;
}

export default function DefaultButton(props: ButtonProps) {
  let { text, type, ref, className, color } = props;
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
      colorClass = "text-white bg-infoBlue hover:bg-hovInfoBlue focus:ring-hovInfoBlue";
      break;
    default:
  }

  return (
    <button
      type={type}
      ref={ref}
      className={
        colorClass +
        " " +
        className +
        " inline-flex text-center font-semibold focus:ring-1 focus:outline-none " +
        "rounded-md text-md px-4 py-3 w-full m-auto "
      }>
      {props.icon ? React.createElement(props?.icon, { className: "text-2xl mr-2" }) : ""}
      {text}
    </button>
  );
}

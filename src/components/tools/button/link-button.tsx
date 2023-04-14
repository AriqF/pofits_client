import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  type: "button" | "submit" | "reset" | undefined;
  className?: string;
  text: string;
  color: "default" | "warning" | "success" | "danger" | "info";
  linkTo: string;
  icon?: IconType;
}

export default function LinkButton(props: ButtonProps) {
  let { text, type, className, color, linkTo } = props;
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
    <a
      href={linkTo}
      type={type}
      className={
        className +
        " " +
        " px-2 py-3 md:py-2.5 my-auto inline-flex gap-x-2 place-content-center text-center font-semibold focus:ring-1 focus:outline-none rounded-md text-md  w-full " +
        colorClass +
        " "
      }>
      {props.icon ? React.createElement(props.icon, { className: "text-xl my-auto" }) : ""}
      <span className="my-auto">{text}</span>
    </a>
  );
}

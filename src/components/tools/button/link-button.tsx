import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  type: "button" | "submit" | "reset" | undefined;
  className?: string;
  text: string;
  color: "default" | "warning" | "success" | "danger" | "info" | "custom";
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
      colorClass = "";
  }

  return (
    <a
      href={linkTo}
      type={type}
      className={
        colorClass +
        " " +
        className +
        " inline-flex place-content-center text-center focus:ring-1 focus:outline-none " +
        "rounded-md text-base px-4 py-3 md:py-2.5 w-full lg:w-fit m-auto transition-colors duration-200 "
      }>
      {props.icon ? React.createElement(props.icon, { className: "text-xl my-auto mr-1" }) : ""}
      <span className="my-auto">{text}</span>
    </a>
  );
}

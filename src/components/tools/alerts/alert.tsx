import React from "react";
import { IconType } from "react-icons";
import { CgCheckO, CgDanger, CgInfo } from "react-icons/cg";
import {
  MdCheckCircleOutline,
  MdInfoOutline,
  MdOutlineDangerous,
  MdOutlineWarningAmber,
} from "react-icons/md";
import { TiWarningOutline } from "react-icons/ti";

interface AlertProps {
  text: string;
  type: "info" | "danger" | "success" | "warning";
  isCapitalize?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
}

export default function Alert(props: AlertProps) {
  const { text, type, isCapitalize } = props;
  let { size } = props;
  let py: string = "py-3";
  let textTransform = "normal-case";
  if (isCapitalize) textTransform = "capitalize";
  if (!size) {
    size = "small";
  }

  let bgColor: string;
  let icon: IconType;
  // let icon: JSX.Element = <CgInfo />;

  switch (size) {
    case "small":
      py = "py-2.5";
      break;
    case "medium":
      py = "py-3.5";
    case "large":
      py = "py-4.5";
    default:
      py = "py-3.5";
  }

  switch (type) {
    case "info":
      bgColor = "bg-infoBlue";
      icon = MdInfoOutline;
      break;
    case "danger":
      bgColor = "bg-errorRed";
      icon = MdOutlineDangerous;
      break;
    case "warning":
      bgColor = "bg-warnOrange";
      icon = MdOutlineWarningAmber;
      break;
    case "success":
      bgColor = "bg-successGreen";
      icon = MdCheckCircleOutline;
      break;
    default:
      bgColor = "bg-infoBlue";
      icon = MdCheckCircleOutline;
  }

  return (
    <div
      className={
        props.className +
        ` flex ${py} mb-4 px-2.5 text-sm text-whitegrey text-center rounded-md ${bgColor}`
      }
      role="alert">
      <p className={`font-medium ${textTransform} flex m-auto place-content-center`}>
        {React.createElement(icon, { className: "text-2xl mr-2 my-auto" })}
        <span className="my-auto">{text}</span>
      </p>
    </div>
  );
}

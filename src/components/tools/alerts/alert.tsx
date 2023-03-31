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
}

export default function Alert(props: AlertProps) {
  const { text, type, isCapitalize } = props;

  let textTransform = "normal-case";
  if (isCapitalize) textTransform = "capitalize";

  let bgColor: string;
  let icon: IconType;
  // let icon: JSX.Element = <CgInfo />;

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
      bgColor = "bg-warnYellow";
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
        ` flex py-2.5 mb-4 text-sm text-whitegrey text-center rounded-md ${bgColor}`
      }
      role="alert">
      <p className={`font-medium ${textTransform} flex m-auto`}>
        {React.createElement(icon, { className: "text-2xl mr-2" })}
        {text}
      </p>
    </div>
  );
}

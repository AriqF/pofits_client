interface ButtonProps {
  type: "button" | "submit" | "reset" | undefined;
  className?: string;
  text: string;
  color: "default" | "warning" | "success" | "danger" | "info";
  linkTo: string;
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
        "text-center font-semibold focus:ring-1 focus:outline-none rounded-md text-md px-4 py-3 w-full " +
        colorClass +
        " " +
        className
      }>
      {text}
    </a>
  );
}

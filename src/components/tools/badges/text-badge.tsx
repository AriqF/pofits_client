interface Props {
  color: "default" | "warning" | "success" | "danger" | "info";
  text: string;
  className?: string;
}

export function TextBadge(props: Props) {
  let colorClass: string = "";
  switch (props.color) {
    case "default":
      colorClass = "text-white bg-palepurple ";
      break;
    case "warning":
      colorClass = "text-white bg-warnYellow ";
      break;
    case "success":
      colorClass = "text-white bg-successGreen ";
      break;
    case "danger":
      colorClass = "text-white bg-errorRed ";
      break;
    case "info":
      colorClass = "text-white bg-infoBlue ";
      break;
    default:
  }
  return (
    <span
      className={`${props.className} ${colorClass} ` + " m-auto font-medium px-1.5 py-1 rounded"}>
      {props.text}
    </span>
  );
}

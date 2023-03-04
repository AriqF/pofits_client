import { AlertType } from "@/utils/interfaces/constants";

interface HelperProps {
  text: string | undefined;
  textColor?: AlertType;
}

export default function FormHelper(props: HelperProps) {
  let { text, textColor } = props;
  if (typeof text === undefined) {
    text = " ";
  }
  let color: string;
  switch (textColor) {
    case "info":
      color = "text-infoBlue";
      break;
    case "danger":
      color = "text-errorRed";
      break;
    case "warning":
      color = "text-warnYellow";
      break;
    case "success":
      color = "text-successGreen";
      break;
    default:
      color = "text-infoBlue";
  }
  return <span className={`font-medium t-2 text-xs ${color}`}>{text}</span>;
}

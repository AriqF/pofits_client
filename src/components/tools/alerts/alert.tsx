import { CgCheckO, CgDanger, CgInfo } from "react-icons/cg";
import { TiWarningOutline } from "react-icons/ti";

interface AlertProps {
  text: string;
  type: "info" | "danger" | "success" | "warning";
  isCapitalize?: boolean;
}

export default function Alert(props: AlertProps) {
  const { text, type, isCapitalize } = props;

  let textTransform = "normal-case";
  if (isCapitalize) textTransform = "capitalize";

  let bgColor: string;
  // let icon: JSX.Element = <CgInfo />;

  switch (type) {
    case "info":
      bgColor = "bg-infoBlue";
      // icon = <CgInfo size={20} />;
      break;
    case "danger":
      bgColor = "bg-errorRed";
      // icon = <CgDanger size={20} />;
      break;
    case "warning":
      bgColor = "bg-warnYellow";
      // icon = <TiWarningOutline />;
      break;
    case "success":
      bgColor = "bg-successGreen";
      // icon = <CgCheckO />;
      break;
    default:
      bgColor = "bg-infoBlue";
  }

  return (
    <div
      className={`flex px-3 py-3 mb-4 text-sm text-whitegrey text-center rounded-lg ${bgColor}`}
      role="alert">
      <p className={`font-medium ${textTransform} flex m-auto`}>
        {/* <span className="flex-shrink-0 inline w-5 h-5 mr-2">{icon} </span> */}
        {text}
      </p>
    </div>
  );
}

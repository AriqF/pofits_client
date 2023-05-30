import { MdWarningAmber } from "react-icons/md";

export default function WarningBadge() {
  return (
    <span className=" text-moneyDanger text-lg font-semibold inline-flex items-center p-1 rounded-full">
      <MdWarningAmber />
      <span className="sr-only">Aware</span>
    </span>
  );
}

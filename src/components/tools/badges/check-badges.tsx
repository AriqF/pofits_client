import { MdDone } from "react-icons/md";

export default function CheckBadge() {
  return (
    <span className=" text-blue text-lg font-semibold inline-flex items-center p-1 rounded-full">
      <MdDone />
      <span className="sr-only">Tercapai</span>
    </span>
  );
}

import { currencyFormatter, numFormatter } from "@/utils/helper";
import React from "react";
import { IconType } from "react-icons";
import { MdTrendingUp } from "react-icons/md";

interface Props {
  icon: IconType;
  iconColor: string;
  iconBgColor: string;
  title: string;
  amount: number;
}

export default function ReportCard(props: Props) {
  return (
    <div className="rounded-md border py-4 px-3.5 flex flex-row gap-x-3 shadow-sm">
      <div className="flex">
        <div className={`flex rounded-md p-2 ${props.iconBgColor}`}>
          {React.createElement(props.icon, {
            className: `text-3xl m-auto ${props.iconColor} font-bold`,
          })}
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-base my-auto text-gray-700">{props.title}</p>
        <h5 className={"text-lg my-auto font-bold " + (props.amount < 0 ? "text-moneyDanger" : "")}>
          {currencyFormatter(props.amount)}
        </h5>
      </div>
    </div>
  );
}

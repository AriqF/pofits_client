import { UserPath } from "@/utils/global/route-path";
import { numFormatter } from "@/utils/helper";
import moment from "moment";
import Image from "next/image";
import { MouseEventHandler } from "react";
import { MdChevronRight, MdDelete, MdEditNote } from "react-icons/md";
import ProgressBar from "../bar/progress-bar";
import Container from "../container";
import LinkContainer from "../container/LinkContainer";

interface Props {
  title: string;
  icon: string;
  budget: string;
  usedBudget: number;
  id: number | string;
  date: Date;
  percentage: number;
  remaining: number;
  deleteFunc?: MouseEventHandler<HTMLAnchorElement>;
}

export default function BudgetCardDetail(props: Props) {
  const { budget } = props;
  let percentStr = props.percentage.toFixed(0);
  let startDate = moment(props.date).startOf("month").format("D MMM YY");
  let endDate = moment(props.date).endOf("month").format("D MMM YY");

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 80) {
      return "bg-moneyDanger";
    }
    return "bg-blue";
  };

  return (
    <Container className="p-4 drop-shadow-sm hover:drop-shadow-md transition-all duration-500 text-md border-2">
      <div className="inline-flex justify-between">
        <div className="flex flex-col gap-x-4">
          {/* <p className="text-mute text-base">
          {startDate} - {endDate}
        </p> */}
          <p className="text-sm">Anggaran</p>
          <h5 className="text-lg text-blue">Rp{numFormatter(props.budget)}</h5>
        </div>
        <div className="inline-flex space-x-2 text-gray-600">
          <a
            href={UserPath.BUDGET_EDIT + props.id}
            className="rounded-full p-2 bg-gray-300 my-auto hover:bg-gray-200 transition-all duration-200">
            <MdEditNote className="text-lg my-auto" />
          </a>
          <a
            onClick={props.deleteFunc}
            className="cursor-pointer rounded-full p-2 bg-gray-300 my-auto hover:bg-gray-200 transition-all duration-200">
            <MdDelete className="text-lg my-auto" />
          </a>
        </div>
      </div>
      <hr className="h-1 w-full text-mute" />
      <div className="text-sm md:text-base font-medium text-center">
        <div className="flex justify-between mb-1">
          <div className="grid grid-rows-2 gap-y-2">
            <span>Terpakai</span>
            <span className=" text-blue">Rp{numFormatter(props.usedBudget)}</span>
          </div>
          <div className="grid grid-rows-2 gap-y-2">
            <span className="row-start-2 ">{percentStr}%</span>
          </div>
          <div className="grid grid-rows-2 gap-y-2">
            <span>Tersisa</span>
            <span className="text-blue ">Rp{numFormatter(props.remaining)}</span>
          </div>
        </div>
        <ProgressBar
          bgColor={getProgressBarColor(props.percentage)}
          textColor={"text-white"}
          percentage={props.percentage}
        />
      </div>
    </Container>
  );
}

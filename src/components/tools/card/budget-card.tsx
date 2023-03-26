import { UserPath } from "@/utils/global/route-path";
import { numFormatter } from "@/utils/helper";
import moment from "moment";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";
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
}

export default function BudgetCard(props: Props) {
  const { icon, title, budget, usedBudget, id } = props;
  let countPercent = (usedBudget / +budget) * 100;
  let percentage = countPercent.toFixed(0);
  let startDate = moment(props.date).startOf("month").format("D MMMM YYYY");
  let endDate = moment(props.date).endOf("month").format("D MMMM YYYY");

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 80) {
      return "bg-moneyDanger";
    }
    return "bg-blue";
  };

  return (
    <LinkContainer
      className="drop-shadow-sm hover:drop-shadow-md transition-all duration-500 text-md border-2"
      linkTo={UserPath.BUDGET + id}>
      <div className="flex flex-row gap-x-4">
        <Image src={`/assets/icons/svg/${icon}.svg`} alt="icon-category" width={40} height={40} />
        <h4 className="my-auto text-lg">{title}</h4>
        <MdChevronRight className="text-2xl my-auto " />
      </div>
      <p className="text-mute text-sm">
        {startDate} - {endDate}
      </p>
      <hr className="h-1 w-full text-mute" />
      <div className="text-sm md:text-base font-medium text-center">
        <div className="flex justify-between mb-1">
          <div className="grid grid-rows-2 gap-y-2">
            <span>Anggaran</span>
            <span className=" text-blue">Rp{numFormatter(budget)}</span>
          </div>
          <div className="grid grid-rows-2 gap-y-2">
            <span className="row-start-2 ">{percentage}%</span>
          </div>
          <div className="grid grid-rows-2 gap-y-2">
            <span>Tersisa</span>
            <span className="text-blue ">Rp{numFormatter(usedBudget)}</span>
          </div>
        </div>
        <ProgressBar
          bgColor={getProgressBarColor(countPercent)}
          textColor={"text-white"}
          percentage={countPercent > 100 ? 100 : percentage}
        />
      </div>
    </LinkContainer>
  );
}

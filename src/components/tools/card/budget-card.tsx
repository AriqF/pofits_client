import { UserPath } from "@/utils/global/route-path";
import { currencyFormatter } from "@/utils/helper";
import moment from "moment";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";
import LinkContainer from "../container/LinkContainer";
import WarningBadge from "../badges/warning-badge";
import BudgetItemBadge from "../badges/budget-item-badge";

interface Props {
  title: string;
  icon: string;
  budget: number;
  usedBudget: number;
  id: number | string;
  date: Date;
  percentage: number;
  remaining: number;
}

export default function BudgetCard(props: Props) {
  const { icon, title, budget, id } = props;
  // let countPercent = (usedBudget / +budget) * 100;
  let percentStr = props.percentage.toFixed(0);
  let startDate = moment(props.date).startOf("month").format("D MMMM YYYY");
  let endDate = moment(props.date).endOf("month").format("D MMMM YYYY");

  return (
    <LinkContainer
      className="drop-shadow-sm hover:drop-shadow-md transition-all duration-500 text-md border-2"
      linkTo={UserPath.BUDGET + id}>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-x-4">
          <Image src={`/assets/icons/svg/${icon}.svg`} alt="icon-category" width={40} height={40} />
          <div className="flex flex-col">
            <div className="flex flex-col lg:flex-row gap-x-2">
              <h4 className="my-auto text-lg">{title}</h4>
              {props.percentage >= 85 && props.percentage < 100 ? (
                <BudgetItemBadge text={"Anggaran Hampir Habis"} bgColor={"bg-moneyWarn"} />
              ) : props.percentage >= 100 ? (
                <BudgetItemBadge text={"Anggaran Melewati Batas"} bgColor={"bg-moneyDanger"} />
              ) : (
                ""
              )}
            </div>
            <p className="text-blue text-sm my-auto">
              <span
                className={
                  props.percentage >= 85 && props.percentage < 100
                    ? "text-moneyDanger"
                    : props.percentage >= 100
                    ? "text-moneyDanger"
                    : ""
                }>
                {currencyFormatter(props.usedBudget)}
              </span>{" "}
              / {currencyFormatter(props.budget)}
            </p>
          </div>
        </div>
        <MdChevronRight className="text-2xl my-auto " />
      </div>

      {/* <hr className="h-1 w-full text-mute" /> */}
      {/* <div className="text-sm md:text-base font-medium text-center">
        <div className="flex justify-between mb-1">
          <div className="grid grid-rows-2 gap-y-2">
            <span>Anggaran</span>
            <span className=" text-blue">Rp{numFormatter(budget)}</span>
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
          percentage={props.percentage > 100 ? 100 : props.percentage}
        />
      </div> */}
    </LinkContainer>
  );
}

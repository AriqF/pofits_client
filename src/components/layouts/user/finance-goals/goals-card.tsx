import ProgressBar from "@/components/tools/bar/progress-bar";
import { UserPath } from "@/utils/global/route-path";
import { currencyFormatter, getGoalSeverityStr, numFormatter } from "@/utils/helper";
import moment from "moment";

interface Props {
  dataId: number;
  title: string;
  timebound: Date;
  severity: number;
  amountTarget: number;
  amountReached: number;
  percentage: number;
  isAchieved: boolean;
}

const getGoalSeverityBg = (severity: number): string => {
  switch (severity) {
    case 0:
      return "bg-moneySafe";
    case 1:
      return "bg-moneyWarn";
    case 2:
      return "bg-moneyDanger";
    default:
      return "bg-moneySafe";
  }
};

export default function GoalCard(props: Props) {
  return (
    <a
      className="rounded-md border shadow-md p-3 flex flex-col gap-y-3 hover:shadow-lg transition-all ease-in duration-150 cursor-pointer select-none"
      href={UserPath.FINANCE_GOAL_DETAIL + props.dataId}>
      <div id="goal-card-header" className="space-y-1">
        <div className="flex justify-between">
          <p className="text-sm text-gray-600 my-auto">
            {props?.timebound ? moment(props.timebound).format("DD MMMM YYYY") : "Fleksibel"}
          </p>
          {props.isAchieved ? (
            <p className={`text-xs text-white my-auto px-2 py-1 bg-successGreen rounded-sm`}>
              {"Tercapai"}
            </p>
          ) : (
            <p
              className={`text-xs text-white my-auto px-2 py-1 ${getGoalSeverityBg(
                props.severity
              )} rounded-sm`}>
              {getGoalSeverityStr(props.severity)}
            </p>
          )}
        </div>
        <h4 className="text-lg">{props.title}</h4>
      </div>

      <div className="text-sm md:text-base font-medium text-center" id="goal-progress-bar">
        <div className="flex justify-between mb-1 text-sm">
          <div className="grid grid-rows-2 gap-y-2">
            <span>Tercapai</span>
            <span className=" text-blue">{currencyFormatter(props.amountReached)}</span>
          </div>
          <div className="grid grid-rows-2 gap-y-2">
            <span className="row-start-2 ">{props.percentage}%</span>
          </div>
          <div className="grid grid-rows-2 gap-y-2">
            <span>Target</span>
            <span className="text-blue ">{currencyFormatter(props.amountTarget)}</span>
          </div>
        </div>
        <ProgressBar bgColor={"bg-blue"} textColor={"text-white"} percentage={props.percentage} />
      </div>
    </a>
  );
}

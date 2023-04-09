import moment from "moment";
import Container from "../../container";
import Image from "next/image";
import { numFormatter } from "@/utils/helper";
import { UserPath } from "@/utils/global/route-path";

interface Props {
  title: string;
  wallet: string;
  icon: string;
  date: Date;
  amount: number;
  dataId: number | string;
  type: "income" | "expense";
}

export default function TransactionListItem(props: Props) {
  return (
    <a
      href={
        (props.type === "expense"
          ? UserPath.TRANSACTION_EXPENSE_DETAIL
          : UserPath.TRANSACTION_INCOME_DETAIL) + props.dataId
      }
      className="flex flex-row justify-between p-3 border-b border-gray-300 hover:shadow-lg transition-all duration-300">
      <div id="trans-left" className="flex flex-row gap-x-4">
        <div className="rounded-full p-2 bg-gray-300 my-auto">
          <Image
            src={`/assets/icons/svg/${props.icon}.svg`}
            alt="icon-category"
            width={35}
            height={35}
          />
        </div>
        <div className="my-auto text-left">
          <h4 className="my-auto text-base">{props.title}</h4>
          <p className="text-sm text-mute ">{props.wallet}</p>
        </div>
      </div>
      <div className="trans-right flex-col my-auto text-right">
        <p className="text-sm text-mute ">{moment(props.date).format("DD MMM YYYY")}</p>
        <p
          className={
            (props.type == "income" ? "text-moneySafe" : "text-moneyDanger") + " text-base"
          }>
          {props.type == "income" ? "+" : "-"} Rp {numFormatter(props.amount)}
        </p>
      </div>
    </a>
  );
}

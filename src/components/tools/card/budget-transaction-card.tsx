import { UserPath } from "@/utils/global/route-path";
import { numFormatter } from "@/utils/helper";
import moment from "moment";
import Image from "next/image";

interface Props {
  title: string;
  wallet: string;
  icon: string;
  date: Date;
  amount: number;
  dataId: number | string;
}

export default function BudgetTransactionCard(props: Props) {
  return (
    <a
      className="flex flex-row justify-between p-3 border-b border-gray-300 hover:shadow-lg transition-all duration-300"
      href={UserPath.TRANSACTION_EXPENSE_DETAIL + props.dataId}>
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
        <p className="text-moneyDanger text-base">- Rp {numFormatter(props.amount)}</p>
      </div>
    </a>
  );
}

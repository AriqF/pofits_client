import { UserPath } from "@/utils/global/route-path";
import { numFormatter } from "@/utils/helper";
import moment from "moment";
import Image from "next/image";

interface Props {
  dataId: number | string;
  title: string;
  wallet: string;
  icon: string;
  date: Date;
  amount: number;
}

export default function IncomeTargetTransCard(props: Props) {
  return (
    <a
      className="flex flex-row justify-between p-3 border-b border-gray-300 hover:shadow-lg transition-all duration-300"
      href={UserPath.TRANSACTION_INCOME_DETAIL + props.dataId}>
      <div id="trans-left" className="flex flex-row gap-x-4 my-auto">
        <div className="rounded-full p-2 bg-gray-300 my-auto">
          <Image
            src={`/assets/icons/svg/${props.icon}.svg`}
            alt="icon-category"
            width={35}
            height={35}
          />
        </div>
        <div className="my-auto text-left gap-2">
          <h4 className="my-auto text-base text-ellipsis">{props.title}</h4>
          <p className="text-sm text-mute ">{props.wallet}</p>
        </div>
      </div>
      <div className="flex-col my-auto text-right gap-2">
        <p className="text-sm text-mute ">{moment(props.date).format("DD MMM YYYY")}</p>
        <p className="text-moneySafe text-base">+ Rp {numFormatter(props.amount)}</p>
      </div>
    </a>
  );
}

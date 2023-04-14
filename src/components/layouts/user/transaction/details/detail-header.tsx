import { numFormatter } from "@/utils/helper";
import Image from "next/image";

interface Props {
  type: "income" | "expense";
  amount: number;
  header: string;
  icon: string;
}

export default function TransactionDetailHeader(props: Props) {
  return (
    <div id="detail-header" className="flex flex-col md:flex-row gap-3">
      <div id="image-header" className="rounded-full bg-gray-200 p-1 md:m-0 m-auto">
        <Image
          src={`/assets/icons/svg/${props.icon}.svg`}
          alt="icon-category"
          width={70}
          height={70}
        />
      </div>
      <div className="flex flex-col text-center md:text-left my-auto">
        <h3 className="text-lg text-center font-semibold">{props.header}</h3>
        <h5
          className={
            "text-base " + (props.type === "expense" ? "text-moneyDanger" : "text-moneySafe")
          }>
          {props.type === "expense" ? "-" : "+"} Rp {numFormatter(props.amount)}
        </h5>
      </div>
    </div>
  );
}

import { numFormatter } from "@/utils/helper";
import Image from "next/image";

interface Props {
  category: string;
  amount: number;
  percentage: number;
  icon: string;
}

export default function ReportTransactionItem(props: Props) {
  return (
    <div className="p-2.5 border-b flex flex-row justify-between w-full">
      <div className="flex flex-row gap-4">
        <div className={`flex rounded-full p-1 bg-gray-300 my-auto`}>
          <Image
            src={`/assets/icons/svg/${props.icon}.svg`}
            alt="icon-category"
            width={40}
            height={40}
          />
        </div>
        <div className="my-auto">
          <p className="text-base font-bold">{props.category}</p>
          <p className="text-base">Rp {numFormatter(props.amount)}</p>
        </div>
      </div>
      <div className="my-auto">
        <p className="text-base text-infoBlue">{props.percentage}%</p>
      </div>
    </div>
  );
}

{
  /* <div className="rounded-md border p-2.5 shadow-md flex flex-row justify-between w-full">
<div className="flex flex-row gap-4">
  <div className={`flex rounded-full p-1 bg-gray-300 my-auto`}>
    <Image src={`/assets/icons/svg/car.svg`} alt="icon-category" width={40} height={40} />
  </div>
  <div className="my-auto">
    <p className="text-base font-bold">Bensin</p>
    <p className="text-base">Rp {numFormatter(2500000)}</p>
  </div>
</div>
<div className="my-auto">
  <p className="text-base text-infoBlue">95%</p>
</div>
</div> */
}

import { numFormatter } from "@/utils/helper";

interface Props {
  bgColor: string;
  textColor: string;
  percentage: number | string;
}

export default function ProgressBar(props: Props) {
  const { bgColor, textColor, percentage } = props;
  let percentageNum: number = Number(percentage);
  if (percentageNum > 100) {
    percentageNum = 100;
  }

  return (
    <div className="text-center">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={bgColor + " h-2.5 rounded-full"}
          style={{ width: `${percentageNum}%` }}></div>
      </div>
    </div>
  );
}

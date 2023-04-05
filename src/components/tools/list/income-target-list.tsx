import { UserPath } from "@/utils/global/route-path";
import { numFormatter } from "@/utils/helper";
import moment from "moment";
import Image from "next/image";
import { MdChevronRight } from "react-icons/md";
import ProgressBar from "../bar/progress-bar";
import Container from "../container";
import LinkContainer from "../container/LinkContainer";
import CheckBadge from "../badges/check-badges";

interface Props {
  title: string;
  icon: string;
  targetAmount: number;
  id: number | string;
  date: Date;
  isAchieved: boolean;
}

export default function IncomeTargetList(props: Props) {
  const { icon, title, id } = props;
  //   let percentStr = props.percentage.toFixed(0);
  let startDate = moment(props.date).startOf("month").format("D MMMM YYYY");
  let endDate = moment(props.date).endOf("month").format("D MMMM YYYY");

  return (
    <LinkContainer
      className="drop-shadow-sm hover:drop-shadow-md transition-all duration-500 text-md border-2"
      linkTo={UserPath.ESTIMATION + id}>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-x-4">
          <Image src={`/assets/icons/svg/${icon}.svg`} alt="icon-category" width={40} height={40} />
          <div className="grid grid-cols-1">
            <div className="inline-flex gap-x-2">
              <h4 className="my-auto text-lg">{title}</h4>
              {props.isAchieved ? <CheckBadge /> : ""}
            </div>
            <p className="text-mute text-sm my-auto">
              {startDate} - {endDate}
            </p>
          </div>
        </div>
        <MdChevronRight className="text-2xl my-auto " />
      </div>
    </LinkContainer>
  );
}

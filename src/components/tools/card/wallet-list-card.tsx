import { numFormatter } from "@/utils/helper";

interface CardProps {
  color?: string;
  textColor?: string;
  textHeader: string;
  amount: number;
  lastUpdated: string | Date;
  linkToId: string | number;
}

export default function WalletListItem(props: CardProps) {
  return (
    <a
      className="block max-w-full px-6 py-7 bg-white hover:bg-hovwhite drop-shadow-lg rounded-md"
      href={"/me/wallets/" + props.linkToId}>
      <div className="grid gap-x-4 lg:grid-cols-1 md:grid-cols-1 m-auto">
        <h5 className="text-xl font-bold tracking-tight text-dark text-center">
          {props.textHeader}
        </h5>
        {/* <div className="hidden md:flex md:text-center lg:text-right text-md md:text-xl text-palepurple font-bold gap-x-1 col-end-7 col-span-2">
          <p>Rp {numFormatter(props.amount)}</p>
        </div> */}
      </div>
    </a>
  );
}

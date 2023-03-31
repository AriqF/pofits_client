import Image from "next/image";
import { ReactNode } from "react";

interface Props {
  dataPath: string;
  dataId?: string | number;
  icon: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function DataList(props: Props) {
  return (
    <a
      className="inline-flex justify-between max-w-full px-3 md:py-2 py-4 bg-white hover:bg-gray-100 shadow-sm border-t border-gray-200 rounded-sm"
      href={props.dataPath + props.dataId}>
      <div id="card-left" className="flex flex-row gap-x-2">
        <div className="bg-gray-300 rounded-full p-2">
          <Image
            src={`/assets/icons/svg/${props.icon}.svg`}
            alt="wallet-icon"
            height={30}
            width={30}
            className="my-auto"
          />
        </div>
        <div className="flex flex-col text-gray-800 capitalize">
          <h4 className="my-auto text-base font-semibold">{props.title}</h4>
          {props.subtitle ? <p className="text-sm text-mute">{props.subtitle}</p> : ""}
        </div>
      </div>
      <div id="card-right" className="inline-flex space-x-2 text-white">
        {props.children}
      </div>
    </a>
  );
}

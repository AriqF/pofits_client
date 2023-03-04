interface Props {
  baseUrl: string;
  id: number | string;
  header: string;
  subHeader?: string;
  shortDesc?: string;
}

export default function BaseList(props: Props) {
  return (
    <a
      href={props.baseUrl + "/" + props.id}
      className="grid-flow-row grid-cols-1 hover:bg-hovwhite cursor-pointer drop-shadow-md px-3 py-4">
      <h5 className="text-lg capitalize font-base">
        {props.header}{" "}
        {props.subHeader ? <span className="text-gray-400 text-sm">- {props.subHeader}</span> : ""}
      </h5>
      <span className="text-base text-gray-600">{props.shortDesc}</span>
    </a>
  );
}

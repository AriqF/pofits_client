interface Props {
  baseUrl: string;
  id: number | string;
  header: string;
  subHeader?: string;
  shortDesc?: string;
  className?: string;
}

export default function BaseList(props: Props) {
  return (
    <a
      href={props.baseUrl + "/" + props.id}
      className={
        "group grid-flow-row grid-cols-1 hover:border hover:bg-palepurple hover:text-white rounded-md cursor-pointer drop-shadow-md px-3 py-4  " +
        " " +
        props.className
      }>
      <h5 className="text-lg capitalize font-base group-hover:text-white text-gray-900">
        {props.header}{" "}
        {props.subHeader ? (
          <span className="text-sm text-gray-500 group-hover:text-white/[0.7]">
            - {props.subHeader}
          </span>
        ) : (
          ""
        )}
      </h5>
      <span className="text-base group-hover:text-white/[0.9] text-gray-700 ">
        {props.shortDesc}
      </span>
    </a>
  );
}

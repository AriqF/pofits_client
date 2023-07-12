interface Props {
  text: string;
  bgColor: string;
}

export default function BudgetItemBadge(props: Props) {
  return (
    <span className={props.bgColor + " text-white text-xs inline-flex items-center p-1 rounded-sm"}>
      {props.text}
      <span className="sr-only">Aware</span>
    </span>
  );
}

interface Props {
  textLeft: string;
  textRight: string;
}

export function TransactionDetailItem(props: Props) {
  return (
    <div className="border-b border-gray-200 py-3 justify-between flex flex-row">
      <p className="text-base text-mute text-left">{props.textLeft}</p>
      <p className="text-base text-palepurple font-semibold text-right">{props.textRight}</p>
    </div>
  );
}

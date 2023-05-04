interface Props {
  name: string;
  round: boolean;
  className?: string;
  bgColor: string;
}

export default function Avatar(props: Props) {
  return (
    <div
      className={
        (props.round ? "rounded-full" : "rounded-lg") + ` ${props.bgColor} px-3 py-2.5 no-select`
      }>
      <h1 className="text-sm text-white tracking-wide ">{getInitials(props.name)}</h1>
    </div>
  );
}

function getInitials(nameStr: string) {
  var names: string[] = nameStr.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

interface OptionProps {
  text: string;
  linkTo: string;
}

export default function MenuOption(props: OptionProps) {
  return (
    <a
      href={props.linkTo}
      className="block py-2 pl-3 pr-4 hover:text-hovwhite bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
      aria-current="page">
      {props.text}
    </a>
  );
}

import { MouseEventHandler } from "react";

interface Props {
  linkTo?: string;
  text: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
}

export default function TopDropdownOption(props: Props) {
  return (
    <li>
      <a
        onClick={props.onClick}
        href={props.linkTo}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer "
        role="menuitem">
        {props.text}
      </a>
    </li>
  );
}

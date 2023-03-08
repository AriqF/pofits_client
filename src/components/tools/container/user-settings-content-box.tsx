import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function UserSettingContentBox(props: Props) {
  return (
    <div
      id={props.id}
      className={"bg-transparent border-gray-500 rounded-md p-6 shadow-lg " + props.className}>
      {props.children}
    </div>
  );
}

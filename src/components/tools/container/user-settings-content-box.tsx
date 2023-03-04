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
      className={"bg-white border-gray-500 rounded-sm p-6 shadow-md " + props.className}>
      {props.children}
    </div>
  );
}

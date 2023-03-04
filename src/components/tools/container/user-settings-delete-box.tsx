import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEventHandler, ReactNode } from "react";
import { BiTrash } from "react-icons/bi";
import UserSettingContentBox from "./user-settings-content-box";

interface Props {
  children: ReactNode;
  headerText: string;
  headerDesc: string;
  className?: string;
}

export default function UserSettingsDeleteBox(props: Props) {
  return (
    <UserSettingContentBox className={"flex flex-row mt-5 space-x-5" + " " + props.className}>
      <div id="delete-header" className="space-y-1">
        <h3 className="text-2xl font-semibold">{props.headerText}</h3>
        <p className="text-sm text-gray-600">{props.headerDesc}</p>
      </div>
      {props.children}
    </UserSettingContentBox>
  );
}

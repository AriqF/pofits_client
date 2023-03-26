import React from "react";
import { ComponentProps, FC, MouseEventHandler } from "react";
import { IconType } from "react-icons";

interface Props {
  text: string;
  linkTo?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  icon?: IconType;
  badgeText?: string;
  dropdownItem?: boolean;
}

const baseItemStyle =
  "group flex items-center hover:bg-white hover:text-gray-900 rounded-lg text-base font-normal p-2 rounded-lg transition duration-100  ";

export default function SidebarItem(props: Props) {
  return (
    <li>
      <a
        href={props.linkTo}
        onClick={props.onClick}
        className={
          baseItemStyle + (props.dropdownItem ? " w-full pl-9 group " : "flex items-center     ")
        }>
        {props.icon ? React.createElement(props?.icon, { className: "text-2xl" }) : ""}
        <span className="flex-1 ml-3 whitespace-nowrap">{props.text}</span>
        {props.badgeText ? (
          <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium bg-[#4d6dcb] rounded-full group-hover:text-white ">
            {props.badgeText}
          </span>
        ) : (
          ""
        )}
      </a>
    </li>
  );
}

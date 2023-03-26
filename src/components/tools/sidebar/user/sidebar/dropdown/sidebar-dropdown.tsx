import React, { useState } from "react";
import { MouseEventHandler, ReactNode } from "react";
import { IconType } from "react-icons";
import { MdAssignment, MdKeyboardArrowDown } from "react-icons/md";

interface Props {
  text: string;
  linkTo?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  icon?: IconType;
  badgeText?: string;
  children: ReactNode;
}

export default function SidebarItemDropdown(props: Props) {
  return (
    <li>
      <button
        type="button"
        className="peer group flex items-center w-full hover:bg-white hover:text-gray-900 text-base font-normal p-2 rounded-lg transition duration-100  "
        aria-controls="dropdown"
        data-collapse-toggle="dropdown">
        {props.icon ? React.createElement(props?.icon, { className: "text-2xl" }) : ""}
        <span className="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item="true">
          {/* default => sidebar-toggle-item */}
          {props.text}
        </span>
        <MdKeyboardArrowDown
          className={
            "text-2xl transition-all duration-500 peer-aria-[controls=dropdown]:rotate-180"
          }
        />
      </button>
      <ul id="dropdown" className="hidden py-1 space-y-1 transition-all duration-500">
        {props.children}
      </ul>
    </li>
  );
}

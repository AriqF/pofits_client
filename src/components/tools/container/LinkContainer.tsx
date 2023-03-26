import React, { ReactNode } from "react";
import { HTMLAttributes } from "react";

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
  linkTo?: string;
}

export default function LinkContainer(props: Props) {
  const { id, className, children, linkTo } = props;
  return (
    <a
      href={linkTo}
      id={id}
      className={
        "bg-white rounded-md md:shadow-md p-6 grid grid-flow-row space-y-3 text-darktext " +
        className
      }>
      {children}
    </a>
  );
}

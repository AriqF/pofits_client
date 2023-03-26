import React, { ReactNode } from "react";
import { HTMLAttributes } from "react";

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function Container(props: Props) {
  const { id, className, children } = props;
  return (
    <div
      id={id}
      className={className + " " + "rounded-md md:p-6 grid grid-flow-row space-y-3 text-darktext"}>
      {children}
    </div>
  );
}

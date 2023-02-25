import React from "react";
import { HTMLAttributes } from "react";

interface ContainerProps {
  className: string;
}

export const Container: React.FC<ContainerProps> = (props) => (
  <div className="bg-whitegrey border-gray-200 rounded-md p-6"></div>
);

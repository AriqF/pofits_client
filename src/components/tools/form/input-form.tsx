import { ReactNode } from "react";
import { FieldErrorsImpl } from "react-hook-form";
import FormHelper from "../alerts/form-helper";

interface Props {
  label: string;
  id: string;
  errors?: string;
  children: ReactNode;
  className?: string;
}

export default function InputForm(props: Props) {
  return (
    <div className={props.className}>
      <label htmlFor={props.id} className="block mb-2 text-md font-medium text-gray-900">
        {props.label}
      </label>
      {props.children}
      {props.errors && <FormHelper textColor="danger" text={props.errors} />}
    </div>
  );
}

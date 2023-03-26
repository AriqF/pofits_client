import { baseFormStyle } from "@/utils/global/style";
import { HTMLInputTypeAttribute } from "react";
import { FieldErrorsImpl, UseFormRegister } from "react-hook-form";
import { Interface } from "readline";
import FormHelper from "../alerts/form-helper";

interface Props {
  register: any;
  errors?: Partial<FieldErrorsImpl>;
  errorMessage?: string;
  label: string;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  id: string;
}

export default function BaseInput(props: Props) {
  return (
    <div>
      <label htmlFor={props.id} className="block mb-2 text-md font-medium text-gray-900">
        {props.label}
      </label>
      <input
        {...props.register}
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        className={baseFormStyle + (props.errors ? "border-errorRed focus:border-errorRed" : "")}
      />
      {props.errors && <FormHelper textColor="danger" text={props.errorMessage} />}
    </div>
  );
}

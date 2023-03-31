import { UseFormRegister } from "react-hook-form";

interface Props {
  id: string;
  register?: UseFormRegister<any>;
  text: string;
  labelClassName?: string;
  inputClassName?: string;
}
export default function CheckBox(props: Props) {
  return (
    <div className="flex items-center">
      <input
        id={props.id}
        type="checkbox"
        {...props.register}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
      />
      <label htmlFor={props.id} className="ml-2 text-sm font-medium text-gray-900">
        {props.text}
      </label>
    </div>
  );
}

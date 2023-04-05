import { SweetAlertOptions } from "sweetalert2"

export const baseAlertStyle: Partial<SweetAlertOptions> = {
    cancelButtonColor: "#cb1a52",
    confirmButtonColor: "#8c4dcb",
}

export const deleteAlertStyle: Partial<SweetAlertOptions> = {
    confirmButtonColor: "#cb1a52",
    cancelButtonColor: "#8c4dcb",
}

export const deleteButtonStyle: string = "col-span-1 col-start-4 col-end-4 ml-auto my-auto text-white bg-errorRed hover:bg-hovErrorRed focus:ring-hovErrorRed text-center " +
    "font-semibold focus:ring-1 focus:outline-none rounded-md text-sm h-1/4 py-3 w-1/4 md:w-3/4 lg:w-1/4 max-[350px]:w-1/4 max-[350px]:mr-auto " +
    "max-[350px]:ml-0";

export const formStyle: string = "bg-gray-50 border border-gray-300 text-gray-900 text-md lock w-full p-2.5 hover:border-blue "
export const baseFormStyle: string = formStyle + " rounded-md "
export const selectFormStyle: string = "p-1 " + formStyle + " inline-flex rounded-md";
export const currencyFormStyle: string = formStyle + " rounded-r-md  ";
export const checkBoxStyle: string = "w-4 h-4 text-blue bg-gray-100 border-gray-500 rounded cursor-pointer";

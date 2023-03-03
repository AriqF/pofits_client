import { AxiosHeaders } from "axios";
import { SweetAlertOptions } from "sweetalert2";


export const baseUrl = process.env.NEXT_PUBLIC_URL
export type AlertType = "info" | "danger" | "success" | "warning";

export type ServerResponse = {
    config: Object | any | undefined,
    headers: AxiosHeaders,
    request: XMLHttpRequest | undefined,
    data: Object | Object[] | undefined,
    statusText: string,
    status: number | string;
}

export const baseAlertStyle: Partial<SweetAlertOptions> = {
    cancelButtonColor: "#cb1a52",
    confirmButtonColor: "#8c4dcb",
}

export const deleteAlertStyle: Partial<SweetAlertOptions> = {
    confirmButtonColor: "#cb1a52",
    cancelButtonColor: "#8c4dcb",
}
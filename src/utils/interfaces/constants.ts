import { AxiosHeaders } from "axios";
import { SweetAlertOptions } from "sweetalert2";

export const baseUrl = process.env.NEXT_PUBLIC_URL;
export const protectedRoutes: string[] = ["/me/:path*", "/admin/:path*"];
export const authRoutes: string[] = ["/auth"]

export type AlertType = "default" | "info" | "danger" | "success" | "warning";

export type ServerResponse = {
    config: Object | any | undefined,
    headers: AxiosHeaders,
    request: XMLHttpRequest | undefined,
    data: Object | Object[] | undefined,
    statusText: string,
    status: number | string;
}


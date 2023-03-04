import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
import Router from 'next/router'

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_URL })

export const requestAxios = (options: AxiosRequestConfig) => {
    client.defaults.headers.common.Authorization = `Bearer ${Cookies.get('accessToken')}`
    const onSuccess = (response: any) => response;
    const onError = (error: any) => {
        return error
    }

    return client(options)
}


export const logoutHandler = () => {
    Cookies.remove("accessToken");
    Router.replace("/auth/login");
};
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
import Router from 'next/router'
import { JWTServer } from '../interfaces/server-props';

const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_URL })

export const requestAxios = (options: AxiosRequestConfig) => {
    if (!Cookies.get('accessToken')) {
        if (!Cookies.get("refreshToken")) {
            logoutHandler()
        }
        requestRefreshToken()
    }
    client.defaults.headers.common.Authorization = `Bearer ${Cookies.get('accessToken')}`
    const onSuccess = (response: any) => response;
    const onError = (error: any) => {
        return error
    }

    return client(options)
}


export const requestRefreshToken = () => {
    if (!Cookies.get("refreshToken")) {
        return Router.push("/auth/login")
    }
    const refreshToken: string | undefined = Cookies.get("refreshToken")
    if (typeof refreshToken === undefined) throw new Error("Refresh token undefined")

    if (!Cookies.get("accessToken") && refreshToken) {
        requestNewToken(refreshToken)
        return
    }

    let currAccessToken: string | undefined = Cookies.get("accessToken")
    if (typeof currAccessToken == undefined) return

    try {
        const currDecoded: JWTServer = jwt_decode(currAccessToken as string);
        if (currDecoded.exp * 1000 === Date.now() - 900) {
            requestNewToken(refreshToken)
        }
        return
    } catch (error) {
        console.log(error)
        alert("error refresh token")
    }
}


export const requestNewToken = (refreshToken: string | undefined) => {
    axios(`${process.env.NEXT_PUBLIC_URL}/auth/refreshtoken`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + refreshToken
        }
    })
        .then(
            res => {
                console.log("request refresh token")
                let token: string = res.data.accessToken;
                let decoded: JWTServer = jwt_decode(token);
                // const oneHundredMinutes = new Date(new Date().getTime() + 100 * 60 * 1000);
                Cookies.set('accessToken', res.data.accessToken, { expires: decoded.exp * 1000 })
                Router.reload()
                // return res.data.accessToken
            }
        )
        .catch(
            err => {
                console.log(err)
                if (err.code == 401) {
                    Cookies.remove('accessToken')
                    Cookies.remove('refreshToken')
                    return Router.push('/auth/login')
                } else {
                    return Router.push('/auth/login')
                }
            }
        )
}

export const logoutHandler = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Router.replace("/auth/login");
};
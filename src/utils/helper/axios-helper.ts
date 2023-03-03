import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie'
import Router from 'next/router'


const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_URL })

export const requestAxios = (options: AxiosRequestConfig) => {
    // setInterval(()=> {
    //     refreshToken(Cookies.get('refreshToken'))
    // },7000)
    if (!Cookies.get('accessToken')) {
        requestRefreshToken(Cookies.get('refreshToken'))
    }

    client.defaults.headers.common.Authorization = `Bearer ${Cookies.get('accessToken')}`
    // console.log(Cookies.get('accessToken'))
    const onSuccess = (response: any) => response;
    const onError = (error: any) => {
        return error
    }

    return client(options)
}

export const requestRefreshToken = (refreshToken: string | undefined) => {
    if (typeof refreshToken === undefined) throw new Error("Undefined refresh token")
    console.log('requested to refresh token');
    axios(`${process.env.NEXT_PUBLIC_URL}/auth/refreshtoken`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + refreshToken
        }
    })
        .then(
            res => {
                const oneHundredMinutes = new Date(new Date().getTime() + 100 * 60 * 1000);
                Cookies.set('accessToken', res.data.accessToken, { expires: oneHundredMinutes })
                Router.reload()
                // return res.data.accessToken
            }
        )
        .catch(
            err => {
                console.log(err)
                if (err.response.status == 401) {
                    //Session habis
                    Cookies.remove('accessToken')
                    Cookies.remove('refreshToken')
                    return Router.push('/auth/login')
                }
            }
        )
}
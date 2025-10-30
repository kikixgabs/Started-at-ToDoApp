import {Auth, loginResponse } from "../../../models/auth-model"

export const AuthAdapter = (loginData: loginResponse): Auth => {
    return { token: loginData.token}
}
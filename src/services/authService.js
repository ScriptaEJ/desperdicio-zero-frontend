import api from './api.js'

export async function loginRequest(email, senha){
    const response = await api.post(`/login`, {email, senha})

    return response.data
}

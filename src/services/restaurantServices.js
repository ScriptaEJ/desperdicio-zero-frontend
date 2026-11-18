import api from './api'

export async function createRestaurant(payload) {
  const response = await api.post('/restaurantes', payload)
  return response.data
}
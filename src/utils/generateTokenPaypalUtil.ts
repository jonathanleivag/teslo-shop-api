import axios from 'axios'
import { PAYPAL_CLIENT_ID, PAYPAL_OAUTH_URL, PAYPAL_SECRET_ID } from './'

export const generateTokenPaypal = async (): Promise<string> => {
  let token: string = ''
  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_ID}`,
    'utf-8'
  ).toString('base64')
  const body = new URLSearchParams('grant_type=client_credentials')

  try {
    const { data } = await axios.post(PAYPAL_OAUTH_URL, body, {
      headers: {
        Authorization: `Basic ${base64Token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    token = data.access_token
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error(error)
    }
    token = ''
  }
  return token
}

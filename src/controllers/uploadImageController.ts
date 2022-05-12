import { Request, Response } from 'express'
import { uploadImage } from '../utils'

export type TResp = {
  message: string
  url: string
}

export const uploadImageController = async (
  req: Request,
  res: Response<TResp>
) => {
  const url = await uploadImage(req)
  res.status(200).json({ message: 'ok', url })
}

import { Request } from 'express'
import formidable from 'formidable'
import { UserModel } from '../models'
import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_URL } from './envUtil'

cloudinary.config(CLOUDINARY_URL)

const isAmin = async (idUser: string): Promise<boolean> => {
  const user = await UserModel.findById(idUser)
  if (!user) throw new Error('Usuario no encontrado')
  if (user.role !== 'admin') throw new Error('No tiene permisos')
  return true
}

const saveImage = async (file: formidable.File): Promise<string> => {
  // eslint-disable-next-line camelcase
  const { secure_url } = await cloudinary.uploader.upload(file.filepath, {
    folder: 'teslo-shop'
  })
  // eslint-disable-next-line camelcase
  return secure_url
}

export const uploadImage = async (req: Request): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm()
    form.parse(req, async (error, fields, files) => {
      if (error) {
        return reject(error)
      }

      const admin = await isAmin(fields.idUser as string)
      if (!admin) throw new Error('No tienes permisos')
      const url = await saveImage(files.file as formidable.File)
      resolve(url)
    })
  })
}

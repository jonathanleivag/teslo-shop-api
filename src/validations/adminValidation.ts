import * as yup from 'yup'
import { TGender, TRole, TValidSize, TValidType } from '../models'
import {
  IGetOneOrderAdminInputData,
  IProductData,
  IUpdateRoleInputData,
  TStatus
} from '../typeDefs'

export const dashboardValidation: yup.SchemaOf<{
  idUser: string
  status?: TStatus
}> = yup.object().shape({
  idUser: yup.string().required('El usuario es requerido'),
  status: yup
    .mixed<TStatus>()
    .oneOf(['pending', 'paid', 'all'])
    .notRequired()
})

export const updateRoleValidation: yup.SchemaOf<IUpdateRoleInputData> = yup
  .object()
  .shape({
    idUser: yup.string().required('El usuario es requerido'),
    idUserUpdate: yup.string().required('El usuario es requerido'),
    role: yup
      .mixed<TRole>()
      .oneOf(['admin', 'client'])
      .required('El rol es requerido')
  })

export const getOneOrderAdminValidation: yup.SchemaOf<IGetOneOrderAdminInputData> = yup
  .object()
  .shape({
    id: yup.string().required('El id es requerido'),
    idUser: yup.string().required('El usuario es requerido')
  })

export const updateProductValidation: yup.SchemaOf<IProductData> = yup
  .object()
  .shape({
    product: yup.object().shape({
      id: yup.string().notRequired(),
      description: yup.string().required('La descripción es requerida'),
      inStock: yup.number().required('La cantidad en stock es requerida'),
      images: yup.array<string[]>().required('Las imágenes son requeridas'),
      price: yup.number().required('El precio es requerido'),
      sizes: yup.array<TValidSize[]>().required('Las tallas son requeridas'),
      slug: yup.string().required('El slug es requerido'),
      tags: yup.array().required('Las etiquetas son requeridas'),
      title: yup.string().required('El título es requerido'),
      type: yup
        .mixed<TValidType>()
        .oneOf(['shirts', 'pants', 'hoodies', 'hats'])
        .required('El tipo es requerido'),
      gender: yup
        .mixed<TGender>()
        .oneOf(['men', 'woman', 'kid', 'unisex'])
        .required('El tipo es requerido')
    }),
    idUser: yup.string().required('El id de usuario es requerido')
  })

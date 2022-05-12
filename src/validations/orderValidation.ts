import * as yup from 'yup'
import { TGender, TValidSize } from '../models'
import { IOrderInput, IPayPaypalInputData } from '../typeDefs'

export const addOrderValidation: yup.SchemaOf<IOrderInput> = yup
  .object()
  .shape({
    idUser: yup.string().required('El usuario es requerido'),
    numberOfItem: yup.number().required('El número de artículos es requerido'),
    subtotal: yup.number().required('El subtotal es requerido'),
    tax: yup.number().required('El impuesto es requerido'),
    total: yup.number().required('El total es requerido'),
    orderItems: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string().required('El id es requerido'),
          image: yup.string().required('La imagen es requerida'),
          price: yup.number().required('El precio es requerido'),
          size: yup
            .mixed<TValidSize>()
            .oneOf(['S', 'M', 'L', 'XL'])
            .required('El tamaño es requerido'),
          slug: yup.string().required('El slug es requerido'),
          title: yup.string().required('El título es requerido'),
          gender: yup
            .mixed<TGender>()
            .oneOf(['kid', 'men', 'unisex', 'woman'])
            .required(),
          quantity: yup.number().required('La cantidad es requerido')
        })
      )
      .required('Los artículos son requeridos'),
    address: yup.string().notRequired()
  })

export const loadOrderInCartValidate: yup.SchemaOf<{
  idUser: string
}> = yup.object().shape({
  idUser: yup.string().required('El usuario es requerido')
})

export const orderValidation: yup.SchemaOf<{
  idUser: string
  address: string
}> = yup.object().shape({
  idUser: yup.string().required('El usuario es requerido'),
  address: yup.string().required('La dirección es requerida')
})

export const getOneOrderValidation: yup.SchemaOf<{
  id: string
}> = yup.object().shape({
  id: yup.string().required('El usuario es requerido')
})

export const payPaypalValidation: yup.SchemaOf<IPayPaypalInputData> = yup
  .object()
  .shape({
    orderId: yup.string().required('El id de la orden es requerido'),
    transactionId: yup
      .string()
      .required('El id de la transacción es requerido'),
    userId: yup.string().required('El id del usuario es requerido')
  })

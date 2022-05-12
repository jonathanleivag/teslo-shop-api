import * as yup from 'yup'
import { IAddAddressInputData } from '../typeDefs'

export const addAdressValidation: yup.SchemaOf<IAddAddressInputData> = yup
  .object()
  .shape({
    address: yup.string().required('La dirección es requerida'),
    address0: yup.string().notRequired(),
    postalCode: yup.string().required('El código postal es requerido'),
    city: yup.string().required('La ciudad es requerida'),
    phono: yup.string().required('El teléfono es requerido'),
    country: yup.string().required('El país es requerido'),
    user: yup.string().required('El usuario es requerido'),
    isDelete: yup.boolean().notRequired()
  })

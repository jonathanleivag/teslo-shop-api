import * as yup from 'yup'
import { TRole } from '../models'
import {
  IUpdatePasswordInputData,
  IUserRegisterInputData,
  IUserUpdateInputData
} from '../typeDefs'

export const registerValidation: yup.SchemaOf<IUserRegisterInputData> = yup
  .object()
  .shape({
    name: yup.string().required('El nombre es requerido'),
    email: yup
      .string()
      .email('El email no es válido')
      .required('El email es requerido'),
    password: yup
      .string()
      .required('La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    password0: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('La contraseña es requerida'),
    role: yup
      .mixed<TRole>()
      .oneOf(['admin', 'client'])
      .required('El rol es requerido')
  })
  .required()

export const updateValidation: yup.SchemaOf<IUserUpdateInputData> = yup
  .object()
  .shape({
    id: yup.string().required('El id es requerido'),
    name: yup.string().required('El nombre es requerido'),
    email: yup
      .string()
      .email('El email no es válido')
      .required('El email es requerido')
  })

export const updatePasswordValidation: yup.SchemaOf<IUpdatePasswordInputData> = yup
  .object()
  .shape({
    id: yup.string().required('El id es requerido'),
    password: yup.string().required('La contraseña actual es requerida'),
    password0: yup
      .string()
      .required('La nueva contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    password1: yup
      .string()
      .oneOf([yup.ref('password0'), null], 'Las contraseñas no coinciden')
      .required('La repetición de contraseña es requerida')
  })

import { UserModel } from '../models'
import {
  IRUser,
  IUserLoginInput,
  IUserRegisterInput,
  IUserLoginWithOauthInput,
  ESessionType,
  IRGetOneUser,
  IUserUpdateInput,
  IUpdatePasswordInput
} from '../typeDefs'
import bcrypt from 'bcryptjs'
import { jwtSign, jwtVerify } from '../utils'
import {
  dashboardValidation,
  registerValidation,
  updatePasswordValidation,
  updateValidation
} from '../validations'
import { Request } from 'express'

/* -------------------------------------------------------------------------- */
/*                                    query                                   */
/* -------------------------------------------------------------------------- */

const login = async (_: null, { input }: IUserLoginInput): Promise<IRUser> => {
  const { email, password } = input
  const user = await UserModel.findOne({ email })
  if (!user) {
    throw new Error('Usuario no coincide con el email y/o contraseña')
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    throw new Error('Usuario no coincide con el email y/o contraseña')
  }

  const { id, name, role, createdAt, updatedAt } = user

  return {
    user: { id, name, email, role, createdAt, updatedAt },
    token: jwtSign({
      id,
      name,
      email,
      role,
      createdAt: createdAt!,
      updatedAt: updatedAt!
    }),
    message: 'Login exitoso'
  }
}

const checkToken = async (_: null, __: null, req: Request): Promise<IRUser> => {
  const { token = '' } = req.cookies

  try {
    const { id } = jwtVerify(token)

    const user = await UserModel.findById(id)

    if (!user) throw new Error('Usuario no encontrado')

    const { name, email, role, createdAt, updatedAt } = user

    return {
      user: { id, name, email, role, createdAt, updatedAt },
      token: jwtSign({
        id,
        name,
        email,
        role,
        createdAt: createdAt!,
        updatedAt: updatedAt!
      }),
      message: 'Token valido'
    }
  } catch (error) {
    throw new Error('Token no valido')
  }
}

const getOneUser = async (
  _: null,
  input: { idUser: string }
): Promise<IRGetOneUser> => {
  const isValid = await dashboardValidation.isValid(input)
  if (!isValid) await dashboardValidation.validate(input)
  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('Usuario no encontrado')

  let type: ESessionType = 'email'

  if (user.password === '@') {
    type = 'auth0'
  } else {
    type = 'email'
  }

  return { user, type }
}

/* -------------------------------------------------------------------------- */
/*                                  mutation                                  */
/* -------------------------------------------------------------------------- */

const register = async (
  _: null,
  { input }: IUserRegisterInput
): Promise<IRUser> => {
  const isValid = await registerValidation.isValid(input)
  if (!isValid) await registerValidation.validate(input)

  const { name, email, password } = input

  const user = await UserModel.findOne({ email })
  if (user) {
    throw new Error(`Error al registrar el usuario: ${name}`)
  }

  input.password = bcrypt.hashSync(password, 10)

  const newUser = new UserModel(input)
  const { id, role, createdAt, updatedAt } = await newUser.save()

  return {
    user: { id, name, email, role, createdAt, updatedAt },
    token: jwtSign({
      id,
      name,
      email,
      role,
      createdAt: createdAt!,
      updatedAt: updatedAt!
    }),
    message: `Usuario ${name} registrado exitosamente`
  }
}

const loginWithOauth = async (
  _: null,
  { input }: IUserLoginWithOauthInput
): Promise<IRUser> => {
  const { email, name } = input

  const user = await UserModel.findOne({ email })

  if (user) {
    const { id, role, createdAt, updatedAt } = user

    return {
      user: { id, name, email, role, createdAt, updatedAt },
      token: jwtSign({
        id,
        name,
        email,
        role,
        createdAt: createdAt!,
        updatedAt: updatedAt!
      }),
      message: 'Login exitoso'
    }
  } else {
    const newUser = new UserModel({
      name,
      email,
      password: '@',
      role: 'client'
    })

    const { id, role, createdAt, updatedAt } = await newUser.save()

    return {
      user: { id, name, email, role, createdAt, updatedAt },
      token: jwtSign({
        id,
        name,
        email,
        role,
        createdAt: createdAt!,
        updatedAt: updatedAt!
      }),
      message: 'Login exitoso'
    }
  }
}

const updateUser = async (
  _: null,
  { input }: IUserUpdateInput
): Promise<string> => {
  const isValid = await updateValidation.isValid(input)
  if (!isValid) await updateValidation.validate(input)

  const user = await UserModel.findById(input.id)
  if (!user) throw new Error('Usuario no encontrado')

  await UserModel.findByIdAndUpdate(input.id, input)
  return 'Usuario actualizado exitosamente'
}

const updatePassword = async (
  _: null,
  { input }: IUpdatePasswordInput
): Promise<string> => {
  const isValid = await updatePasswordValidation.isValid(input)
  if (!isValid) await updatePasswordValidation.validate(input)

  const user = await UserModel.findById(input.id)
  if (!user) throw new Error('Usuario no encontrado')

  const { password, password0, password1 } = input

  if (!bcrypt.compareSync(password, user.password!)) {
    throw new Error('Usuario no coincide con el email y/o contraseña')
  }

  if (password0 !== password1) {
    throw new Error('Las contraseñas no coinciden')
  }

  input.password = bcrypt.hashSync(password0, 10)
  await UserModel.findByIdAndUpdate(input.id, input)
  return 'Contraseña actualizada exitosamente'
}

export default {
  Query: {
    login,
    checkToken,
    getOneUser
  },
  Mutation: {
    register,
    loginWithOauth,
    updateUser,
    updatePassword
  }
}

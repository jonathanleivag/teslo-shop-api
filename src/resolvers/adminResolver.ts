import { IUser, OrderModel, ProductModel, UserModel } from '../models'
import { IOrder } from '../models/OrderModel'
import {
  IDashboard,
  IGetOneOrderAdminInput,
  IUpdateProductInput,
  IUpdateRoleInput,
  TStatus
} from '../typeDefs'
import {
  dashboardValidation,
  getOneOrderAdminValidation,
  updateRoleValidation
} from '../validations'
import { updateProductValidation } from '../validations/adminValidation'
import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_URL, URL_FRONTEND } from '../utils'

cloudinary.config(CLOUDINARY_URL)

/* -------------------------------------------------------------------------- */
/*                                    query                                   */
/* -------------------------------------------------------------------------- */

const dashboard = async (
  _: null,
  input: { idUser: string }
): Promise<IDashboard> => {
  const isValid = await dashboardValidation.isValid(input)
  if (!isValid) await dashboardValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')

  const [
    numberOfOrders,
    paidOrders,
    numberOfClient,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  ] = await Promise.all([
    OrderModel.find({ inCart: false }).count(),
    OrderModel.find({ isPaid: true }).count(),
    UserModel.find({ role: 'client' }).count(),
    ProductModel.find().count(),
    ProductModel.find({ inStock: 0 }).count(),
    ProductModel.find({ inStock: { $lte: 10 } }).count()
  ])

  return {
    numberOfOrders,
    paidOrders,
    numberOfClient,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
    noPaidOrders: numberOfOrders - paidOrders
  }
}

const getUsers = async (
  _: null,
  input: { idUser: string }
): Promise<IUser[]> => {
  const isValid = await dashboardValidation.isValid(input)
  if (!isValid) await dashboardValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')

  return (await UserModel.find()).filter(user => user.id !== input.idUser)
}

const getAllOrder = async (
  _: null,
  input: { idUser: string; status: TStatus }
): Promise<IOrder[]> => {
  const isValid = await dashboardValidation.isValid(input)
  if (!isValid) await dashboardValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')
  let order: IOrder[] = []

  if (input.status === 'paid') {
    order = await OrderModel.find({ inCart: false, isPaid: true }).populate([
      'user'
    ])
  }

  if (input.status === 'pending') {
    order = await OrderModel.find({
      isPaid: false,
      inCart: false
    }).populate(['user'])
  }

  if (input.status === 'all') {
    order = await OrderModel.find({ inCart: false }).populate(['user'])
  }
  return order
}

const getOneOrderAdmin = async (
  _: null,
  { input }: IGetOneOrderAdminInput
): Promise<IOrder> => {
  const isValid = await getOneOrderAdminValidation.isValid(input)
  if (!isValid) await getOneOrderAdminValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')

  const order = await OrderModel.findById(input.id).populate(['user'])
  if (!order) throw new Error('El pedido no existe')
  return order
}

const productsWithNoInventory = async (_: null, input: { idUser: string }) => {
  const isValid = await dashboardValidation.isValid(input)
  if (!isValid) await dashboardValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')

  return await ProductModel.find({ inStock: 0 })
}

const lowInventory = async (_: null, input: { idUser: string }) => {
  const isValid = await dashboardValidation.isValid(input)
  if (!isValid) await dashboardValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')

  return ProductModel.find({ inStock: { $lte: 10 } })
}

/* -------------------------------------------------------------------------- */
/*                                  mutation                                  */
/* -------------------------------------------------------------------------- */

const updateRole = async (
  _: null,
  { input }: IUpdateRoleInput
): Promise<string> => {
  const isValid = await updateRoleValidation.isValid(input)
  if (!isValid) await updateRoleValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')

  const userUpdate = await UserModel.findById(input.idUserUpdate)
  if (!userUpdate) throw new Error('El usuario no existe')

  await UserModel.findByIdAndUpdate(input.idUserUpdate, {
    role: input.role
  })

  return `El rol del usuario ${user.name} se actualizó correctamente a ${input.role}`
}

const updateProduct = async (
  _: null,
  { input }: IUpdateProductInput
): Promise<string> => {
  const isValid = await updateProductValidation.isValid(input)
  if (!isValid) await updateProductValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')

  const product = await ProductModel.findById(input.product.id)
  if (!product) throw new Error('El producto no existe')

  if (input.product.images.length < 2) {
    throw new Error('El producto debe tener al menos 2 imagenes')
  }

  product.images.forEach(async image => {
    if (!input.product.images.includes(image)) {
      const [file] = image.substring(image.lastIndexOf('/') + 1).split('.')
      await cloudinary.uploader.destroy(`teslo-shop/${file}`)
    }
  })

  await ProductModel.findByIdAndUpdate(input.product.id, {
    ...input.product
  })

  return 'El producto se actualizó correctamente'
}

const addProduct = async (
  _: null,
  { input }: IUpdateProductInput
): Promise<string> => {
  const isValid = await updateProductValidation.isValid(input)
  if (!isValid) await updateProductValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')

  const product = await ProductModel.findOne({ slug: input.product.slug })
  if (product) throw new Error('El producto ya existe')

  if (input.product.images.length < 2) {
    throw new Error('El producto debe tener al menos 2 imagenes')
  }

  const newProduct = new ProductModel({ ...input.product })
  await newProduct.save()

  return 'El producto se agregó correctamente'
}

const deleteProduct = async (
  _: null,
  { input }: IGetOneOrderAdminInput
): Promise<string> => {
  const isValid = await getOneOrderAdminValidation.isValid(input)
  if (!isValid) await getOneOrderAdminValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  if (user.role !== 'admin') throw new Error('No tienes permisos')

  const product = await ProductModel.findById(input.id)
  if (!product) throw new Error('El producto no existe')

  product.images.forEach(async image => {
    if (!image.includes(URL_FRONTEND)) {
      const [file] = image.substring(image.lastIndexOf('/') + 1).split('.')
      await cloudinary.uploader.destroy(`teslo-shop/${file}`)
    }
  })

  await ProductModel.findByIdAndDelete(input.id)
  return 'El producto se eliminó correctamente'
}

export default {
  Query: {
    dashboard,
    getUsers,
    getAllOrder,
    getOneOrderAdmin,
    productsWithNoInventory,
    lowInventory
  },
  Mutation: {
    updateRole,
    updateProduct,
    addProduct,
    deleteProduct
  }
}

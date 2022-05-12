import {
  AddressModel,
  IOrder,
  OrderModel,
  ProductModel,
  UserModel
} from '../models'
import { IAddOrderInput, IPayPaypalInput } from '../typeDefs'
import { generateTokenPaypal, TAX } from '../utils'
import axios from 'axios'
import {
  addOrderValidation,
  getOneOrderValidation,
  loadOrderInCartValidate,
  orderValidation,
  payPaypalValidation
} from '../validations'
import { PaypalOrderStatusResponse } from '../interfaces'
import { PAYPAL_ORDERS_URL } from '../utils/envUtil'

/* -------------------------------------------------------------------------- */
/*                                    query                                   */
/* -------------------------------------------------------------------------- */
const loadOrderInCart = async (
  _: null,
  input: { idUser: string }
): Promise<IOrder> => {
  const isValid = await loadOrderInCartValidate.isValid(input)
  if (!isValid) await loadOrderInCartValidate.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  const order = await OrderModel.findOne({
    user,
    inCart: true
  }).populate('user')
  if (!order) throw new Error('El carrito no existe')

  return order
}

const getOneOrder = async (_: null, input: { id: string }): Promise<IOrder> => {
  const isValid = await getOneOrderValidation.isValid(input)
  if (!isValid) await getOneOrderValidation.validate(input)

  const order = await OrderModel.findById(input.id).populate(['user'])
  if (!order) throw new Error('El pedido no existe')

  return order
}

const getAllOrderByUser = async (
  _: null,
  input: { idUser: string }
): Promise<IOrder[]> => {
  const isValid = await loadOrderInCartValidate.isValid(input)
  if (!isValid) await loadOrderInCartValidate.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  const orders = await OrderModel.find({
    inCart: false,
    user
  }).populate(['user'])

  return orders
}

/* -------------------------------------------------------------------------- */
/*                                  mutation                                  */
/* -------------------------------------------------------------------------- */

const addOrder = async (_: any, { input }: IAddOrderInput): Promise<string> => {
  const isValid = await addOrderValidation.isValid(input)
  if (!isValid) await addOrderValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  const order = await OrderModel.findOne({
    user,
    inCart: true
  })

  for await (const product of input.orderItems) {
    const productDB = await ProductModel.findById(product.id)
    if (!productDB) throw new Error('El producto no existe')
    input.orderItems.map(item => {
      if (item.id === product.id) {
        return {
          id: productDB.id,
          image: productDB.images[0],
          price: productDB.price,
          size: item.size,
          slug: productDB.slug,
          title: productDB.title,
          gender: productDB.gender,
          quantity: item.quantity
        }
      }
      return item
    })
  }

  const numberOfItem = input.orderItems.reduce((acc, p) => acc + p.quantity, 0)
  input.numberOfItem = numberOfItem
  const subtotal = input.orderItems.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  )
  input.subtotal = subtotal
  const tax = input.orderItems.reduce(
    (acc, p) => acc + p.price * p.quantity * (TAX / 100),
    0
  )
  input.tax = tax
  const total = subtotal + tax
  input.total = Math.round(total * 100) / 100

  if (order) {
    await OrderModel.findByIdAndUpdate(order.id, {
      ...input,
      orderItems: input.orderItems,
      user
    })
  } else {
    const newOrder = new OrderModel({
      ...input,
      orderItems: input.orderItems,
      user
    })
    await newOrder.save()
  }
  return 'Orden agreagada'
}

const orderFunction = async (
  _: any,
  input: { idUser: string; address: string }
): Promise<string> => {
  const isValid = await orderValidation.isValid(input)
  if (!isValid) await orderValidation.validate(input)

  const user = await UserModel.findById(input.idUser)
  if (!user) throw new Error('El usuario no existe')

  const address = await AddressModel.findById(input.address).populate('country')

  if (!address) throw new Error('La direccion no existe')

  const order = await OrderModel.findOne({
    idUser: input.idUser,
    inCart: true
  })

  if (!order) throw new Error('El carrito no existe')

  await OrderModel.findByIdAndUpdate(order.id, {
    inCart: false,
    address: {
      address: address.address,
      address0: address.address0,
      postalCode: address.postalCode,
      city: address.city,
      phono: address.phono,
      country: {
        label: address.country.label,
        value: address.country.value
      }
    }
  })

  return order.id
}

const payPaypal = async (_: null, { input }: IPayPaypalInput) => {
  const isValid = await payPaypalValidation.isValid(input)
  if (!isValid) await payPaypalValidation.validate(input)

  const user = await UserModel.findById(input.userId)
  if (!user) throw new Error('El usuario no existe')

  const order = await OrderModel.findOne({ id: input.orderId, user })
  if (!order) throw new Error('El pedido no existe')

  const tokenPaipal = await generateTokenPaypal()
  if (!tokenPaipal) throw new Error('No se pudo generar el token')
  if (tokenPaipal === '') throw new Error('No se pudo generar el token')

  const { data } = await axios.get<PaypalOrderStatusResponse>(
    ` ${PAYPAL_ORDERS_URL}/${input.transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${tokenPaipal}`
      }
    }
  )

  if (data.status !== 'COMPLETED') {
    throw new Error('El pago no se ha realizado')
  }

  await OrderModel.findByIdAndUpdate(input.orderId, {
    transactionId: input.transactionId,
    isPaid: true,
    paidAt: new Date().toISOString()
  })

  return 'Pago realizado'
}

export default {
  Query: {
    loadOrderInCart,
    getOneOrder,
    getAllOrderByUser
  },
  Mutation: {
    addOrder,
    order: orderFunction,
    payPaypal
  }
}

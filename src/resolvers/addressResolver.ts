import { AddressModel, CountryModel, UserModel } from '../models'
import {
  IAddAddressInput,
  IAddAddressInputData,
  IAddress,
  IRAddress
} from '../typeDefs'
import { addAdressValidation } from '../validations'

/* -------------------------------------------------------------------------- */
/*                                    query                                   */
/* -------------------------------------------------------------------------- */

const getAddress = async (_: null, { id }: { id: string }): Promise<IAddress> =>
  await AddressModel.findById(id).populate(['country', 'user'])

const getAddressesByUser = async (
  _: null,
  { idUser }: { idUser: string }
): Promise<IAddress[]> =>
  await AddressModel.find({ user: idUser }).populate(['country', 'user'])

/* -------------------------------------------------------------------------- */
/*                                  mutation                                  */
/* -------------------------------------------------------------------------- */

const addAddress = async (
  _: null,
  { input }: IAddAddressInput
): Promise<IRAddress> => {
  const isValid = await addAdressValidation.isValid(input)
  if (!isValid) await addAdressValidation.validate(input)

  const addresses = await AddressModel.find({ user: input.user })
  if (addresses.length >= 3) {
    throw new Error('Solo puedes tener 3 direcciones')
  }

  const user = await UserModel.findById(input.user)
  if (!user) throw new Error('El usuario no existe')

  const addressExist = await AddressModel.findOne({
    user,
    address: input.address
  })
  if (addressExist) throw new Error('La dirección ya existe')

  const country = await CountryModel.findOne({ value: input.country })
  if (!country) throw new Error('El país no existe')

  const newAddress = new AddressModel({ ...input, user, country })
  const address = await newAddress.save()

  return {
    message: 'Se ha agregado la dirección',
    address: await address.populate(['user', 'country'])
  }
}

const deleteAddress = async (
  _: null,
  { id }: { id: string }
): Promise<string> => {
  const address = await AddressModel.findById(id)
  if (!address) throw new Error('La dirección no existe')
  await address.remove()
  return 'Se ha eliminado la dirección'
}

const editAddress = async (
  _: null,
  { id, input }: { id: string; input: IAddAddressInputData }
): Promise<IRAddress> => {
  const isValid = await addAdressValidation.isValid(input)
  if (!isValid) await addAdressValidation.validate(input)

  const address = await AddressModel.findById(id)
  if (!address) throw new Error('La dirección no existe')

  const country = await CountryModel.findOne({ value: input.country })
  if (!country) throw new Error('El país no existe')

  const editAddress = await AddressModel.findByIdAndUpdate(
    id,
    { ...input, country },
    { new: true, populate: ['user', 'country'] }
  )

  return {
    message: 'Se ha editado la dirección',
    address: editAddress as IAddress
  }
}

export default {
  Query: {
    getAddress,
    getAddressesByUser
  },
  Mutation: {
    addAddress,
    deleteAddress,
    editAddress
  }
}

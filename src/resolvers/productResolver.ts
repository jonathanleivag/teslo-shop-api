import { IProduct, ProductModel } from '../models'
import { TProductsTypeDefs, TProductBySlug, TSearchProduct } from '../typeDefs'

/* -------------------------------------------------------------------------- */
/*                                    query                                   */
/* -------------------------------------------------------------------------- */

const products = async (
  _ = null,
  { gender }: TProductsTypeDefs
): Promise<IProduct[]> => {
  let filter = {}
  if (gender) filter = { gender }
  return await ProductModel.find(filter)
}

const productBySlug = async (
  _ = null,
  { slug }: TProductBySlug
): Promise<IProduct> => {
  const product = await ProductModel.findOne({ slug })
  if (!product) throw new Error('El producto no existe')
  return product
}

const searchProduct = async (
  _ = null,
  { search }: TSearchProduct
): Promise<IProduct[]> => {
  search = search.toLowerCase()

  if (search.length === 0) {
    throw new Error('El campo de busqueda no puede estar vacio')
  }

  const products = await ProductModel.find({
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ]
  })

  return products
}

const producById = async (
  _ = null,
  { id }: { id: string }
): Promise<IProduct | null> => await ProductModel.findById(id)

export default {
  Query: {
    products,
    productBySlug,
    searchProduct,
    producById
  }
}

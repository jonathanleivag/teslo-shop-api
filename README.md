# Teslo Shop Api


### Empezando

El archivo .env.example renombrar a .env

```bash
PORT= Puerto de servidor
MONGO_DB= Url de la base de datos de mongoDb
JWT_SECRET= crear una key para jsonwebtoken
URL_FRONTEND= Url de frontend
# impuesto de la compra
TAX=19

# paypal
PAYPAL_SECRET_ID= # clave secreta de paypal -> paypal developer
PAYPAL_CLIENT_ID= # clave publica de paypal
PAYPAL_OAUTH_URL= # url para crear un token para verificar el pago
PAYPAL_ORDERS_URL=# url para verificar el pago

# cloudinary
CLOUDINARY_URL=
```

* Web: [teslo-shop-web](https://github.com/jonathanleivag/teslo-shop-web)

Primero, ejecute el servidor de desarrollo:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

### Consultas de graphql

```javascript
/* Mutation */

// Crear datos de pruebas (productos / usuarios / paises)
mutation Seed($input: SeedInput) {
  seed(input: $input)
}

// variables
{
  "input": {
    "noUser": false,
    "noProduct": false,
    "noCountry": false
  }
}

// registro de usuario

mutation Register($input: UserRegisterInput) {
  register(input: $input) {
    message
    token
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
  }
}

// variables

{
  "input": {
    "email": "",
    "password": "",
    "password0": "",
    "role": "", // 'admin' | 'client' -> dafault 'client'
    "name": ""
  }
}

// login Oauth
mutation LoginWithOauth($input: UserLoginWithOauthInput!) {
  loginWithOauth(input: $input) {
    token
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    message
  }
}

// variables

{
  "input": {
    "email": "",
    "name": ""
  }
}

// agregar dirección
mutation AddAddress($input: AddAddressInput) {
  addAddress(input: $input) {
    message
    address {
      id
      address
      address0
      postalCode
      city
      phono
      user {
        id
        name
        email
        role
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      country {
        label
        value
      }
    }
  }
}

// variables

{
  "input": {
    "address": "",
    "user": "",
    "postalCode": "",
    "phono": "",
    "country": "",// -> value de país (country)
    "city": "",
    "address0": ""
  }
}

// eliminar dirección
mutation DeleteAddress($deleteAddressId: ID!) {
  deleteAddress(id: $deleteAddressId)
}

// variables

{
  "deleteAddressId": ""
}

// editar dirección
mutation EditAddress($editAddressId: ID!, $input: AddAddressInput) {
  editAddress(id: $editAddressId, input: $input) {
    message
    address {
      id
      address
      address0
      postalCode
      city
      phono
      country {
        id
        label
        value
      }
      user {
        id
        name
        email
        role
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
}

// variables

{
  "editAddressId": "",
  "input": {
    "address": "",
    "user": "",
    "postalCode": "",
    "phono": "",
    "country": "", // -> value de país (country)
    "city": "",
    "address0": ""
  }
}

// add order

mutation AddOrder($input: AddOrderInput) {
  addOrder(input: $input)
}

// variables
{
  "input": {
    "idUser":"", // id del usuario
    "numberOfItem": 0,
    "subtotal": 0,
    "tax": 0,
    "total": 0,
    "orderItems": [{
      "id": "",
      "image": "",
      "price": 0,
      "size": "", // 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'
      "slug": "",
      "title": "",
      "gender": "", // 'men', 'woman', 'kid', 'unisex'
      "quantity": 0
    }]
  }
}

// crear orden
mutation Order($idUser: ID!, $address: ID!) {
  order(idUser: $idUser, address: $address)
}

// variables
{
  "idUser": "",
  "address": ""
}

// verificar el pago de paypal
mutation PayPaypal($input: PayPaypalInput) {
  payPaypal(input: $input)
}

// variables
{
  "input": {
    "orderId": "",
    "transactionId": "",
    "userId": ""
  }
}

// actualizar rol de usuario
mutation UpdateRole($input: UpdateRoleInput) {
  updateRole(input: $input)
}

// variables
{
  "input": {
    "idUser": "",
    "idUserUpdate": "",
    "role": "" // 'admin' | 'client'
  }
}

// Eliminar producto
mutation DeleteProduct($input: GetOneOrderAdminInput) {
  deleteProduct(input: $input)
}

{
  "input": {
    "id": "",
    "idUser": ""
  }
}

/* Query */

// Mostrar todos los productos y mostrar producto filtrado por Género
query Products($gender: EGender) {
  products(gender: $gender) {
    id
    description
    images
    inStock
    price
    sizes
    slug
    tags
    title
    type
    gender
    createdAt
    updatedAt
  }
}

// variables
{
  "gender": null // null | woman | men | kid | unisex
}

// Mostrar producto buscado por slug

query ProductBySlug($slug: String!) {
  productBySlug(slug: $slug) {
    id
    description
    images
    inStock
    price
    sizes
    slug
    tags
    title
    type
    gender
    createdAt
    updatedAt
  }
}

// variables
{
  "slug": "" // string
}

// Buscar productos

query SearchProduct($search: String!) {
  searchProduct(search: $search) {
    id
    description
    images
    inStock
    price
    sizes
    slug
    tags
    title
    type
    gender
    updatedAt
    createdAt
  }
}

// variables

{
  "search": "" // string -> Busqueda por titulo y los tag de los productos
}

// login
query Login($input: UserLoginInput!) {
  login(input: $input) {
   message
    token
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
  }
}

// variables

{
  "input": {
    "email": "",
    "password": ""
  }
}

// CheckToken

query CheckToken {
  checkToken {
    token
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    message
  }
}

// coockies

{
  token: ""
}

// mostrar dirección por id
query GetAddress($getAddressId: ID!) {
  getAddress(id: $getAddressId) {
    id
    address
    address0
    postalCode
    city
    phono
    country {
      id
      label
      value
    }
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}

// variables
{
  "getAddressId": ""
}

// mostrar direcciones por usuario
query GetAddressesByUser($idUser: ID!) {
  getAddressesByUser(idUser: $idUser) {
    id
    address
    address0
    postalCode
    city
    phono
    country {
      id
      label
      value
    }
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}

// variables
{
  "idUser": ""
}

// mostrar paises
query GetCountries {
  getCountries {
    id
    label
    value
  }
}

// mostrar todos los productos del carrito por usuario
query LoadOrderInCart($idUser: ID!) {
  loadOrderInCart(idUser: $idUser) {
    id
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    numberOfItem
    subtotal
    tax
    total
    isPaid
    paidAt
    paymetResult
    orderItems {
      id
      image
      price
      slug
      title
      gender
      size
      quantity
    }
    inCart
  }
}

// variables
{
  "idUser": ""
}

// mostrar una orden por id
query GetOneOrder($getOneOrderId: ID!) {
  getOneOrder(id: $getOneOrderId) {
    id
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    numberOfItem
    subtotal
    tax
    total
    isPaid
    paidAt
    paymetResult
    orderItems {
      id
      image
      price
      slug
      title
      gender
      size
      quantity
    }
    inCart
    address {
      id
      address
      address0
      postalCode
      city
      phono
      country {
        id
        label
        value
      }
      user {
        id
        name
        email
        role
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
}

// variables
{
  "getOneOrderId": "" // -> id de la orden
}

// mostrar todas las ordenes por usuario
query GetAllOrderByUser($idUser: ID!) {
  getAllOrderByUser(idUser: $idUser) {
    id
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    numberOfItem
    subtotal
    tax
    total
    isPaid
    paidAt
    paymetResult
    orderItems {
      id
      image
      price
      slug
      title
      gender
      size
      quantity
    }
    inCart
    address {
      id
      address
      address0
      postalCode
      city
      phono
      country {
        id
        label
        value
      }
      user {
        id
        name
        email
        role
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
}

// variables
{
  "idUser": ""
}

// estadisticas generales
query Dashboard($idUser: ID!) {
  dashboard(idUser: $idUser) {
    numberOfOrders
    paidOrders
    numberOfClient
    numberOfProducts
    productsWithNoInventory
    lowInventory
    noPaidOrders
  }
}

// variables
{
  "idUser": ""
}

query GetUsers($idUser: ID!) {
  getUsers(idUser: $idUser) {
    id
    name
    email
    role
    createdAt
    updatedAt
  }
}

// variables
{
  "idUser": ""
}

// mostrar todas las ordenes y por estados
 query GetAllOrder($idUser: ID!, $status: EStatus) {
    getAllOrder(idUser: $idUser, status: $status) {
    id
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    numberOfItem
    subtotal
    tax
    total
    isPaid
    paidAt
    paymetResult
    orderItems {
      id
      image
      price
      slug
      title
      gender
      size
      quantity
    }
    inCart
    address {
      id
      address
      address0
      postalCode
      city
      phono
      country {
        id
        label
        value
      }
      user {
        id
        name
        email
        role
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
    updatedAt
  }
}

// variables
{
  "idUser": "",
  'status': "" // -> all | paid | pending
}

// mostrar una orden por id (admin)
query GetOneOrderAdmin($input: GetOneOrderAdminInput) {
  getOneOrderAdmin(input: $input) {
    id
    user {
      id
      name
      email
      role
      createdAt
      updatedAt
    }
    numberOfItem
    subtotal
    tax
    total
    isPaid
    paidAt
    paymetResult
    orderItems {
      id
      image
      price
      slug
      title
      gender
      size
      quantity
    }
    inCart
    address {
      id
      address
      address0
      postalCode
      city
      phono
      country {
        id
        label
        value
      }
      user {
        id
        name
        email
        role
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
    updatedAt
  }
}

// variables
{
  "input": {
    "id": "",
    "idUser": ""
  }
}

// Producto no inventario

query ProductsWithNoInventory($idUser: ID!) {
  productsWithNoInventory(idUser: $idUser) {
    id
    description
    images
    inStock
    price
    sizes
    slug
    tags
    title
    type
    gender
    createdAt
    updatedAt
  }
}

// variables
{
  "idUser": ""
}

// Producto bajo en stock
query LowInventory($idUser: ID!) {
  lowInventory(idUser: $idUser) {
    id
    description
    images
    inStock
    price
    sizes
    slug
    tags
    title
    type
    gender
    createdAt
    updatedAt
  }
}

// variables
{
  "idUser": ""
}
```
### End-point

```javascript
  // Subir imagen

  /api/uploadImage

  // params
  // form-data
  file -> imagen jpg, png, jpeg, gif
  idUser

```

# License

Free Software, Hell Yeah!
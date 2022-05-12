import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import resolvers from './resolvers'
import typeDefs from './typeDefs'
import { PORT, URL_FRONTEND } from './utils'
import path from 'path'

const optionCors: cors.CorsOptions = {
  origin: [
    URL_FRONTEND,
    'https://studio.apollographql.com',
    'https://teslo-shop.jonathanleivag.cl',
    'http://localhost:3000'
  ],
  credentials: true
}

export async function startApolloServer () {
  const app = express()
  const httpServer = http.createServer(app)
  app.use(cookieParser())
  app.use(cors(optionCors))
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/api', require('./routers/uploadImageRoute'))
  app.use(express.static(path.resolve(__dirname, '../src/public')))
  app.disable('x-powered-by')

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => req
  })

  await server.start()
  server.applyMiddleware({
    app,
    cors: optionCors,
    path: '/graphql'
  })

  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve))
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
}

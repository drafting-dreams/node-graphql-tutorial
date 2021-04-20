const { PrismaClient } = require('@prisma/client')
const {
  ApolloServer,
  PubSub,
  SchemaDirectiveVisitor,
} = require('apollo-server')
const fs = require('fs')
const path = require('path')
const { getUserId } = require('./utils')
const { defaultFieldResolver } = require('graphql')
const resolvers = require('./resolvers')

const prisma = new PrismaClient()

const pubsub = new PubSub()

class AuthenticateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args) {
      const { userId } = args[2] // args[2] is resolver's context
      if (!userId) {
        throw Error('user not logged in')
      }
      return resolve.apply(this, args)
    }
  }
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  schemaDirectives: {
    authenticate: AuthenticateDirective,
  },
  context: ({ req }) => ({
    ...req,
    prisma,
    pubsub,
    userId: req && req.headers.authorization ? getUserId(req) : null,
  }),
})

server.listen().then(({ url, port: PORT }) => {
  console.log('Server is runnin on ' + url)
  console.log(`server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(
    `Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`,
  )
})

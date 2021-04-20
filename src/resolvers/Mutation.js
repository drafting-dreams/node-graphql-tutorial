const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils.js')

async function signup(parent, args, ctx) {
  const password = await bcrypt.hash(args.password, 10)

  const user = await ctx.prisma.user.create({ data: { ...args, password } })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return { token, user }
}

async function login(parent, args, ctx) {
  const user = await ctx.prisma.user.findUnique({
    where: { email: args.email },
  })
  if (!user) {
    throw new Error('invalid email address')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return { token, user }
}

async function post(parent, args, context) {
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: context.userId } },
    },
  })

  context.pubsub.publish('NEW_LINK', newLink)

  return newLink
}

async function vote(root, args, ctx) {
  const { userId } = ctx
  const vote = await ctx.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId,
      },
    },
  })

  if (vote) {
    throw Error('You have already voted this post')
  }

  const newVote = await ctx.prisma.vote.create({
    data: {
      linkId: Number(args.linkId),
      userId,
    },
  })
  ctx.pubsub.publish('NEW_VOTE', newVote)

  return newVote
}

module.exports = { signup, login, post, vote }

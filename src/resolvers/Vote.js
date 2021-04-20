function link(root, args, ctx) {
  return ctx.prisma.vote.findUnique({ where: { id: root.id } }).link()
}

function user(root, args, ctx) {
  return ctx.prisma.vote.findUnique({ where: { id: root.id } }).user()
}

module.exports = { link, user }

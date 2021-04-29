function postedBy(parent, args, context) {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).postedBy()
}

function votes(root, args, ctx) {
  return ctx.prisma.link.findUnique({ where: { id: root.id } }).votes()
}

module.exports = {
  postedBy,
  votes,
}

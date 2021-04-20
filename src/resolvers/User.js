function links(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).links()
}

function votes(root, args, ctx) {
  return ctx.prisma.user.findUnique({ where: { id: root.id } }).votes()
}

module.exports = {
  links,
  votes,
}

async function feed(parent, args, ctx) {
  const { filter, skip, take, orderBy } = args
  const where = filter
    ? {
        OR: [
          { url: { contains: args.filter } },
          { description: { contains: args.filter } },
        ],
      }
    : {}
  const links = ctx.prisma.link.findMany({
    where,
    skip,
    take,
    orderBy,
  })
  const total = ctx.prisma.link.count({ where })
  return { links, total }
}

module.exports = { feed }

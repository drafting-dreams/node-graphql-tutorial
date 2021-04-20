# Node-Graphql tutorial

This project is followed through the graphql-node tutorial on [howtographql](https://www.howtographql.com/graphql-js/0-introduction/). It leverages apollo server which is based on Express.js and prisma as its ORM. The tutorial introduced basic query, mutation and subscription implementation. What's more, how to combine prisma with the apollo server.

## How to run it

To run the server in dev mode.

```
npm start
```

To update ORM schema. After modifying the schema.prisma file. Run the following command.

```
npm run migrate && npm run generate
```

To see the data in db.

```
npm run studio
```

To open playground and test your API. Open http://localhost4000/graphql in your browser.

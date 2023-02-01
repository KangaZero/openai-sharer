
const typeDefs = `#graphql
type Post {
    name: String!
    prompt: String!
    photo: String!
  }
  
  type Query {
    posts: [Post]!
  }
  
  type Mutation {
    createPost(name: String!, prompt: String!, photo: String!): Post!
  }
`

// export default typeDefs;
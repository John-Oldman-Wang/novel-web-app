const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Chapter {
        _id: ID!
        title: String!
        href: String!
        novel: Novel!
        paragraphs: [String!]!
    }

    type Novel {
        _id: ID
        title: String
        href: String
        author: String
        category: String
        shortintroduction: String
        introduction: String
        smallCategory: String
        lastUpdateTime: String
        year: Int
        image: String
        chapters: [Chapter]!
        isMale: Boolean
    }

    type RootQuery{
        chapter(id:String): Chapter
        novel(id:String): Novel
        randomNovels(amount:Int): [Novel!]
    }

    schema {
        query: RootQuery
    }
`);

import Sequelize from 'sequelize'

/**
 * Sequelize is a constructor function that takes at most 4
 * arguments if using a 'dialect' other than mysql or mariadb.
 *
 * Should cover sensitive strings like user & password.
 * Can also provide one argument that being the URI:
 *
 * @example
 * const connection = new Sequelize('postgres://user:password@example.com:5432/dbname);
 */
const connection = new Sequelize('practice', 'rockchalkwushock', 'password', {
  host: 'localhost',
  dialect: 'postgres'
})

/**
 * This is how we define models in Sequelize.
 * You must declare the datatype.
 * @see http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types
 */
const Article = connection.define(
  'article',
  {
    /**
    * Using this longer syntax gives me access to
    * the extended properties that Sequelize has on
    * the model like noted down below.
    */
    slug: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false // Think of this as allow the user to present no data...false.
    },
    body: {
      type: Sequelize.TEXT
    }
  },
  {
    // this is the options object & third optional argument on define()
    timestamps: false // true by default
  }
)

/**
 * 1. Connect to the database.
 * 2. Automatically generate SQL.
 *
 * FYI: If the database does not exist yet you will get an error.
 *
 * sync() is an asynchronous method this is why we can call .then() on it.
 * The reason we call the action on the model within a callback function is that
 * we cannot be sure that the table exists yet into which we are wanting to insert
 * the data. This prevents their being a conflict.
 *
 * QUESTION: I'm wondering if after hearing this in the tut if there is another method
 * for doing this and if using async/await would be a better way to go about this. :thought_balloon:
 */
// connection.sync().then(() => {
//   Article.create({
//     title: 'demo title',
//     body:
//       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."'
//   })
// })

/**
 * NOTE: You cannot 'update' a table via the 'sync()' method.
 * Sequelize takes a conservative approach assuming you do not want
 * to delete the data that you have changed. You can forcibly delete the file
 * and recreate the table. This is likely okay in development but NOT in your
 * production database.
 *
 * To force this add the options object { force: true } as an argument to sync().
 * You can also pass the option { logging: false } to remove logs.
 */
connection.sync({ force: true }).then(() => {
  /**
   * article.dataValues will give me all the meta data contained on the
   * object queried that pertains to the given model & default data created by
   * SQL.
   *
   * NOTE: 'article' by itself will return an object that represents all the parameters,
   * defaults, & other options that can be set or are already set on the model that has
   * been defined using Sequelize.
   */
  Article.findById(2).then(article => console.log(article.dataValues))

  /**
   * If I need to query the whole 'collection/table':
   *
   * @example
   * - articles will represent an array of objects.
   * Article.findByAll().then(articles => console.log(articles.length))
   */
})

import Sequelize from 'sequelize'

const connection = new Sequelize('practice', 'rockchalkwushock', 'password', {
  host: 'localhost',
  dialect: 'postgres'
})

const Article = connection.define(
  'article',
  {
    slug: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    title: Sequelize.STRING,
    body: Sequelize.TEXT
  },
  {
    hooks: {
      beforeValidate: () => {
        console.log('beforeValidate')
      },
      afterValidate: () => {
        console.log('afterValidate')
      },
      beforeCreate: () => {
        console.log('beforeCreate')
      },
      afterCreate: res => {
        console.log(
          `afterCreate: Created article with slug ${res.dataValues.slug}.`
        )
      }
    }
  }
)

connection
  .sync({
    force: true
  })
  .then(() => {
    Article.create({
      slug: 'some-slug',
      title: 'Some Title',
      body: 'Some body'
    })
  })
  .catch(e => console.log(e))

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
    title: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    body: {
      type: Sequelize.TEXT,
      defaultValue: 'text here'
    }
  },
  {
    timestamps: false
  }
)

connection.sync({ force: true }).then(() => {})

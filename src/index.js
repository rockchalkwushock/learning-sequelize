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
      allowNull: false,
      validate: {
        len: {
          args: [10, 150],
          msg:
            'Please enter a tile with at least 10 character but no longer than 150.'
        }
      }
    },
    body: {
      type: Sequelize.TEXT,
      defaultValue: 'Text here',
      validate: {
        startsWithUpper: bodyVal => {
          const first = bodyVal.charAt(0)
          const startsWithUpper = first === first.toUpperCase()
          if (!startsWithUpper)
            throw new Error('First letter must be a upper case letter')
        }
      }
    }
  },
  {
    timestamps: false
  }
)

connection
  .sync({
    force: true
  })
  .then(() =>
    Article.create({
      title: 'Yeah Yeah Yeah Yeah',
      slug: 'wibble',
      body: 'Wobble'
    })
  )
  .catch(e => console.log(e))

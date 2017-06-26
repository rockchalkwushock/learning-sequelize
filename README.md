# Learning Sequelize

Repository for teaching myself the Sequelize ORM with Postgres as my SQL database engine.

## Links

1. [Installation](http://docs.sequelizejs.com/manual/installation/getting-started.html)
1. [DataTypes](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types)
1. [Validations](http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations)

### As seen in CLI

```sh
codybrunner in learning-sequelize on master [?] $ yarn start
yarn start v0.24.6
$ nps
nps is executing `default`: node index.js
    Unhandled rejection SequelizeConnectionError: database "practice" does not exist
    at connection.connect.err (/Users/codybrunner/Desktop/WIP/learning-sequelize/nod
    e_modules/sequelize/lib/dialects/postgres/connection-manager.js:104:24)
codybrunner in learning-sequelize on master [?] $ yarn start
yarn start v0.24.6
$ nps
nps is executing `default`: node index.js
    (node:68007) DeprecationWarning: Using the automatically created return value from c
    lient.query as an event emitter is deprecated and will be removed in pg@7.0. Please
    see the upgrade guide at https://node-postgres.com/guides/upgrading

    Executing (default):
      CREATE TABLE IF NOT EXISTS "articles" ("id"   SERIAL , "title"
      VARCHAR(255), "body" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

    Executing (default):
      SELECT
        i.relname AS name,
        ix.indisprimary AS primary,
        ix.indisunique AS unique,
        ix.indkey AS indkey,
        array_agg(a.attnum) as column_indexes,
        array_agg(a.attname) AS column_names,
        pg_get_indexdef(ix.indexrelid) AS definition
      FROM pg_class t, pg_class i, pg_index ix, pg_attribute a
        WHERE t.oid = ix.indrelid
        AND i.oid = ix.indexrelid
        AND a.attrelid = t.oid
        AND t.relkind = 'r'
        and t.relname = 'articles'
      GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey
      ORDER BY i.relname;
```

### After performing insert

```sh
Executing (default):
  INSERT INTO "articles" ("id","title","createdAt","updatedAt") VALUES
  (DEFAULT,'demo title','2017-06-26 12:29:08.835 +00:00','2017-06-26 12:29:08.835 +00:00') RETURNING *;
```

### After performing query

```sh
Executing (default):
  SELECT "id", "title", "body", "createdAt", "updatedAt"
  FROM "articles" AS "article"
  WHERE "article"."id" = 2;

  {
    id: 2,
    title: 'demo title',
    body: null,
    createdAt: 2017-06-26T12:34:12.591Z,
    updatedAt: 2017-06-26T12:34:12.591Z
  }
```

## The `article` object

```js
article {
  dataValues: {
    id: 2,
    title: 'demo title',
    body: null,
    createdAt: 2017-06-26T12:34:12.591Z,
    updatedAt: 2017-06-26T12:34:12.591Z
  },
  _previousDataValues: {
    id: 2,
    title: 'demo title',
    body: null,
    createdAt: 2017-06-26T12:34:12.591Z,
    updatedAt: 2017-06-26T12:34:12.591Z
  },
  _changed: {},
  _modelOptions: {
    timestamps: true,
    validate: {},
    freezeTableName: false,
    underscored: false,
    underscoredAll: false,
    paranoid: false,
    rejectOnEmpty: false,
    whereCollection: { id: 2 },
    schema: null,
    schemaDelimiter: '',
    defaultScope: {},
    scopes: [],
    hooks: {},
    indexes: [],
    name: { plural: 'articles', singular: 'article' },
    omitNull: false,
    sequelize:
      Sequelize {
        options: [Object],
        config: [Object],
        dialect: [Object],
        models: [Object],
        modelManager: [Object],
        connectionManager: [Object],
        importCache: {},
        test: [Object],
        queryInterface: [Object]
      },
    uniqueKeys: {},
    hasPrimaryKeys: true
  },
  _options: {
    isNewRecord: false,
    _schema: null,
    _schemaDelimiter: '',
    raw: true,
    attributes: [ 'id', 'title', 'body', 'createdAt', 'updatedAt' ]
  },
  hasPrimaryKeys: true,
  __eagerlyLoadedAssociations: [],
  isNewRecord: false
}
```

## After _forcibly_ dropping table

```sh
Executing (default):
  DROP TABLE IF EXISTS "articles" CASCADE;
Executing (default):
  DROP TABLE IF EXISTS "articles" CASCADE;
Executing (default):
  CREATE TABLE IF NOT EXISTS "articles" (
    "slug" VARCHAR(255) ,
    "title" VARCHAR(255) NOT NULL UNIQUE,
    "body" TEXT DEFAULT 'text here', UNIQUE ("title"),
    PRIMARY KEY ("slug"));
Executing (default):
  SELECT
    i.relname AS name,
    ix.indisprimary AS primary,
    ix.indisunique AS unique,
    ix.indkey AS indkey,
    array_agg(a.attnum) as column_indexes,
    array_agg(a.attname) AS column_names,
    pg_get_indexdef(ix.indexrelid) AS definition
  FROM pg_class t, pg_class i, pg_index ix, pg_attribute a
    WHERE t.oid = ix.indrelid
    AND i.oid = ix.indexrelid
    AND a.attrelid = t.oid
    AND t.relkind = 'r'
    and t.relname = 'articles'
  GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey
  ORDER BY i.relname;
```

## Example of Error message

This would be returned in the event that we are not abiding by the general validation principles set in the model.

```js
connection
  .sync({ force: true })
  .then(() => {
    Article.create({
      title: [1, 2, 3], // defined as type: STRING
      slug: 'wibble',
      body: 'wobble'
    })
  })
  .catch(e => console.log(e))
```

```sh
SequelizeValidationError: string violation: title cannot be an array or
 an object
```

## Validation

This can be obtained using the `validate` key on whatever portion of the model you are wishing to apply custom validation too. Sequelize provides many out-of-the-box validation methods already, but you can create your own as well.

```js
    title: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [10, 150]
      }
```

## After adding validation

```sh
{
  name: 'SequelizeValidationError',
  errors: [
    ValidationErrorItem {
      message: 'Validation len on title failed',
      type: 'Validation error',
      path: 'title',
      value: 'purtty',
      __raw:
        Error: Validation len on title failed
    }
  ]
}
```

## After adding custom error message

```sh
{
  name: 'SequelizeValidationError',
  errors: [
    ValidationErrorItem {
      message: 'Please enter a tile with at least 10 character but no longer than 150.',
      type: 'Validation error',
      path: 'title',
      value: 'purtty',
      __raw:
        Error: Validation len on title failed
    }
  ]
}
```

> NOTE the default behavior of Sequelize says that if a value has `allowNull: true` no validation will be ran on the value; this holds true even if validation has been set for the value in the model definition.

## Custom Validation

```js
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
```

```sh
{
  name: 'SequelizeValidationError',
  errors: [
    ValidationErrorItem {
      message: 'First letter must be a upper case letter',
      type: 'Validation error',
      path: 'body',
      value: 'wobble',
      __raw:
        Error: Validation len on title failed
    }
  ]
}
```


exports.up = function(knex, Promise) {

   return Promise.all([
    knex.schema.createTableIfNotExists('users',function(table){
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('password').notNullable();
  }),
    knex.schema.createTableIfNotExists('meetupinfo',function(table){
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('lat').notNullable();
    table.string('lon').notNullable();
    table.string('user_id').notNullable();
    table.string('time').notNullable();
  })
])
};

exports.down = function(knex, Promise) {
  return Promise.all([
     knex.schema.dropTable('users'),
    knex.schema.dropTable('meetupinfo')
  ])
  
  
 
};

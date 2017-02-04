exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('order_dishes').del(),
    knex('orders').del(),
    knex('dishes').del(),
    knex('owners').del(),
    knex('customers').del()
  ])
    .then(() => {
      return Promise.all([
        knex('customers').insert({
          id: 1,
          full_name: 'Steph Wan',
          email: 'sw@example.com',
          password: '1234',
          phone_number: '416-333-3333',
          billing_info: 'strip_credit_number'
        }),

        knex('owners').insert({
          id: 2,
          full_name: 'Alex Sieban',
          email: 'as@example.com',
          password: '4321',
          phone_number: '416-222-2222',
          address: '46 Spadina Ave - 4th Floor, Toronto, ON M5V 2H8'
        })]).then(() => {
          return Promise.all([
            knex('dishes').insert({
              id: 1,
              dish_name: 'spaghetti',
              dish_description: 'tomato sauce spaghetti with meatballs',
              price: '9',
              owner_id: 2
            }),

            knex('dishes').insert({
              id: 2,
              dish_name: 'tacos',
              dish_description: 'beef tacos',
              price: '5',
              owner_id: 2
            }),

            knex('dishes').insert({
              id: 3,
              dish_name: 'gtchicken',
              dish_description: 'chicken in general tao sauce',
              price: '9',
              owner_id: 2
            }),

            knex('dishes').insert({
              id: 4,
              dish_name: 'ramen',
              dish_description: 'noodles in spicy soup',
              price: '8',
              owner_id: 2
            }),

            knex('dishes').insert({
              id: 5,
              dish_name: 'crab',
              dish_description: 'appetizer crab claws',
              price: '13',
              owner_id: 2
            }),

            knex('dishes').insert({
              id: 6,
              dish_name: 'dessert',
              dish_description: 'strawberries on oreos',
              price: '9',
              owner_id: 2
            }),

            knex('orders').insert({
              id: 4,
              total_cost: '12.50',
              pickup_eta: '20',
              owner_id: 2,
              customer_id: 1
            })

          ])
        }).then(() => {
          return Promise.all([
            knex('order_dishes').insert({
              quantity: 1,
              dish_id: 3,
              order_id: 4
            })
          ])
        })
    })
}
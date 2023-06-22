# Routes and Endpoints

## /users
POST: Create a new user
GET: Get all list of users

## /users/{id}
GET: Get a user by ID
PUT: Update a user by ID
DELETE: Delete a user by ID (cheack if there is any issued book) (is there any fine to be paid)

## users/subscription-details/{id}
GET: get the subscription details
1. date of subscription
2. valid till
3. fine if any

## /books
GET: get all the books
POST: create a new book

## /book/{id}
GET: get a book by id
PUT: update a book by id

## /books/issued/by-user
GET: get all the issued books

## /books/issued/withFine
GET: get all issued books with fine

# Subscription type
Basic   (3 months)
Standard(6 months)
Premium (12 months)

if the subscription date is 01.06.23
and subscription type is standard
the valid till date will be 01.12.23

if a user has an issued book and it is to be returned within 01.11.23, if he/she misses the date of return then he gets a fine of Rs. 100 

if a user has an issued book and it is to be returned within 01.11.23, if he/she misses the date of return and the subscription also expires then he gets a fine of Rs. 200 
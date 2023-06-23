# ----------------------------------
# Postman documentation
https://documenter.getpostman.com/view/23161233/2s93z6cied

# Routes and Endpoints

## /users
POST: Create a new user✅
GET: Get all list of users✅

## /users/{id}
GET: Get a user by ID✅
PUT: Update a user by ID✅
DELETE: Delete a user by ID (cheack if there is any issued book) (is there any fine to be paid)✅

## users/subscription-details/{id}
GET: get the subscription details✅

1.  if subscription Expired
2.  days Left For Subscription Expiration
3.  subscription Expire Fine
4.  late Books Return_ in Days
5.  late Books Return Fine
6.  totalFine

## /books
GET: get all the books✅
POST: create a new book✅

## /book/{id}
GET: get a book by id✅
PUT: update a book by id✅

## /books/issued/by-user✅
GET: get all the issued books✅

## /books/issued/withFine✅
GET: get all issued books with fine
1. issuedBy_name:{user name}
2. issuedBy_surname: {user surname}
3. issuedDate,
4. fineForLateReturn:{true/false}
5. fineForSubscriptionExpiry:{true/false}

# ----------------------------------

# Subscription type
Basic   (3 months)
Standard(6 months)
Premium (12 months)

# ----------------------------------

# Fine
## subscription expiration fine 100/-
(if a user did not return issued book within his subscription period then 
subscription expiration fine will be applied)
## late books return fine 5/- per day
(if a user did not return issued book within specified return date of that 
particular book then after the return date fine of Rs. 5 will be applied 
each day untill the user returns the book  )

# ----------------------------------
# test case
## for a user with -
date format MM/DD/YYYYY,
issuedDate: 04/01/2023,
returnDate: 05/01/2023,
subscriptionType: Basic,
subscriptionDate: 02/01/2023

## his subscription and fine related delails will be as followed -
subscriptionExpired: true,
daysLeftForSubscriptionExpiration: 0,
subscriptionExpireFine: 100,
lateBooksReturn_inDays: 54,
lateBooksReturnFine: 270,
totalFine: 370
User — /api/v1/user
Method	Endpoint	Auth	Description
POST	/signup		Register a new user
POST	/signin		Login and get JWT token
POST	/signin/password		Change password
PATCH	/:super_adminId		Update user role/status (super admin)


 Theatre — /api/v1/theatres
Method	Endpoint	Auth	Description
POST	/		Create a theatre (theatre admin)
GET	/		Get all theatres
GET	/:theatreId		Get a theatre by ID
PATCH	/status		Approve/reject theatre (super admin)
PATCH	/:theatreId/movies/:movieId		Add movie to theatre
PATCH	/:theatreAdminId/:theatreId		Update theatre details
DELETE	/:theatreAdminId/:theatreId		Delete a theatre


 Screen — /api/v1/screen
Method	Endpoint	Auth	Description
POST	/		Create a screen
GET	/:theatreId		Get all screens of a theatre
DELETE	/:screenId		Delete a screen


 Movie — /api/v1/movies
Method	Endpoint	Auth	Description
GET	/		Get all movies
POST	/		Create a movie
GET	/:id		Get movie by ID
DELETE	/:id		Delete a movie


 Show — /api/v1/shows
Method	Endpoint	Auth	Description
GET	/		Get all shows (filterable by query)
POST	/		Create a show
PATCH	/:id		Update a show
DELETE	/:id		Delete a show


 Booking — /api/v1/bookings
Method	Endpoint	Auth	Description
GET	/		Get all bookings
POST	/		Create a booking
GET	/:id		Get booking by ID
PATCH	/:id		Update a booking
POST	/:id/cancel		Cancel a booking


 Payment — /api/v1/payments
Method	Endpoint	Auth	Description
GET	/		Get all payments
POST	/		Create a payment
GET	/:id		Get payment by ID


 Refund — /api/v1/refunds
Method	Endpoint	Auth	Description
GET	/		Get all refunds


Auth header for all  routes:
x-access-token: <your JWT token>
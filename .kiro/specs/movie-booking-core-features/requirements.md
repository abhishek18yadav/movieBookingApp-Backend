# Requirements Document

## Introduction

This feature covers the five core missing capabilities needed to make the movie booking backend
production-ready. The existing codebase has auth, theatre management, screen/seat layout, movie
catalog, shows, bookings, and payments — but several critical gaps prevent end-to-end flows from
working: missing route registrations, a broken booking schema, no mechanism to release locked seats,
no cancellation/refund flow, and a flat pricing model that ignores seat types. These requirements
address each gap in a cohesive, consistent way.

---

## Glossary

- **API_Router**: The Express v1 router (`v1Router.js`) that mounts all feature sub-routers.
- **Booking**: A Mongoose document representing a user's intent to purchase seats for a Show.
- **Booking_Service**: The service layer module (`services/booking.js`) that contains booking business logic.
- **Cancellation_Service**: The new service layer module responsible for cancellation and refund logic.
- **Cron_Job**: A scheduled background task that runs at a fixed interval inside the Node.js process.
- **EndUser**: A registered user with role `endUser` who browses movies and purchases tickets.
- **Expiry_Window**: The 5-minute period after a Booking is created within which payment must be completed.
- **Lock_Window**: The 10-minute period after seats are locked within which payment must be completed before seats are auto-released.
- **Payment**: A Mongoose document recording a payment attempt linked to a Booking.
- **Payment_Service**: The service layer module (`services/payment.js`) that contains payment business logic.
- **Refund**: A separate MongoDB document (in its own `refunds` collection) indicating that a cancelled booking's amount should be returned to the user. Fields: `bookingId` (ref: Booking), `userId` (ref: User), `amount`, `status` (`pending`/`processed`/`failed`), and timestamps.
- **Seat**: An individual seat entry inside a Show's `seatConfiguration` array with fields `row`, `number`, `type`, and `status`.
- **Seat_Status**: The lifecycle state of a Seat — one of `available`, `locked`, or `booked`.
- **Seat_Type**: The category of a Seat — one of `regular`, `premium`, or `recliner`.
- **Show**: A Mongoose document representing a scheduled screening of a Movie at a Screen.
- **Show_Service**: The service layer module (`services/show.js`) that contains show business logic.
- **Super_Admin**: A registered user with role `super_admin` who manages the platform.
- **Theatre_Admin**: A registered user with role `theatre_admin` who manages theatres and shows.
- **Ticket_Price**: The price charged per seat, which varies by Seat_Type for a given Show.

---

## Requirements

### Requirement 1: Register Missing API Routes

**User Story:** As an EndUser or Theatre_Admin, I want all booking, payment, movie, and show
endpoints to be reachable via the API, so that I can interact with the full feature set of the
application.

#### Acceptance Criteria

1. THE API_Router SHALL mount a movie sub-router at the `/movies` path.
2. THE API_Router SHALL mount a show sub-router at the `/shows` path.
3. THE API_Router SHALL mount a booking sub-router at the `/bookings` path.
4. THE API_Router SHALL mount a payment sub-router at the `/payments` path.
5. WHEN a request is made to `/api/v1/movies`, `/api/v1/shows`, `/api/v1/bookings`, or `/api/v1/payments`, THE API_Router SHALL route the request to the corresponding controller without returning a 404 response.
6. THE API_Router SHALL apply the `isAuthenticated` middleware to all booking and payment routes that create or modify resources.

---

### Requirement 2: Fix Booking Schema — Add `showId` Field

**User Story:** As a developer, I want the Booking schema to include a `showId` reference, so that
every Booking is traceable to the Show it belongs to and the Booking_Service can function correctly.

#### Acceptance Criteria

1. THE Booking SHALL include a `showId` field of type `ObjectId` that references the `Show` collection.
2. THE Booking SHALL require `showId` to be present on every new document.
3. WHEN a Booking is created without a `showId`, THE Booking_Service SHALL return a validation error with a descriptive message.
4. WHEN a Booking is retrieved, THE Booking_Service SHALL be able to populate the `showId` field with the referenced Show document.

---

### Requirement 3: Seat Lock Expiry — Auto-Release Locked Seats

**User Story:** As a Theatre_Admin, I want locked seats to be automatically released if the user
does not complete payment within 10 minutes, so that seats are not permanently held by incomplete
bookings.

#### Acceptance Criteria

1. THE Cron_Job SHALL run at an interval of no more than 1 minute.
2. WHEN the Cron_Job runs, THE Cron_Job SHALL query all Bookings with status `processing` whose `createdAt` timestamp is older than the Lock_Window (10 minutes).
3. WHEN an expired Booking is found, THE Cron_Job SHALL set the Booking's status to `expired`.
4. WHEN an expired Booking is found, THE Cron_Job SHALL set the `status` of each Seat in the associated Show's `seatConfiguration` that matches the Booking's `seats` array back to `available`.
5. WHEN an expired Booking is found, THE Cron_Job SHALL save both the updated Booking and the updated Show to the database atomically within the same operation sequence.
6. IF the Cron_Job encounters an error while processing a single Booking, THEN THE Cron_Job SHALL log the error and continue processing the remaining expired Bookings without stopping.
7. THE Cron_Job SHALL start automatically when the application server starts.

---

### Requirement 4: Cancellation and Refund Flow

**User Story:** As an EndUser, I want to cancel a confirmed booking and receive a refund, so that I
can recover my money when my plans change, subject to the theatre's cancellation policy.

#### Acceptance Criteria

1. WHEN an EndUser requests cancellation of a Booking, THE Cancellation_Service SHALL verify that the requesting user is the owner of the Booking.
2. WHEN an EndUser requests cancellation of a Booking with status other than `successfull`, THE Cancellation_Service SHALL return an error indicating the Booking is not eligible for cancellation.
3. WHEN an EndUser requests cancellation of a Booking, THE Cancellation_Service SHALL retrieve the associated Show and check the show's `timming` field.
4. WHEN the current time is within 30 minutes of the Show's start time, THE Cancellation_Service SHALL reject the cancellation request with a descriptive error message.
5. WHEN a cancellation is approved, THE Cancellation_Service SHALL set each Seat in the Show's `seatConfiguration` that matches the Booking's `seats` array back to `available`.
6. WHEN a cancellation is approved, THE Cancellation_Service SHALL increment the Show's `noOfSeats` by the number of seats in the Booking.
7. WHEN a cancellation is approved, THE Cancellation_Service SHALL set the Booking's status to `cancelled`.
8. WHEN a cancellation is approved, THE Cancellation_Service SHALL create a Refund document in the `refunds` collection containing: `bookingId` (ObjectId ref to Booking), `userId` (ObjectId ref to User), `amount` (equal to the Booking's `totalCost`), and `status` set to `pending`.
9. THE Cancellation_Service SHALL save all changes — Booking, Show, and Refund — before returning a success response.
10. WHEN a Super_Admin queries refunds, THE API_Router SHALL provide an endpoint to list all Refund records.

---

### Requirement 5: Per-Seat-Type Pricing

**User Story:** As a Theatre_Admin, I want to set different prices for regular, premium, and
recliner seats when creating a Show, so that the booking cost accurately reflects the seat category
chosen by the EndUser.

#### Acceptance Criteria

1. THE Show SHALL replace the single `price` field with a `ticketPrices` map containing keys `regular`, `premium`, and `recliner`, each holding a positive numeric value.
2. WHEN a Theatre_Admin creates a Show without providing all three Seat_Type prices, THE Show_Service SHALL return a validation error listing the missing price keys.
3. WHEN a Booking is created, THE Booking_Service SHALL calculate `totalCost` by summing the Ticket_Price for each selected Seat's `type` from the Show's `ticketPrices` map.
4. WHEN a Booking is created with a Seat whose `type` is not present in the Show's `ticketPrices` map, THE Booking_Service SHALL return an error indicating the seat type has no configured price.
5. WHEN a Payment is verified, THE Payment_Service SHALL compare the payment `amount` against the Booking's `totalCost` (which was computed using per-type pricing) to determine payment success or failure.
6. WHEN a Show is updated with new `ticketPrices`, THE Show_Service SHALL only allow the update if no Bookings with status `successfull` or `processing` exist for that Show.

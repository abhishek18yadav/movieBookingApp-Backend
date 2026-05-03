# Implementation Plan: Movie Booking Core Features

## Overview

Five tightly-coupled changes that close the critical gaps in the movie booking backend. They are
implemented in dependency order: schema fixes first (other tasks depend on correct models), then
route registration (makes endpoints reachable), then the cron job (depends on the fixed booking
schema), then cancellation/refund (depends on routes + schema), and finally per-seat-type pricing
(touches booking service, show schema, and show service). Testing infrastructure is set up in the
first task so property-based tests can be added alongside each feature.

---

## Tasks

- [x] 1. Set up testing infrastructure
  - Install `vitest@2.1.9` and `fast-check@3.22.0` as devDependencies in `package.json`
  - Add `"test": "vitest --run"` to the `scripts` section of `package.json`
  - Create `movieBookingApp-Backend/vitest.config.js` with ESM-compatible config (no transform needed — project already uses `"type": "module"`)
  - Create `src/tests/` directory with a placeholder `src/tests/.gitkeep` so the folder is tracked
  - _Requirements: Testing setup for all 5 features_

- [x] 2. Fix Booking schema — add `showId` field
  - [x] 2.1 Add `showId` to `src/schema/booking.js`
    - Insert `showId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Show' }` into the schema definition
    - Place it as the first field (before `theatreId`) for readability
    - _Requirements: 2.1, 2.2_

  - [ ]* 2.2 Write unit test for Booking schema `showId` validation
    - Create `src/tests/schema/booking.test.js`
    - Test: instantiating a Booking without `showId` triggers a Mongoose `ValidationError`
    - Test: a Booking with a valid ObjectId `showId` passes validation
    - _Requirements: 2.3_

- [x] 3. Per-seat-type pricing — Show schema and service changes
  - [x] 3.1 Replace `price` with `ticketPrices` in `src/schema/show.js`
    - Remove the `price: { type: Number, required: true }` field
    - Add `ticketPrices: { regular: { type: Number, required: true, min: 0 }, premium: { type: Number, required: true, min: 0 }, recliner: { type: Number, required: true, min: 0 } }`
    - _Requirements: 5.1_

  - [x] 3.2 Add `ticketPrices` validation to `createShowService` in `src/services/show.js`
    - Before calling `showRepository.create`, check that `data.ticketPrices` contains all three keys (`regular`, `premium`, `recliner`)
    - If any key is missing, throw a `clientError` with status 400 and message `"Missing ticket prices for: [list of missing keys]"`
    - _Requirements: 5.2_

  - [x] 3.3 Add active-booking guard to `updateShowService` in `src/services/show.js`
    - Import `bookingRepository` at the top of `src/services/show.js`
    - Before applying the update, if `data.ticketPrices` is present, query `bookingRepository.getAll({ showId: showId, status: { $in: ['successfull', 'processing'] } })`
    - If any active bookings exist, throw a `clientError` with status 409 and message `"Cannot update prices while active bookings exist"`
    - _Requirements: 5.6_

  - [x] 3.4 Update `createBookingService` in `src/services/booking.js` to use per-type pricing
    - Replace `data.totalCost = selectedSeats.length * show.price` with a `reduce` that looks up `show.ticketPrices[foundSeat.type]` for each seat
    - If a seat's type is not present in `ticketPrices`, throw a `clientError` with status 400 and message `"No price configured for seat type: ${foundSeat.type}"`
    - _Requirements: 5.3, 5.4_

  - [ ]* 3.5 Write property test for per-seat-type cost calculation
    - Create `src/tests/services/booking.property.test.js`
    - **Property 8: Per-seat-type total cost calculation**
    - **Validates: Requirements 5.3**
    - Use `fc.array(fc.record({ row: fc.string(), number: fc.integer(), type: fc.constantFrom('regular', 'premium', 'recliner') }))` for seat arrays
    - Use `fc.record({ regular: fc.float({ min: 0 }), premium: fc.float({ min: 0 }), recliner: fc.float({ min: 0 }) })` for `ticketPrices`
    - Assert: computed `totalCost` equals `seats.reduce((sum, s) => sum + ticketPrices[s.type], 0)`

  - [ ]* 3.6 Write property test for active bookings blocking price update
    - Add to `src/tests/services/show.property.test.js`
    - **Property 10: Active bookings block ticket price updates**
    - **Validates: Requirements 5.6**
    - Mock `bookingRepository.getAll` to return at least one booking with status `'successfull'` or `'processing'`
    - Assert: `updateShowService` throws a `clientError` with status 409

- [x] 4. Checkpoint — schema and pricing changes
  - Ensure all tests written so far pass: `npm test`
  - Verify `src/schema/booking.js` has `showId` and `src/schema/show.js` has `ticketPrices` (no `price`)
  - Ask the user if any questions arise before continuing.

- [x] 5. Register missing routes
  - [x] 5.1 Fix broken import path in `src/controllers/show.js`
    - Change `from "../services/showService.js"` to `from "../services/show.js"` (four import names: `createShowService`, `deleteShowService`, `getShowsService`, `updateShowService`)
    - _Requirements: 1.5_

  - [x] 5.2 Create `src/controllers/movie.js`
    - Export `createMovieController`, `getMoviesController`, `getMovieByIdController`, `deleteMovieController`
    - Each controller extracts `req.user` (for auth-protected routes), calls the corresponding service from `src/services/movie.js`, and returns a JSON response using the `successResponse` / `customErrorResponse` / `internalErrorResponse` helpers from `src/utils/common/responseObjects.js`
    - _Requirements: 1.1, 1.5_

  - [x] 5.3 Create `src/controllers/booking.js`
    - Export `createBookingController`, `getAllBookingsController`, `getBookingByIdController`, `updateBookingController`
    - Wire each to the corresponding service already in `src/services/booking.js`
    - Leave a stub export `cancelBookingController` (to be implemented in task 7) that returns 501 for now
    - _Requirements: 1.3, 1.5, 1.6_

  - [x] 5.4 Create `src/controllers/payment.js`
    - Export `createPaymentController`, `getAllPaymentsController`, `getPaymentByIdController`
    - Wire each to the corresponding service in `src/services/payment.js`
    - _Requirements: 1.4, 1.5, 1.6_

  - [x] 5.5 Create `src/controllers/refund.js`
    - Export `getAllRefundsController` (stub — returns empty array until refund repo exists; will be completed in task 7)
    - _Requirements: 4.10_

  - [x] 5.6 Create `src/Routes/v1/movie.js`
    - `GET /` → `getMoviesController` (no auth)
    - `POST /` → `isAuthenticated`, `createMovieController`
    - `GET /:id` → `getMovieByIdController` (no auth)
    - `DELETE /:id` → `isAuthenticated`, `deleteMovieController`
    - _Requirements: 1.1, 1.5_

  - [x] 5.7 Create `src/Routes/v1/show.js`
    - `GET /` → `getShowsController` (no auth)
    - `POST /` → `isAuthenticated`, `createShowController`
    - `PATCH /:id` → `isAuthenticated`, `updateShowController`
    - `DELETE /:id` → `isAuthenticated`, `deleteShowController`
    - _Requirements: 1.2, 1.5_

  - [x] 5.8 Create `src/Routes/v1/booking.js`
    - `GET /` → `isAuthenticated`, `getAllBookingsController`
    - `POST /` → `isAuthenticated`, `createBookingController`
    - `GET /:id` → `isAuthenticated`, `getBookingByIdController`
    - `PATCH /:id` → `isAuthenticated`, `updateBookingController`
    - `POST /:id/cancel` → `isAuthenticated`, `cancelBookingController`
    - _Requirements: 1.3, 1.5, 1.6_

  - [x] 5.9 Create `src/Routes/v1/payment.js`
    - `GET /` → `isAuthenticated`, `getAllPaymentsController`
    - `POST /` → `isAuthenticated`, `createPaymentController`
    - `GET /:id` → `isAuthenticated`, `getPaymentByIdController`
    - _Requirements: 1.4, 1.5, 1.6_

  - [x] 5.10 Create `src/Routes/v1/refund.js`
    - `GET /` → `isAuthenticated`, `getAllRefundsController`
    - _Requirements: 4.10_

  - [x] 5.11 Mount all new sub-routers in `src/Routes/v1/v1Router.js`
    - Import `movieRouter`, `showRouter`, `bookingRouter`, `paymentRouter`, `refundRouter`
    - Add: `router.use('/movies', movieRouter)`, `router.use('/shows', showRouter)`, `router.use('/bookings', bookingRouter)`, `router.use('/payments', paymentRouter)`, `router.use('/refunds', refundRouter)`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 6. Seat lock expiry cron job
  - [x] 6.1 Install `node-cron` dependency
    - Run `npm install node-cron@3.0.3` in `movieBookingApp-Backend/`
    - _Requirements: 3.1_

  - [x] 6.2 Create `src/jobs/seatLockExpiry.js`
    - Import `cron` from `node-cron`, `bookingRepository` from `../repositiories/booking.js`, `showRepository` from `../repositiories/show.js`
    - Schedule `'* * * * *'` (every 1 minute)
    - Inside the job: calculate `cutoff = new Date(Date.now() - 10 * 60 * 1000)`; query `bookingRepository.getAll({ status: 'processing', createdAt: { $lt: cutoff } })`
    - For each expired booking: fetch show by `booking.showId`; for each seat in `booking.seats`, find matching seat in `show.seatConfiguration` (match `row` and `number`) and set `status = 'available'`; set `booking.status = 'expired'`; call `show.save()` then `booking.save()`
    - Wrap each booking's processing in try/catch — on error, `console.error` and `continue`
    - Log a summary: `console.log(\`Seat lock expiry: expired \${count} bookings\`)`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 6.3 Import the cron job in `src/index.js`
    - Add `import './jobs/seatLockExpiry.js';` near the top of `src/index.js` (after other imports)
    - _Requirements: 3.7_

  - [ ]* 6.4 Write property test for expiry selection logic
    - Create `src/tests/jobs/seatLockExpiry.property.test.js`
    - Extract the expiry filtering logic into a pure helper function `isExpiredBooking(booking, cutoff)` inside `seatLockExpiry.js` and export it for testing
    - **Property 1: Expiry selects and marks only stale processing bookings**
    - **Validates: Requirements 3.2, 3.3**
    - Use `fc.array(fc.record({ status: fc.constantFrom('processing', 'cancelled', 'successfull', 'expired'), createdAt: fc.date() }))` for booking arrays
    - Assert: only bookings with `status === 'processing'` AND `createdAt < cutoff` are selected

  - [ ]* 6.5 Write property test for seat release after expiry
    - Add to `src/tests/jobs/seatLockExpiry.property.test.js`
    - Extract seat-release logic into a pure helper `releaseSeats(seatConfiguration, bookedSeats)` and export it
    - **Property 2: Expiry releases all seats of expired bookings**
    - **Validates: Requirements 3.4**
    - Use `fc.array(fc.record({ row: fc.string(), number: fc.integer(), status: fc.constantFrom('locked', 'booked', 'available') }))` for `seatConfiguration`
    - Use a subset of those seats as `booking.seats`
    - Assert: every seat whose `row`+`number` matches an entry in `booking.seats` has `status === 'available'` after `releaseSeats` runs

  - [ ]* 6.6 Write property test for expiry error isolation
    - Add to `src/tests/jobs/seatLockExpiry.property.test.js`
    - **Property 3: Expiry error isolation**
    - **Validates: Requirements 3.6**
    - Use `fc.integer({ min: 2, max: 10 })` for N expired bookings; make one randomly-chosen booking throw during processing
    - Assert: the remaining N-1 bookings are still processed (their `status` is set to `'expired'`)

- [x] 7. Cancellation and Refund flow
  - [x] 7.1 Create `src/schema/refund.js`
    - Define `refundSchema` with fields: `bookingId` (ObjectId, required, ref: 'Booking'), `userId` (ObjectId, required, ref: 'User'), `amount` (Number, required), `status` (String, enum: ['pending', 'processed', 'failed'], default: 'pending'), and `{ timestamps: true }`
    - Export `Refund` model as default
    - _Requirements: 4.8_

  - [x] 7.2 Create `src/repositiories/refund.js`
    - Import `Refund` from `../schema/refund.js` and `crudRepository` from `./crudRepository.js`
    - Export `refundRepository = { ...crudRepository(Refund) }` as default
    - _Requirements: 4.8_

  - [x] 7.3 Implement `cancelBookingService` in `src/services/booking.js`
    - Import `refundRepository` from `../repositiories/refund.js` and `showRepository` from `../repositiories/show.js` (already imported)
    - Implement the algorithm from the design:
      1. Fetch booking by `bookingId` → 404 if not found
      2. Ownership check: `booking.userId.toString() !== userId.toString()` → 403 `"Unauthorized: you do not own this booking"`
      3. Status check: `booking.status !== 'successfull'` → 400 `"Booking is not eligible for cancellation"`
      4. Fetch show by `booking.showId` → 404 if not found
      5. Time check: `show.timming - Date.now() < 30 * 60 * 1000` → 400 `"Cannot cancel within 30 minutes of show time"`
      6. Release seats: set matching seats in `show.seatConfiguration` to `'available'`
      7. `show.noOfSeats += booking.noOfSeats`
      8. `booking.status = 'cancelled'`
      9. Create refund: `{ bookingId: booking._id, userId: booking.userId, amount: booking.totalCost, status: 'pending' }`
      10. `await show.save()`, `await booking.save()`, `await refundRepository.create(refundData)`
      11. Return `{ booking, refund }`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [x] 7.4 Implement `cancelBookingController` in `src/controllers/booking.js`
    - Replace the 501 stub from task 5.3 with a real implementation
    - Extract `bookingId` from `req.params.id` and `userId` from `req.user`
    - Call `cancelBookingService(bookingId, userId)` and return the result with status 200
    - Handle errors using `customErrorResponse` / `internalErrorResponse`
    - _Requirements: 4.1–4.9_

  - [x] 7.5 Implement `getAllRefundsController` in `src/controllers/refund.js`
    - Replace the stub from task 5.5 with a real implementation that calls `refundRepository.getAll({})`
    - Return the list with status 200
    - _Requirements: 4.10_

  - [ ]* 7.6 Write property test for cancellation ownership guard
    - Create `src/tests/services/cancellation.property.test.js`
    - **Property 4: Cancellation ownership guard**
    - **Validates: Requirements 4.1**
    - Use `fc.string()` for `userId` and `fc.string()` for `booking.userId`, filtered so they are never equal
    - Assert: `cancelBookingService` throws a `clientError` with status 403

  - [ ]* 7.7 Write property test for cancellation status guard
    - Add to `src/tests/services/cancellation.property.test.js`
    - **Property 5: Cancellation status guard**
    - **Validates: Requirements 4.2**
    - Use `fc.constantFrom('processing', 'cancelled', 'expired')` for `booking.status`
    - Assert: `cancelBookingService` throws a `clientError` with status 400

  - [ ]* 7.8 Write property test for cancellation time cutoff guard
    - Add to `src/tests/services/cancellation.property.test.js`
    - **Property 6: Cancellation time cutoff guard**
    - **Validates: Requirements 4.4**
    - Use `fc.integer({ min: 0, max: 29 })` for minutes-until-show (i.e., show time is within 30 min)
    - Assert: `cancelBookingService` throws a `clientError` with status 400

  - [ ]* 7.9 Write property test for approved cancellation state consistency
    - Add to `src/tests/services/cancellation.property.test.js`
    - **Property 7: Approved cancellation produces consistent state**
    - **Validates: Requirements 4.5, 4.6, 4.7, 4.8**
    - Generate a valid booking (owner match, status=`'successfull'`, show time > 30 min away) with random seats
    - After `cancelBookingService` completes, assert all four invariants:
      - Every matched seat in `seatConfiguration` has `status === 'available'`
      - `show.noOfSeats` equals pre-cancellation value plus `booking.noOfSeats`
      - `booking.status === 'cancelled'`
      - Refund document has correct `bookingId`, `userId`, `amount`, and `status === 'pending'`

- [ ] 8. Payment service — property tests
  - [ ]* 8.1 Write property test for payment outcome determination
    - Create `src/tests/services/payment.property.test.js`
    - **Property 9: Payment outcome determined by amount vs totalCost**
    - **Validates: Requirements 5.5**
    - Use `fc.float({ min: 0 })` for `payment.amount` and `fc.float({ min: 0 })` for `booking.totalCost`
    - Assert: payment status is `'success'` if and only if `payment.amount === booking.totalCost`, and `'failed'` otherwise

- [x] 9. Final checkpoint — wire everything together and verify
  - Ensure `src/index.js` imports `./jobs/seatLockExpiry.js`
  - Ensure `v1Router.js` mounts all five new sub-routers
  - Run `npm test` — all tests must pass
  - Verify no ESM import errors by checking that all new files use `import`/`export` syntax (project uses `"type": "module"`)
  - Ask the user if any questions arise before considering the feature complete.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 4 and 9) ensure incremental validation
- Property tests validate universal correctness properties across random inputs (min 100 iterations each)
- Unit tests validate specific examples and edge cases
- The project uses ESM (`"type": "module"`) — all new files must use `import`/`export`, not `require`/`module.exports`
- The `repositiories` directory name has a typo (double `i`) — match it exactly in all new imports
- `show.js` repository imports from `'../schema/Show.js'` (capital S) — keep this as-is to avoid breaking the existing import

import cron from 'node-cron';

import bookingRepository from '../repositiories/booking.js';
import showRepository from '../repositiories/show.js';

// Pure helper — exported for testing (Property 1)
export const isExpiredBooking = (booking, cutoff) => {
    return booking.status === 'processing' && booking.createdAt < cutoff;
};

// Pure helper — exported for testing (Property 2)
export const releaseSeats = (seatConfiguration, bookedSeats) => {
    for (const seat of bookedSeats) {
        const found = seatConfiguration.find(
            s => s.row === seat.row && s.number === seat.number
        );
        if (found) {
            found.status = 'available';
        }
    }
    return seatConfiguration;
};

// Cron job: runs every minute
cron.schedule('* * * * *', async () => {
    try {
        const cutoff = new Date(Date.now() - 10 * 60 * 1000);
        const expiredBookings = await bookingRepository.getAll({
            status: 'processing',
            createdAt: { $lt: cutoff }
        });

        let count = 0;

        for (const booking of expiredBookings) {
            try {
                const show = await showRepository.getById(booking.showId);
                if (!show) {
                    console.error(`Seat lock expiry: show not found for booking ${booking._id}`);
                    continue;
                }

                releaseSeats(show.seatConfiguration, booking.seats);
                booking.status = 'expired';

                await show.save();
                await booking.save();
                count++;
            } catch (err) {
                console.error(`Seat lock expiry: error processing booking ${booking._id}:`, err);
            }
        }

        console.log(`Seat lock expiry: expired ${count} bookings`);
    } catch (err) {
        console.error('Seat lock expiry: fatal error in cron job:', err);
    }
});

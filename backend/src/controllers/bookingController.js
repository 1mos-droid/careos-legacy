const { dbQuery } = require('../config/db');

exports.createBooking = async (req, res) => {
  const { nurse_id, start_date, end_date, hours_per_day } = req.body;
  const userId = req.user.id;

  try {
    // 1. Fetch nurse details and verify existence
    const nurse = await dbQuery.get(
      `SELECT n.id, n.hourly_rate, u.name 
       FROM nurses n
       INNER JOIN users u ON n.user_id = u.id
       WHERE n.id = ?`,
      [nurse_id]
    );

    if (!nurse) {
      return res.status(404).json({ error: 'Caregiver profile not found.' });
    }

    // 2. Calculate days inclusive
    const start = new Date(start_date);
    const end = new Date(end_date);
    
    const diffTime = end - start;
    if (diffTime < 0) {
      return res.status(400).json({ error: 'End date cannot be prior to start date.' });
    }

    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = daysCount * hours_per_day * nurse.hourly_rate;

    // 3. Create reservation in SQLite
    const result = await dbQuery.run(
      `INSERT INTO bookings (user_id, nurse_id, start_date, end_date, hours_per_day, total_price, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, nurse_id, start_date, end_date, hours_per_day, totalPrice]
    );

    return res.status(201).json({
      message: 'Booking request created successfully.',
      booking: {
        id: result.lastID,
        user_id: userId,
        nurse_id,
        start_date,
        end_date,
        hours_per_day,
        total_price: totalPrice,
        status: 'pending'
      }
    });

  } catch (err) {
    console.error('❌ Create booking error:', err);
    return res.status(500).json({ error: 'Internal server error processing care request.' });
  }
};

exports.getBookings = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let bookings = [];

    if (role === 'family') {
      bookings = await dbQuery.all(
        `SELECT b.*, u.name AS nurse_name, n.avatar_url AS nurse_avatar, n.specialties AS nurse_specialties
         FROM bookings b
         INNER JOIN nurses n ON b.nurse_id = n.id
         INNER JOIN users u ON n.user_id = u.id
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC`,
        [userId]
      );
    } else if (role === 'nurse') {
      const nurseProfile = await dbQuery.get('SELECT id FROM nurses WHERE user_id = ?', [userId]);
      if (!nurseProfile) {
        return res.status(200).json([]);
      }

      bookings = await dbQuery.all(
        `SELECT b.*, u.name AS client_name, u.email AS client_email
         FROM bookings b
         INNER JOIN users u ON b.user_id = u.id
         WHERE b.nurse_id = ?
         ORDER BY b.created_at DESC`,
        [nurseProfile.id]
      );
    }

    return res.status(200).json(bookings);
  } catch (err) {
    console.error('❌ Get bookings error:', err);
    return res.status(500).json({ error: 'Internal server error retrieving schedules.' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const booking = await dbQuery.get('SELECT * FROM bookings WHERE id = ?', [id]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking reservation not found.' });
    }

    if (role === 'family') {
      if (booking.user_id !== userId) {
        return res.status(403).json({ error: 'Access denied. You do not own this booking.' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ error: 'Family clients can only cancel care bookings.' });
      }
    } else if (role === 'nurse') {
      const nurseProfile = await dbQuery.get('SELECT id FROM nurses WHERE user_id = ?', [userId]);
      if (!nurseProfile || booking.nurse_id !== nurseProfile.id) {
        return res.status(403).json({ error: 'Access denied. This care request is not assigned to you.' });
      }
      if (status === 'cancelled') {
        return res.status(400).json({ error: 'Caregivers cannot set bookings to cancelled. Use decline or contact support.' });
      }
    }

    await dbQuery.run('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    return res.status(200).json({
      message: `Booking status updated to ${status} successfully.`,
      bookingId: id,
      status
    });

  } catch (err) {
    console.error('❌ Update booking status error:', err);
    return res.status(500).json({ error: 'Internal server error updating booking state.' });
  }
};

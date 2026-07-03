const { dbQuery } = require('../config/db');

exports.createReview = async (req, res) => {
  const { booking_id, rating, comment } = req.body;
  const userId = req.user.id;

  if (!booking_id || !rating || !comment) {
    return res.status(400).json({ error: 'All fields (booking_id, rating, comment) are required.' });
  }

  const score = parseInt(rating);
  if (isNaN(score) || score < 1 || score > 5) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
  }

  try {
    // 1. Fetch and validate booking
    const booking = await dbQuery.get('SELECT * FROM bookings WHERE id = ?', [booking_id]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking reservation not found.' });
    }

    if (booking.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied. You do not own this booking.' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'You can only leave reviews on completed care schedules.' });
    }

    if (booking.has_reviewed === 1) {
      return res.status(400).json({ error: 'You have already submitted a testimonial for this care booking.' });
    }

    // 2. Register review inside SQLite
    await dbQuery.run(
      `INSERT INTO reviews (booking_id, user_id, nurse_id, rating, comment) 
       VALUES (?, ?, ?, ?, ?)`,
      [booking_id, userId, booking.nurse_id, score, comment]
    );

    // 3. Mark booking as reviewed
    await dbQuery.run('UPDATE bookings SET has_reviewed = 1 WHERE id = ?', [booking_id]);

    // 4. Recalculate average star rating for the nurse
    const stats = await dbQuery.get(
      'SELECT AVG(rating) AS avg_rating FROM reviews WHERE nurse_id = ?',
      [booking.nurse_id]
    );

    const roundedRating = stats.avg_rating ? parseFloat(stats.avg_rating.toFixed(1)) : 5.0;

    await dbQuery.run(
      'UPDATE nurses SET rating = ? WHERE id = ?',
      [roundedRating, booking.nurse_id]
    );

    return res.status(201).json({
      message: 'Thank you! Your testimonial has been posted successfully.',
      review: {
        booking_id,
        user_id: userId,
        nurse_id: booking.nurse_id,
        rating: score,
        comment,
        new_nurse_rating: roundedRating
      }
    });

  } catch (err) {
    console.error('❌ Create review error:', err);
    return res.status(500).json({ error: 'Internal server error posting rating feedback.' });
  }
};

exports.getNurseReviews = async (req, res) => {
  const { id } = req.params; // nurse_id

  try {
    const reviews = await dbQuery.all(
      `SELECT r.*, u.name AS client_name
       FROM reviews r
       INNER JOIN users u ON r.user_id = u.id
       WHERE r.nurse_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    return res.status(200).json(reviews);
  } catch (err) {
    console.error('❌ Get nurse reviews error:', err);
    return res.status(500).json({ error: 'Internal server error fetching testimonial records.' });
  }
};

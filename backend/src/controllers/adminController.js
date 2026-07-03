const { dbQuery } = require('../config/db');

exports.getPendingNurses = async (req, res) => {
  try {
    const nurses = await dbQuery.all(
      `SELECT n.*, u.name, u.email 
       FROM nurses n
       INNER JOIN users u ON n.user_id = u.id
       WHERE n.verification_status = 'under_review' OR n.verification_status = 'pending'
       ORDER BY n.created_at ASC`
    );
    return res.status(200).json(nurses);
  } catch (err) {
    console.error('❌ Get pending nurses error:', err);
    return res.status(500).json({ error: 'Internal server error retrieving pending registry.' });
  }
};

exports.verifyNurse = async (req, res) => {
  const { id } = req.params;
  const { status, rejection_reason } = req.body;

  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be verified or rejected.' });
  }

  try {
    await dbQuery.run(
      'UPDATE nurses SET verification_status = ?, rejection_reason = ? WHERE id = ?',
      [status, rejection_reason || null, id]
    );
    return res.status(200).json({ message: `Nurse status updated to ${status} successfully.` });
  } catch (err) {
    console.error('❌ Verify nurse error:', err);
    return res.status(500).json({ error: 'Internal server error updating verification status.' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userCount = await dbQuery.get('SELECT COUNT(*) as count FROM users');
    const nurseCount = await dbQuery.get('SELECT COUNT(*) as count FROM nurses WHERE verification_status = "verified"');
    const pendingCount = await dbQuery.get('SELECT COUNT(*) as count FROM nurses WHERE verification_status = "under_review"');
    const bookingCount = await dbQuery.get('SELECT COUNT(*) as count FROM bookings');

    return res.status(200).json({
      totalUsers: userCount.count,
      verifiedNurses: nurseCount.count,
      pendingVerifications: pendingCount.count,
      totalBookings: bookingCount.count
    });
  } catch (err) {
    console.error('❌ Get admin stats error:', err);
    return res.status(500).json({ error: 'Internal server error retrieving dashboard stats.' });
  }
};

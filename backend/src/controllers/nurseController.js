const { dbQuery } = require('../config/db');

exports.getAllNurses = async (req, res) => {
  const { specialty, maxRate, availability } = req.query;

  let query = `
    SELECT n.id, n.user_id, u.name, u.email, n.specialties, n.hourly_rate, 
           n.availability, n.experience_years, n.avatar_url, n.rating, n.created_at
    FROM nurses n
    INNER JOIN users u ON n.user_id = u.id
    WHERE n.verification_status = 'verified'
  `;
  const params = [];

  if (specialty) {
    query += ' AND n.specialties LIKE ?';
    params.push(`%${specialty}%`);
  }

  if (maxRate) {
    query += ' AND n.hourly_rate <= ?';
    params.push(parseFloat(maxRate));
  }

  if (availability) {
    query += ' AND n.availability = ?';
    params.push(availability);
  }

  try {
    const nurses = await dbQuery.all(query, params);
    return res.status(200).json(nurses);
  } catch (err) {
    console.error('❌ Get all nurses error:', err);
    return res.status(500).json({ error: 'Internal server error fetching registry.' });
  }
};

exports.getNurseById = async (req, res) => {
  const { id } = req.params;

  try {
    const nurse = await dbQuery.get(
      `SELECT n.id, n.user_id, u.name, u.email, n.specialties, n.hourly_rate, 
              n.availability, n.experience_years, n.avatar_url, n.rating, n.created_at, n.verification_status
       FROM nurses n
       INNER JOIN users u ON n.user_id = u.id
       WHERE n.id = ? AND n.verification_status = 'verified'`,
      [id]
    );

    if (!nurse) {
      return res.status(404).json({ error: 'Nurse profile not found or not yet verified.' });
    }

    return res.status(200).json(nurse);
  } catch (err) {
    console.error('❌ Get nurse by id error:', err);
    return res.status(500).json({ error: 'Internal server error fetching caregiver details.' });
  }
};

exports.getNurseProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const nurse = await dbQuery.get(
      `SELECT n.*, u.name, u.email 
       FROM nurses n
       INNER JOIN users u ON n.user_id = u.id
       WHERE n.user_id = ?`,
      [userId]
    );

    if (!nurse) {
      return res.status(404).json({ error: 'Clinical profile not found for this user.' });
    }

    return res.status(200).json(nurse);
  } catch (err) {
    console.error('❌ Get nurse profile error:', err);
    return res.status(500).json({ error: 'Internal server error fetching nurse workspace.' });
  }
};

exports.updateNurseProfile = async (req, res) => {
  const userId = req.user.id;
  const { specialties, hourly_rate, availability, experience_years, avatar_url, bio, license_number } = req.body;

  try {
    const nurse = await dbQuery.get('SELECT id FROM nurses WHERE user_id = ?', [userId]);
    if (!nurse) {
      return res.status(404).json({ error: 'Nurse profile not found.' });
    }

    await dbQuery.run(
      `UPDATE nurses 
       SET specialties = ?, hourly_rate = ?, availability = ?, experience_years = ?, avatar_url = ?, bio = ?, license_number = ?
       WHERE user_id = ?`,
      [
        specialties, 
        parseFloat(hourly_rate) || 0, 
        availability, 
        parseInt(experience_years) || 0, 
        avatar_url, 
        bio || null, 
        license_number || null,
        userId
      ]
    );

    const updatedProfile = await dbQuery.get('SELECT * FROM nurses WHERE user_id = ?', [userId]);

    return res.status(200).json({
      message: 'Profile updated successfully.',
      nurse: updatedProfile
    });

  } catch (err) {
    console.error('❌ Update nurse profile error:', err);
    return res.status(500).json({ error: 'Internal server error updating caregiver workspace.' });
  }
};

exports.submitVerification = async (req, res) => {
  const userId = req.user.id;
  const { document_url } = req.body;

  if (!document_url) {
    return res.status(400).json({ error: 'Document URL or proof is required for verification.' });
  }

  try {
    await dbQuery.run(
      "UPDATE nurses SET verification_status = 'under_review', verification_document_url = ? WHERE user_id = ?",
      [document_url, userId]
    );
    return res.status(200).json({ message: 'Documents submitted for clinical review.' });
  } catch (err) {
    console.error('❌ Submit verification error:', err);
    return res.status(500).json({ error: 'Internal server error submitting verification documents.' });
  }
};

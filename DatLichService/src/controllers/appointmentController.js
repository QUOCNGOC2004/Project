const pool = require('../config/database');
const Appointment = require('../entity/Appointment');

const appointmentController = {
  // Lấy danh sách lịch hẹn
  async getAllAppointments(req, res) {
    try {
      const result = await pool.query('SELECT * FROM appointments ORDER BY appointment_date, appointment_time');
      const appointments = result.rows.map(row => new Appointment(row));
      res.json(appointments);
    } catch (error) {
      console.error('Error getting appointments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Lấy lịch hẹn theo ID
  async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      const appointment = new Appointment(result.rows[0]);
      res.json(appointment);
    } catch (error) {
      console.error('Error getting appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Tạo lịch hẹn mới
  async createAppointment(req, res) {
    try {
      const { user_id, doctor_id, appointment_date, appointment_time, notes } = req.body;
      
      const result = await pool.query(
        'INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, status, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [user_id, doctor_id, appointment_date, appointment_time, 'pending', notes]
      );

      const appointment = new Appointment(result.rows[0]);
      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Cập nhật lịch hẹn
  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const { appointment_date, appointment_time, status, notes } = req.body;

      const result = await pool.query(
        'UPDATE appointments SET appointment_date = $1, appointment_time = $2, status = $3, notes = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [appointment_date, appointment_time, status, notes, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      const appointment = new Appointment(result.rows[0]);
      res.json(appointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Xóa lịch hẹn
  async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = appointmentController; 
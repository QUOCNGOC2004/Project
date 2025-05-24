class Appointment {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.doctor_id = data.doctor_id;
    this.appointment_date = data.appointment_date;
    this.appointment_time = data.appointment_time;
    this.status = data.status;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

module.exports = Appointment; 
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { Calendar, Clock, User, Phone, FileText } from 'lucide-react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    booking_date: '',
    complaint: ''
  })

  // Mengambil data jadwal yang sudah ada
  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true })
    
    if (error) console.error('Error fetching bookings:', error)
    else setBookings(data || [])
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([formData])

      if (error) throw error

      alert('Pendaftaran berhasil! Admin akan segera menghubungi Anda.')
      setFormData({ name: '', phone: '', booking_date: '', complaint: '' })
      fetchBookings() // Refresh daftar jadwal
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Jadwal Bekam Sunnah</h1>
        <p>Sehat dengan terapi sesuai sunnah Nabi</p>
      </header>

      <main className="main-content">
        {/* Form Section */}
        <section className="card form-section">
          <h2><Calendar className="icon" /> Buat Janji Baru</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><User className="icon-small" /> Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div className="form-group">
              <label><Phone className="icon-small" /> Nomor WhatsApp</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Contoh: 08123456789"
              />
            </div>

            <div className="form-group">
              <label><Clock className="icon-small" /> Tanggal Terapi</label>
              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label><FileText className="icon-small" /> Keluhan (Opsional)</label>
              <textarea
                name="complaint"
                value={formData.complaint}
                onChange={handleChange}
                placeholder="Jelaskan keluhan kesehatan Anda..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Mengirim...' : 'Daftar Sekarang'}
            </button>
          </form>
        </section>

        {/* List Section */}
        <section className="card list-section">
          <h2>Jadwal Terdaftar</h2>
          {bookings.length === 0 ? (
            <p className="empty-state">Belum ada jadwal terdaftar.</p>
          ) : (
            <ul className="booking-list">
              {bookings.map((booking) => (
                <li key={booking.id} className="booking-item">
                  <div className="booking-date">
                    {new Date(booking.booking_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                  <div className="booking-info">
                    <strong>{booking.name}</strong>
                    <span className={`status ${booking.status}`}>{booking.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App

import { useEffect, useState } from 'react';
import API from '../api';

const STAT_CONFIG = [
  ['Total', 'total', 'stat-card--total'],
  ['Sent', 'sent', 'stat-card--sent'],
  ['Replied', 'replied', 'stat-card--replied'],
  ['Ghosted', 'ghosted', 'stat-card--ghosted'],
];

function badgeClass(status) {
  if (status === 'replied') return 'badge badge--replied';
  if (status === 'ghosted') return 'badge badge--ghosted';
  return 'badge badge--sent';
}

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    replied: 0,
    ghosted: 0,
  });

  useEffect(() => {
    API.get('/emails').then((res) => {
      setEmails(res.data);
      setStats({
        total: res.data.length,
        sent: res.data.filter((e) => e.status === 'sent').length,
        replied: res.data.filter((e) => e.status === 'replied').length,
        ghosted: res.data.filter((e) => e.status === 'ghosted').length,
      });
    });
  }, []);

  const updateStatus = async (id, status) => {
    await API.patch(`/emails/${id}/status`, { status });
    setEmails((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)));
  };

  const generateFollowUp = async (id) => {
    try {
      const res = await API.post(`/emails/${id}/followup`);
      alert(
        `Follow-up #${res.data.followUpNumber}:\n\nSubject: ${res.data.subject}\n${res.data.body}`
      );
    } catch {
      alert('Follow-up generation failed');
    }
  };

  return (
    <div className="page page--wide">
      <h2>Email Dashboard</h2>
      <div className="stat-grid">
        {STAT_CONFIG.map(([label, key, mod]) => (
          <div key={label} className={`stat-card ${mod}`}>
            <div className="stat-card__value">{stats[key]}</div>
            <div className="stat-card__label">{label}</div>
          </div>
        ))}
      </div>

      {emails.map((email) => (
        <div key={email._id} className="email-card">
          <div className="email-card__header">
            <strong>
              {email.recipientName} at {email.recipientCompany}
            </strong>
            <span className={badgeClass(email.status)}>{email.status}</span>
          </div>
          <p className="email-card__meta">
            {email.outreachGoal} • {email.tone} •{' '}
            {new Date(email.createdAt).toLocaleDateString()}
          </p>
          <div className="email-actions">
            {['sent', 'replied', 'ghosted'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateStatus(email._id, s)}
                className={`btn-chip${email.status === s ? ' is-active' : ''}`}
              >
                {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => generateFollowUp(email._id)}
              className="btn-followup"
            >
              Follow-up
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <section className="hero">
        <h1>Stop Overthinking. Start Reaching Out.</h1>
        <p>
          Reachzone generates personalized cold emails that actually get replies.
          Built for students chasing internships, referrals, and mentors.
        </p>
        {user ? (
          <Link to="/generate" className="cta-btn">
            Generate an Email
          </Link>
        ) : (
          <Link to="/register" className="cta-btn">
            Get Started Free
          </Link>
        )}
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>AI-Powered</h3>
          <p>GPT generates emails tailored to your profile and target company.</p>
        </div>
        <div className="feature-card">
          <h3>Follow-Up Engine</h3>
          <p>Auto-generate follow-ups with perfect timing suggestions.</p>
        </div>
        <div className="feature-card">
          <h3>Track Everything</h3>
          <p>Monitor sent, replied, and ghosted emails from your dashboard.</p>
        </div>
        <div className="feature-card">
          <h3>Roast My Email</h3>
          <p>Paste your draft and get brutally honest AI feedback.</p>
        </div>
      </section>

      <section className="stats">
        <div>
          <h2>10K+</h2>
          <p>Emails Generated</p>
        </div>
        <div>
          <h2>42%</h2>
          <p>Reply Rate</p>
        </div>
        <div>
          <h2>3K+</h2>
          <p>Students Using</p>
        </div>
      </section>
    </div>
  );
}


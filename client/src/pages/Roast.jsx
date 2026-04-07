import { useState } from 'react';
import API from '../api';

export default function Roast() {
  const [draft, setDraft] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    setLoading(true);
    try {
      const res = await API.post('/emails/roast', { emailDraft: draft });
      setResult(res.data);
    } catch {
      alert('Roast failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--md">
      <h2>Roast My Email</h2>
      <p>Paste your cold email draft and get honest feedback.</p>
      <div className="form-stack">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Paste your email draft here..."
          rows={8}
        />
      </div>
      <button
        type="button"
        onClick={handleRoast}
        disabled={loading || !draft}
        className="btn btn-danger btn-block btn-mt"
      >
        {loading ? 'Roasting...' : 'Roast It'}
      </button>

      {result && (
        <div className="mt-lg">
          <div className="roast-score">{result.score}/10</div>
          <h3>Issues:</h3>
          <ul className="roast-issues">
            {result.issues?.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
          <h3>Improved Version:</h3>
          <div className="roast-improved">{result.improved}</div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import API from '../api';

export default function Generator() {
  const [form, setForm] = useState({
    recipientName: '',
    recipientRole: '',
    recipientCompany: '',
    outreachGoal: 'internship',
    tone: 'friendly',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/emails/generate', form);
      setResult(res.data);
    } catch (err) {
      alert(
        err?.response?.data?.msg ||
          err?.message ||
          'Generation failed. Check your profile is filled out.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied!');
  };

  return (
    <div className="page page--md">
      <h2>Generate Cold Email</h2>
      <form className="form-stack" onSubmit={handleGenerate}>
        <input
          placeholder="Recipient Name"
          required
          value={form.recipientName}
          onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
        />
        <input
          placeholder="Their Role (e.g. SWE Manager)"
          value={form.recipientRole}
          onChange={(e) => setForm({ ...form, recipientRole: e.target.value })}
        />
        <input
          placeholder="Company"
          value={form.recipientCompany}
          onChange={(e) =>
            setForm({ ...form, recipientCompany: e.target.value })
          }
        />
        <select
          value={form.outreachGoal}
          onChange={(e) => setForm({ ...form, outreachGoal: e.target.value })}
        >
          <option value="internship">Internship</option>
          <option value="referral">Referral</option>
          <option value="mentorship">Mentorship</option>
          <option value="informational">Informational Interview</option>
        </select>
        <select
          value={form.tone}
          onChange={(e) => setForm({ ...form, tone: e.target.value })}
        >
          <option value="formal">Formal</option>
          <option value="friendly">Friendly</option>
          <option value="concise">Concise</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-block"
        >
          {loading ? 'Generating...' : 'Generate Email'}
        </button>
      </form>

      {result && (
        <div className="result-card">
          <h3>Subject: {result.generatedSubject}</h3>
          <pre className="pre-email">{result.generatedBody}</pre>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                `Subject: ${result.generatedSubject}\n\n${result.generatedBody}`
              )
            }
            className="btn btn-success btn-mt"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import API from '../api';

export default function Prep() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError('Please provide both a resume and a job description.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await API.post('/prep/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      const mainError = err.response?.data?.error || 'Failed to generate interview preparation.';
      const detailError = err.response?.data?.detail ? ` Details: ${err.response.data.detail}` : ' Please try again.';
      setError(mainError + detailError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <header className="page-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Interview Prep</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Upload your resume and the job description to get a tailored self-introduction and expected interview questions.
        </p>
      </header>

      <div className="card" style={{ padding: '2rem', borderRadius: '12px', boxShadow: 'var(--card-shadow)', backgroundColor: 'var(--card-bg)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="resume" style={{ fontWeight: '500' }}>Your Resume (PDF or TXT)</label>
            <input 
              type="file" 
              id="resume" 
              accept=".pdf,.txt" 
              onChange={handleFileChange} 
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              required 
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="jobDescription" style={{ fontWeight: '500' }}>Job Description</label>
            <textarea 
              id="jobDescription" 
              value={jobDescription} 
              onChange={(e) => setJobDescription(e.target.value)} 
              rows={6}
              placeholder="Paste the target job description here..."
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              required 
            />
          </div>

          {error && <div className="error-message" style={{ color: 'var(--error-color)', padding: '0.5rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Analyzing your profile...' : 'Prepare Me!'}
          </button>
        </form>
      </div>

      {results && (
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', borderRadius: '12px', boxShadow: 'var(--card-shadow)', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Self Introduction</h2>
            <div style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {results.selfIntroduction}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', borderRadius: '12px', boxShadow: 'var(--card-shadow)', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Expected Interview Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {results.interviewQuestions?.map((q, index) => (
                <div key={index} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text-color)' }}>
                    Q{index + 1}: {q.question}
                  </h3>
                  <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-color)' }}>Suggested Answer:</strong><br />
                    {q.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

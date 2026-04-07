import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <label className="theme-toggle" title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <span className="theme-toggle-text" aria-hidden="true">
        {dark ? 'Dark' : 'Light'}
      </span>
      <input
        type="checkbox"
        className="theme-toggle-input"
        role="switch"
        aria-label={dark ? 'Dark mode on' : 'Light mode on'}
        aria-checked={dark}
        checked={dark}
        onChange={toggleTheme}
      />
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" />
      </span>
    </label>
  );
}

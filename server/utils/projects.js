/**
 * Projects are stored as string[] (comma-separated in the UI).
 * Legacy data may still be [{ title, description }].
 */
function normalizeProjectEntry(p) {
  if (p == null) return '';
  if (typeof p === 'string') return p.trim();
  if (typeof p === 'object') {
    const t = (p.title || '').trim();
    const d = (p.description || '').trim();
    if (t && d) return `${t}: ${d}`;
    return t || d;
  }
  return String(p).trim();
}

/** For API responses and prompts */
function projectsToDisplayList(projects) {
  if (!projects?.length) return [];
  return projects.map(normalizeProjectEntry).filter(Boolean);
}

/** For OpenAI prompt text */
function projectsToPromptString(projects) {
  const list = projectsToDisplayList(projects);
  return list.length ? list.join('; ') : 'None';
}

/** True if DB still has legacy subdocuments instead of strings */
function projectsNeedMigration(projects) {
  if (!Array.isArray(projects) || !projects.length) return false;
  return projects.some(
    (p) =>
      p !== null &&
      typeof p === 'object' &&
      !Array.isArray(p) &&
      !(p instanceof Date)
  );
}

module.exports = {
  normalizeProjectEntry,
  projectsToDisplayList,
  projectsToPromptString,
  projectsNeedMigration,
};

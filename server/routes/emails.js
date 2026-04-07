const router = require('express').Router();
const mongoose = require('mongoose');
const OpenAI = require('openai');
const Email = require('../models/Email');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { projectsToPromptString } = require('../utils/projects');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function toObjectId(id) {
  return new mongoose.Types.ObjectId(String(id));
}

function hasUsableOpenAIKey() {
  const key = process.env.OPENAI_API_KEY || '';
  return (
    key.startsWith('sk-') &&
    !key.includes('xxxxxxxx') &&
    key.length > 30
  );
}

function safeParseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function fallbackGeneratedEmail({
  user,
  recipientName,
  recipientRole,
  recipientCompany,
  outreachGoal,
}) {
  const targetName = recipientName || 'there';
  const company = recipientCompany || 'your team';
  const role = recipientRole || 'professional';
  const major = user.major || 'my field';
  const college = user.college || 'my university';
  const skills = (user.skills || []).slice(0, 3).join(', ');
  const subject = `Quick ${outreachGoal} question about ${company}`;

  const body = `Hi ${targetName},

I hope you are doing well. I am ${user.name || 'a student'} from ${college}, studying ${major}.
I am currently focused on ${outreachGoal} opportunities and wanted to reach out because your work as ${role} at ${company} stood out to me.

${skills ? `I have been building hands-on experience in ${skills}. ` : ''}If you are open to it, I would really appreciate a brief conversation or any advice on the best way to prepare.

Thanks for your time,
${user.name || ''}`.trim();

  return { subject, body };
}
// Generate email
router.post('/generate', auth, async (req, res) => {
  try {
    const { recipientName, recipientRole, recipientCompany,
            outreachGoal, tone } = req.body;
    const userId = toObjectId(req.user.id);
    const user = await User.collection.findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const prompt = `You are an expert at writing cold outreach emails
for college students. Generate a personalized cold email.
STUDENT PROFILE:
- Name: ${user.name}
- College: ${user.college || 'Not specified'}
- Major: ${user.major || 'Not specified'}
- Year: ${user.year || 'Not specified'}
- Skills: ${user.skills?.join(', ') || 'Not specified'}
- Projects: ${projectsToPromptString(user.projects)}
- Bio: ${user.bio || 'Not provided'}
RECIPIENT:
- Name: ${recipientName}
- Role: ${recipientRole || 'Professional'}
- Company: ${recipientCompany || 'Not specified'}
GOAL: ${outreachGoal}
TONE: ${tone}
Return JSON: { "subject": "...", "body": "..." }
Keep it under 150 words. Be specific, reference the student's
actual skills/projects. No generic flattery.`;
    let result = null;
    if (hasUsableOpenAIKey()) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });
      result = safeParseJson(completion.choices?.[0]?.message?.content);
    }

    if (!result?.subject || !result?.body) {
      result = fallbackGeneratedEmail({
        user,
        recipientName,
        recipientRole,
        recipientCompany,
        outreachGoal,
      });
    }

    const email = new Email({
      userId: userId, recipientName, recipientRole,
      recipientCompany, outreachGoal, tone,
      generatedSubject: result.subject,
      generatedBody: result.body
    });
    await email.save();
    res.json(email);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: 'Generation failed',
      detail: err?.message || 'Unknown error',
    });
  }
});
// Generate follow-up
router.post('/:id/followup', auth, async (req, res) => {
  try {
    const original = await Email.findById(req.params.id);
    if (!original) return res.status(404).json({ msg: 'Not found' });
const prompt = `Write a brief follow-up email (under 80 words).
Original subject: ${original.generatedSubject}
Original email was about: ${original.outreachGoal}
Recipient: ${original.recipientName} at ${original.recipientCompany}
Follow-up #${original.followUpCount + 1}
Tone: polite but confident. Reference the original email.
Return JSON: { "subject": "...", "body": "..." }`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
});
    const result = JSON.parse(completion.choices[0].message.content);
    original.followUpCount += 1;
    await original.save();
    res.json({ subject: result.subject, body: result.body,
               followUpNumber: original.followUpCount });
  } catch (err) {
    res.status(500).json({ msg: 'Follow-up generation failed' });
} });
// Roast/improve email
router.post('/roast', auth, async (req, res) => {
  try {
    const { emailDraft } = req.body;
    const prompt = `You are a brutally honest email coach. A college
student wrote this cold outreach email. Rate it 1-10 and give
specific improvements. Then rewrite it better.
THEIR DRAFT:
${emailDraft}
Return JSON:
{ "score": 7, "issues": ["..."], "improved": "..." }`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
});
    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ msg: 'Roast failed' });
  }
});
// Get all user emails
router.get('/', auth, async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(emails);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
} });
// Update email status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const email = await Email.findByIdAndUpdate(req.params.id,
      { status: req.body.status,
        sentAt: req.body.status === 'sent' ? new Date() : undefined },
      { new: true });
    res.json(email);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
}

});
module.exports = router;
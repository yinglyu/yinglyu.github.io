const ALLOWED_ORIGINS = new Set([
  "https://yinglyu.github.io",
  "http://localhost:3000",
  "https://fiercefly.win",
  "http://fiercefly.win",
]);
const SENDER_EMAIL = 'coffee-chat@fiercefly.win';

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', ...headers },
});

const corsHeaders = origin => ({
  'Access-Control-Allow-Origin': origin || 'https://fiercefly.win',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const normalizeEmail = value => String(value || '').trim().toLowerCase();
const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
const cleanText = (value, maxLength) => String(value || '').trim().slice(0, maxLength);
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
}[character]));
const bytesToBase64 = bytes => {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary);
};
const base64Url = bytes => bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const sha256 = async value => base64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))));

const sendEmail = async (env, message) => {
  await env.EMAIL.send(message);
};

const formatUtc = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escapeIcs = value => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

const createInvite = ({ id, email, name, note, start, end, organizer }) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ying Lyu//Coffee Chat//EN', 'CALSCALE:GREGORIAN', 'METHOD:REQUEST',
  'BEGIN:VEVENT', `UID:${id}@fiercefly.win`, `DTSTAMP:${formatUtc(new Date())}`,
  `DTSTART:${formatUtc(start)}`, `DTEND:${formatUtc(end)}`, 'SUMMARY:Coffee chat with Ying',
  `DESCRIPTION:${escapeIcs(`One-hour coffee chat requested by ${name || email}.${note ? `\n\nNote: ${note}` : ''}`)}`,
  `ORGANIZER;CN=Ying:mailto:${escapeIcs(organizer)}`,
  `ATTENDEE;CN=${escapeIcs(name || email)};RSVP=TRUE:mailto:${escapeIcs(email)}`, 'STATUS:CONFIRMED', 'SEQUENCE:0',
  'END:VEVENT', 'END:VCALENDAR', '',
].join('\r\n');

const createCancelInvite = ({ id, email, name, start, end, organizer }) => [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ying Lyu//Coffee Chat//EN', 'CALSCALE:GREGORIAN', 'METHOD:CANCEL',
  'BEGIN:VEVENT', `UID:${id}@fiercefly.win`, `DTSTAMP:${formatUtc(new Date())}`,
  `DTSTART:${formatUtc(start)}`, `DTEND:${formatUtc(end)}`, 'SUMMARY:Canceled: Coffee chat with Ying',
  `ORGANIZER;CN=Ying:mailto:${escapeIcs(organizer)}`,
  `ATTENDEE;CN=${escapeIcs(name || email)};RSVP=FALSE:mailto:${escapeIcs(email)}`, 'STATUS:CANCELLED', 'SEQUENCE:1',
  'END:VEVENT', 'END:VCALENDAR', '',
].join('\r\n');

const handleInvite = async (request, env, headers) => {
  const body = await request.json();
  const email = normalizeEmail(body.email);
  const start = new Date(body.start); const end = new Date(body.end);
  const name = cleanText(body.name, 80);
  const note = cleanText(body.note, 600);
  const id = cleanText(body.id, 80) || crypto.randomUUID();
  if (!name) return json({ error: 'Enter your name.' }, 400, headers);
  if (!validEmail(email)) return json({ error: 'Enter a valid email address.' }, 400, headers);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end - start !== 60 * 60 * 1000 || start <= new Date()) {
    return json({ error: 'Choose a valid future one-hour time slot.' }, 400, headers);
  }

  const identity = `${request.headers.get('CF-Connecting-IP') || 'unknown'}:${email}`;
  const rateKey = `invite-rate:${await sha256(identity)}`;
  const lastSent = Number(await env.COFFEE_CHAT.get(rateKey) || 0);
  const retryAfter = Math.ceil((lastSent + 300000 - Date.now()) / 1000);
  if (retryAfter > 0) return json({ error: 'Only one invitation may be sent every five minutes.', retryAfter }, 429, headers);

  const ics = createInvite({ id, email, name, note, start, end, organizer: env.ORGANIZER_EMAIL });
  await sendEmail(env, {
    from: SENDER_EMAIL, to: env.ORGANIZER_EMAIL, replyTo: email, subject: 'Coffee chat invitation',
    html: [
      `<p>Coffee chat requested by ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;.</p>`,
      `<p>${start.toUTCString()} – ${end.toUTCString()}</p>`,
      note ? `<p><strong>Note:</strong><br>${escapeHtml(note).replace(/\n/g, '<br>')}</p>` : '',
    ].join(''),
    attachments: [{ filename: 'coffee-chat.ics', content: new TextEncoder().encode(ics).buffer, type: 'text/calendar', disposition: 'attachment' }],
  });
  await env.COFFEE_CHAT.put(rateKey, String(Date.now()), { expirationTtl: 300 });
  return json({ ok: true, id, status: 'requested', organizerEmail: env.ORGANIZER_EMAIL }, 200, headers);
};

const handleCancelInvite = async (request, env, headers) => {
  const body = await request.json();
  const email = normalizeEmail(body.email);
  const id = cleanText(body.id, 80);
  const name = cleanText(body.name, 80);
  const start = new Date(body.start); const end = new Date(body.end);
  if (!id || !validEmail(email) || !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    return json({ error: 'Unable to cancel that invitation.' }, 400, headers);
  }

  const ics = createCancelInvite({ id, email, name, start, end, organizer: env.ORGANIZER_EMAIL });
  await sendEmail(env, {
    from: SENDER_EMAIL,
    to: env.ORGANIZER_EMAIL,
    replyTo: email,
    subject: 'Coffee chat cancellation',
    html: `<p>Coffee chat canceled by ${escapeHtml(name || email)} &lt;${escapeHtml(email)}&gt;.</p><p>${start.toUTCString()} – ${end.toUTCString()}</p>`,
    attachments: [{ filename: 'coffee-chat-cancel.ics', content: new TextEncoder().encode(ics).buffer, type: 'text/calendar', disposition: 'attachment' }],
  });
  return json({ ok: true, id, status: 'canceled' }, 200, headers);
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin);
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: 'Origin not allowed.' }, 403, headers);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    const path = new URL(request.url).pathname;

    try {
      if (path === '/calendar' && (request.method === 'GET' || request.method === 'HEAD')) {
        const response = await fetch(env.ICLOUD_CALENDAR_URL, { headers: { Accept: 'text/calendar' }, cf: { cacheEverything: true, cacheTtl: 300 } });
        return new Response(response.body, { status: response.status, headers: { ...headers, 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
      }
      if (path === '/invite' && request.method === 'POST') return handleInvite(request, env, headers);
      if (path === '/invite/cancel' && request.method === 'POST') return handleCancelInvite(request, env, headers);
      return json({ error: 'Not found.' }, 404, headers);
    } catch (error) {
      console.error(error);
      return json({ error: 'The service is temporarily unavailable.' }, 500, headers);
    }
  },
};

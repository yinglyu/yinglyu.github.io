import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import iCalendarPlugin from '@fullcalendar/icalendar';
import interactionPlugin from '@fullcalendar/interaction';

const API_URL = process.env.REACT_APP_CALENDAR_API_URL
  || 'https://icloud-calendar-proxy.lyuying622.workers.dev';
const INVITATION_KEY = 'coffee-chat-invitation';

const Page = styled.main`
  min-height: 100vh;
  box-sizing: border-box;
  padding: 7rem 1.5rem 3rem;
  background: linear-gradient(135deg, #1f4e79, #4fa3d9);
  color: white;
`;

const Content = styled.div`
  max-width: 78rem;
  margin: 0 auto;
`;

const Card = styled.section`
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.97);
  color: #17324d;
  box-shadow: 0 1rem 2.5rem rgba(10, 40, 70, 0.25);
`;

const Heading = styled.h1`
  margin: 0 0 0.5rem;
`;

const CalendarHeading = styled.h2`
  margin: 0 0 0.25rem;
  font-size: 1.2rem;
`;

const Intro = styled.p`
  margin: 0 0 1.25rem;
  color: #486581;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: #17324d;
  font-weight: 700;
`;

const HelpText = styled.span`
  color: #627d98;
  font-size: 0.85rem;
  font-weight: 500;
`;

const inputStyles = `
  box-sizing: border-box;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid #bcccdc;
  border-radius: 0.5rem;
  color: #102a43;
  font-size: 1rem;

  &:focus {
    outline: 3px solid rgba(79, 163, 217, 0.28);
    border-color: #2878b5;
  }
`;

const Input = styled.input`${inputStyles}`;

const Textarea = styled.textarea`
  ${inputStyles}
  min-height: 5rem;
  resize: vertical;
`;

const Button = styled.button`
  min-height: 2.75rem;
  padding: 0.65rem 1.1rem;
  border: 0;
  border-radius: 0.5rem;
  background: #1f4e79;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;

  &:hover:not(:disabled) { background: #163b5f; }
  &:disabled { cursor: not-allowed; opacity: 0.55; }
`;

const SecondaryButton = styled(Button)`
  background: #d9e2ec;
  color: #17324d;

  &:hover:not(:disabled) { background: #bcccdc; }
`;

const DangerButton = styled(Button)`
  background: #b42318;

  &:hover:not(:disabled) { background: #7a271a; }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Status = styled.p`
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${props => props.error ? '#fde8e8' : '#e6ffed'};
  color: ${props => props.error ? '#9b1c1c' : '#176b3a'};
`;

const SlotSummary = styled.div`
  margin: 0 0 1rem;
  padding: 0.85rem;
  border-radius: 0.75rem;
  background: ${props => props.active ? '#eef6fc' : '#f0f4f8'};
  color: #17324d;
`;

const PendingCard = styled.aside`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  width: min(22rem, calc(100% - 2rem));
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 0.85rem;
  background: #eef6fc;
  color: #17324d;
  box-shadow: 0 0.75rem 2rem rgba(10, 40, 70, 0.18);

  @media (max-width: 58rem) {
    position: static;
    width: auto;
    margin-bottom: 1rem;
  }
`;

const Panel = styled(Card)`
  position: relative;
  min-width: 0;
`;

const HoverTip = styled.div`
  position: absolute;
  left: 50%;
  top: 5.25rem;
  z-index: 4;
  transform: translate(-50%, ${props => props.visible ? '0' : '-0.35rem'});
  padding: 0.65rem 0.9rem;
  border-radius: 999px;
  background: #102a43;
  color: white;
  box-shadow: 0 0.5rem 1.25rem rgba(10, 40, 70, 0.28);
  font-size: 0.9rem;
  font-weight: 700;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
  white-space: nowrap;

  @media (max-width: 40rem) {
    top: 8.75rem;
    max-width: calc(100% - 2rem);
    white-space: normal;
    text-align: center;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 1rem;
  background: rgba(8, 28, 48, 0.58);
  backdrop-filter: blur(4px);
`;

const FormCard = styled(Card)`
  width: min(30rem, 100%);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const FoldButton = styled.button`
  flex: 0 0 auto;
  padding: 0.45rem 0.7rem;
  border: 0;
  border-radius: 0.45rem;
  background: #e7eef5;
  color: #17324d;
  cursor: pointer;
  font-weight: 700;
`;

const ReopenButton = styled(Button)`
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 250;
  box-shadow: 0 0.75rem 2rem rgba(10, 40, 70, 0.35);
`;

const CalendarPanel = styled.div`
  .fc .fc-button-primary {
    background: #1f4e79;
    border-color: #1f4e79;
  }
  .fc .fc-button-primary:hover,
  .fc .fc-button-primary:focus {
    background: #163b5f;
    border-color: #163b5f;
  }
  .fc .fc-event { cursor: not-allowed; }
  .fc .fc-timegrid-event { background: #9fb3c8; border-color: #829ab1; color: #102a43; }
  .fc .fc-event.coffee-chat-event {
    background: #1f4e79;
    border-color: #1f4e79;
    color: white;
    cursor: pointer;
  }
  .fc .fc-highlight { background: rgba(38, 132, 196, 0.28); }

  @media (max-width: 40rem) {
    .fc .fc-toolbar { align-items: stretch; flex-direction: column; gap: 0.75rem; }
  }
`;

const readInvitation = () => {
  try {
    const invitation = JSON.parse(localStorage.getItem(INVITATION_KEY));
    if (invitation && invitation.start && invitation.end) return invitation;
  } catch (error) {
    // Ignore malformed local storage values.
  }
  localStorage.removeItem(INVITATION_KEY);
  return null;
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong. Please try again.');
    error.status = response.status;
    error.retryAfter = data.retryAfter;
    throw error;
  }
  return data;
};

const formatSlot = slot => new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short',
}).format(new Date(slot.start));

const formatUtc = date => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escapeIcs = value => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

const downloadInvitation = ({ id, email, start, end, organizerEmail }) => {
  const description = `Ying will confirm the invite and send along video conference via ${organizerEmail}`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ying Lyu//Coffee Chat//EN', 'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH', 'BEGIN:VEVENT', `UID:${id}@fiercefly.win`, `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(start)}`, `DTEND:${formatUtc(end)}`, 'SUMMARY:Coffee chat with Ying',
    `DESCRIPTION:${escapeIcs(description)}`, `ORGANIZER;CN=Ying:mailto:${escapeIcs(organizerEmail)}`,
    `ATTENDEE:mailto:${escapeIcs(email)}`, 'STATUS:TENTATIVE', 'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'coffee-chat-with-ying.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const createLocalEvent = invitation => invitation ? [{
  id: invitation.id || 'coffee-chat-invitation',
  title: 'Coffee chat request',
  start: invitation.start,
  end: invitation.end,
  classNames: ['coffee-chat-event'],
}] : [];

export const Calendar = () => {
  const calendarRef = useRef(null);
  const [invitation, setInvitation] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', note: '' });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [calendarHovered, setCalendarHovered] = useState(false);

  useEffect(() => {
    const storedInvitation = readInvitation();
    setInvitation(storedInvitation);
    if (storedInvitation) {
      setForm(current => ({
        ...current,
        name: storedInvitation.name || current.name,
        email: storedInvitation.email || current.email,
        note: storedInvitation.note || current.note,
      }));
    }
  }, []);

  const updateForm = field => event => {
    const value = event.target.value;
    setForm(current => ({ ...current, [field]: value }));
  };

  const saveInvitation = nextInvitation => {
    setInvitation(nextInvitation);
    if (nextInvitation) localStorage.setItem(INVITATION_KEY, JSON.stringify(nextInvitation));
    else localStorage.removeItem(INVITATION_KEY);
  };

  const chooseSlot = info => {
    const start = info.date;
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    if (start <= new Date()) {
      setStatus({ error: true, text: 'Please choose a future time.' });
      return;
    }
    if (start.getDay() === 0 || start.getDay() === 6 || start.getHours() < 9 || end.getHours() > 18) {
      setStatus({ error: true, text: 'Please choose a weekday between 9:00 AM and 6:00 PM.' });
      return;
    }
    setStatus(null);
    setSelectedSlot({ start, end });
    setFormOpen(true);
    calendarRef.current.getApi().select(start, end);
  };

  const submitInvite = async event => {
    event.preventDefault();
    if (!selectedSlot) {
      setStatus({ error: true, text: 'Choose an available start time on the calendar first.' });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const result = await requestJson('/invite', {
        method: 'POST',
        body: JSON.stringify({
          id: invitation?.id,
          name: form.name,
          email: form.email,
          note: form.note,
          start: selectedSlot.start.toISOString(),
          end: selectedSlot.end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const nextInvitation = {
        id: result.id,
        name: form.name,
        email: form.email.trim().toLowerCase(),
        note: form.note,
        start: selectedSlot.start.toISOString(),
        end: selectedSlot.end.toISOString(),
        status: result.status || 'requested',
      };
      saveInvitation(nextInvitation);
      downloadInvitation({ ...nextInvitation, organizerEmail: result.organizerEmail });
      setStatus({ text: invitation
        ? 'Your new proposed time was sent and the calendar file was downloaded.'
        : 'Your coffee chat request was sent and the calendar file was downloaded.' });
      setSelectedSlot(null);
      setFormOpen(false);
      calendarRef.current.getApi().unselect();
    } catch (error) {
      const suffix = error.status === 429 && error.retryAfter
        ? ` Try again in ${error.retryAfter} seconds.`
        : '';
      setStatus({ error: true, text: `${error.message}${suffix}` });
    } finally {
      setBusy(false);
    }
  };

  const startReschedule = () => {
    setStatus({ text: 'Pick a new one-hour start time on the calendar, then submit again.' });
    setSelectedSlot(null);
    calendarRef.current.getApi().unselect();
  };

  const cancelInvitation = async () => {
    if (!invitation) return;
    setBusy(true);
    setStatus(null);
    try {
      await requestJson('/invite/cancel', {
        method: 'POST',
        body: JSON.stringify({ id: invitation.id, start: invitation.start, end: invitation.end, name: invitation.name, email: invitation.email }),
      });
      saveInvitation(null);
      setSelectedSlot(null);
      calendarRef.current.getApi().unselect();
      setStatus({ text: 'Invitation canceled.' });
    } catch (error) {
      setStatus({ error: true, text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const localEvents = createLocalEvent(invitation);
  return (
    <Page>
      <Content>
          <Panel>
            {invitation && (
              <PendingCard>
                <CalendarHeading>Your coffee chat request</CalendarHeading>
                <Intro>{formatSlot(invitation)}</Intro>
                <ButtonRow>
                  <SecondaryButton type="button" onClick={startReschedule} disabled={busy}>
                    Reschedule
                  </SecondaryButton>
                  <DangerButton type="button" onClick={cancelInvitation} disabled={busy}>
                    Cancel
                  </DangerButton>
                </ButtonRow>
              </PendingCard>
            )}

            <CalendarHeading>Pick an available start time</CalendarHeading>
            <Intro>Busy events from my calendar are shown as “Busy”. Your proposed chat appears in blue.</Intro>
            {status && <Status role="status" error={status.error}>{status.text}</Status>}
            <HoverTip visible={calendarHovered}>Click an available time to schedule a one-hour coffee chat</HoverTip>
            <CalendarPanel
              onMouseEnter={() => setCalendarHovered(true)}
              onMouseLeave={() => setCalendarHovered(false)}
            >
              <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, iCalendarPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                eventSources={[
                  { url: `${API_URL}/calendar`, format: 'ics' },
                  { events: localEvents },
                ]}
                eventContent={info => <span>{info.event.classNames.includes('coffee-chat-event') ? info.event.title : 'Busy'}</span>}
                dateClick={chooseSlot}
                selectable
                selectMirror
                selectOverlap={false}
                allDaySlot={false}
                slotDuration="00:30:00"
                slotMinTime="08:00:00"
                slotMaxTime="19:00:00"
                businessHours={{ daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '18:00' }}
                height="auto"
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay' }}
                buttonText={{ week: 'Week', day: 'Day' }}
              />
            </CalendarPanel>
          </Panel>

        {formOpen && selectedSlot && (
          <ModalBackdrop role="presentation" onMouseDown={() => setFormOpen(false)}>
            <FormCard
              role="dialog"
              aria-modal="true"
              aria-labelledby="coffee-chat-form-title"
              onMouseDown={event => event.stopPropagation()}
            >
              <FormHeader>
                <div>
                  <Heading id="coffee-chat-form-title">Coffee chat with me</Heading>
                  <Intro>Tell me a little about you, then send your proposed time.</Intro>
                </div>
                <FoldButton type="button" onClick={() => setFormOpen(false)} aria-label="Minimize coffee chat form">
                  Minimize
                </FoldButton>
              </FormHeader>

              <SlotSummary active>
                <strong>Selected start time</strong>
                <br />
                {formatSlot(selectedSlot)}
                <br />
                <HelpText>One-hour coffee chat</HelpText>
              </SlotSummary>

              <Form onSubmit={submitInvite}>
                <Field>
                  Name
                  <Input value={form.name} onChange={updateForm('name')} maxLength="80" required autoFocus />
                </Field>
                <Field>
                  Email
                  <Input type="email" value={form.email} onChange={updateForm('email')} required />
                </Field>
                <Field>
                  Note
                  <Textarea
                    value={form.note}
                    onChange={updateForm('note')}
                    maxLength="600"
                    placeholder="Optional: what would you like to chat about?"
                  />
                </Field>
                <Button type="submit" disabled={busy}>
                  {busy ? 'Sending…' : invitation ? 'Submit new time' : 'Submit invitation'}
                </Button>
              </Form>
            </FormCard>
          </ModalBackdrop>
        )}

        {selectedSlot && !formOpen && (
          <ReopenButton type="button" onClick={() => setFormOpen(true)}>
            Complete coffee chat request
          </ReopenButton>
        )}
      </Content>
    </Page>
  );
};

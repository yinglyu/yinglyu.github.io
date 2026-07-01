# Coffee chat Worker setup

Create a Cloudflare KV namespace and bind it to this Worker as `COFFEE_CHAT`.

Onboard `fiercefly.win` in Cloudflare Email Service and bind Email Sending to this
Worker as `EMAIL`. Add your personal inbox as a verified destination address.

Add these Worker variables/secrets in **Settings → Variables and Secrets**:

- `ICLOUD_CALENDAR_URL`: published iCloud calendar URL using `https://`
- `ORGANIZER_EMAIL`: your verified destination address; only this address receives messages

The Worker sends from `coffee-chat@fiercefly.win`. This does not need a mailbox,
but `fiercefly.win` must be onboarded as a Cloudflare Email Service sending domain.

The Worker exposes:

- `GET /calendar`
- `POST /invite`
- `POST /invite/cancel`

Deploy this source over the existing Worker. The React app already points to
`https://icloud-calendar-proxy.lyuying622.workers.dev` by default.

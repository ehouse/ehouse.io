---
title: Passkey SSO for Self-Hosted Services with Pocket ID
date: 2026-04-03
tag: Homelab
---

Rather than trusting each self-hosted app to get authentication right, I wanted one hardened layer in front of everything. If an app has a vulnerability in its auth, Cloudflare Zero Trust is still in the way. It also makes it easy to block login attempts from regions I would never actually be logging in from. Something like 80% of my web traffic comes from former Soviet bloc states, which seems suspicious.

The identity provider behind all of this is Pocket ID. It is small, lightweight, and straightforward to configure, which is exactly the opposite of the enterprise SSO solutions that require a specialty and a degree to understand (Authentik).

## How the pieces fit together

**Pocket ID** is the OIDC identity provider that uses WebAuthn passkeys as its only authentication mechanism. It exposes a standard discovery endpoint at `/.well-known/openid-configuration`, issues signed JWTs, and handles the full OAuth 2.0 authorization code flow, so any OIDC-compliant service can delegate authentication to it.

**Cloudflare Zero Trust** is a reverse proxy with an access control layer. It terminates requests at the edge, evaluates them against your policies, and forwards them only if they pass. Policies can match on OIDC identity attributes like email or group membership.

**Cloudflare tunnel** (`cloudflared`) opens an outbound-only connection to Cloudflare's edge, so inbound traffic never touches an open port on your router.

I manage containers with Komodo, but none of this is specific to it. Any Docker setup works. The compose file and shared network are the same regardless of what is managing them.

## Setting up Pocket ID

Pocket ID runs as a single Docker container.

```yaml
services:
  pocket-id:
    image: ghcr.io/pocket-id/pocket-id:latest
    container_name: pocket-id
    restart: unless-stopped
    env_file:
      - stack.env
    volumes:
      - ./data:/app/data
    networks:
      - cloudflare-tunnel

networks:
  cloudflare-tunnel:
    external: true
```

`cloudflare-tunnel` is a custom Docker bridge network that `cloudflared` is attached to. Only containers that need to be reachable through the tunnel get joined to it. Everything else stays off it. Containers on the same network are reachable by service name, so `http://pocket-id:1411` resolves without any host port mappings.

The `stack.env` file contains:

```
APP_URL=https://auth.ehouse.io
TRUST_PROXY=true
ENCRYPTION_KEY=your-key-here
```

`TRUST_PROXY` is required because requests arrive via Cloudflare's proxy and Pocket ID needs to trust the forwarded IP headers. `ENCRYPTION_KEY` protects stored credential data. Generate with `openssl rand -hex 32`.

The tunnel config for Pocket ID is:

```
auth.ehouse.io -> http://pocket-id:1411
```

On first run, navigate to `https://auth.ehouse.io/setup` to create the admin account and enroll your passkey.

## Connecting Pocket ID to Cloudflare Zero Trust

In the Pocket ID admin panel, create an OIDC client for Cloudflare Zero Trust. You will need three values from this step:

- The **issuer URL**: `https://auth.ehouse.io`
- A **client ID and secret**: generated when you create the OIDC client
- A **redirect URI**: `https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback`

Then in Cloudflare Zero Trust under Settings > Authentication, add a new OpenID Connect identity provider using those values.

Pocket ID also has [official configuration guides](https://pocket-id.org/docs/client-examples) for over 100 self-hosted apps if you want to wire services up directly.

Run the connection test to confirm it can reach Pocket ID and complete a token exchange.

## Adding users

Create the account in the Pocket ID admin panel with their name and email. They will get a link to complete setup and enroll their passkey. Once done, add them to the `users` group.

One gotcha: creating the account is not enough. You also need to add the user to each OIDC application they should access, otherwise Cloudflare will block them even after a successful login.

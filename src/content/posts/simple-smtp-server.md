---
title: Basic SMTP Email Server
date: 2014-11-05
updated: 2026-03-27
tag: Email
---

{% callout type="warning" %}
**2026 Note:** This post was written in 2014 against OpenSMTPD's original config syntax, which was replaced in version 6.6 (2019) with an `action`/`match` style. The config blocks below will not work on a modern install without rewriting. The concepts and port assignments are still accurate. One significant omission: SPF, DKIM, and DMARC are now effectively required for deliverability and are not covered here.
{% /callout %}

---

Running your own mail server can seem intimidating at first, but once the different layers are broken down it becomes much easier to tackle. A mail stack has three main components: the MTA, MDA, and MUA.

The **Mail Transfer Agent (MTA)** handles sending and receiving email, which is your SMTP server. The **Mail Delivery Agent (MDA)** handles delivery to user mailboxes, typically over POP3 or IMAP. The **Mail User Agent (MUA)** is the client the end user interacts with directly and popular examples include Thunderbird and mutt.

Later in this series I will cover more advanced components: amavisd for virus scanning, SpamAssassin for spam filtering, and Sieve, a server-side filtering language that Dovecot supports natively.

Part 1 covers setting up the SMTP server. I chose **OpenSMTPD** because it is full-featured and straightforward to configure. OpenSMTPD is an OpenBSD project originally designed to replace Sendmail, but it serves equally well as a Postfix replacement. Its focus on simplicity and security results in a robust, hard-to-misconfigure daemon.

## OpenSMTPD Setup

Install OpenSMTPD from your distribution's package repositories. If it is not available as a package, you can build it from source.

The primary configuration file is `smtpd.conf`. On FreeBSD it lives at `/usr/local/etc/mail/smtpd.conf`; on CentOS at `/etc/smtpd/smtpd.conf`. Create it if it does not exist, then continue to the next section.

## smtpd.conf

Below is the complete configuration. Each section is broken down in the following subsections.

```ini
pki mail.ehouse.io certificate "/etc/ssl/certs/mail.crt"
pki mail.ehouse.io key         "/etc/ssl/private/mail.key"

queue compression
queue encryption key YourKeyHere

listen on localhost
listen on egress port smtp        tls          pki mail.ehouse.io auth-optional
listen on egress port submission  tls-require  pki mail.ehouse.io auth

table aliases db:/etc/mail/aliases.db

accept from any for domain "ehouse.io" alias <aliases> deliver to maildir
accept for any relay
```

## TLS and Certificate Setup

```ini
pki mail.ehouse.io certificate "/etc/ssl/certs/mail.crt"
pki mail.ehouse.io key         "/etc/ssl/private/mail.key"

queue compression
queue encryption key YourKeyHere
```

This block defines the certificate and private key used for TLS. Queue compression and encryption are both optional but recommended, luckily OpenSMTPD compresses before encrypting.

To generate a self-signed certificate:

```bash
openssl req -new -x509 -days 3650 -nodes \
  -out /etc/ssl/certs/mail.crt \
  -keyout /etc/ssl/private/mail.key
```

{% callout type="warning" %}
**2018 Update:**
Self-signed certificates are free and fast to generate, but mail clients and other servers will reject or warn on them. If your server is internet-facing, a certificate from [Let's Encrypt](https://letsencrypt.org) is a better choice.
{% /callout %}

Make sure the destination directories exist before running the command. To generate the queue encryption key:

```bash
openssl rand -hex 16
```

Paste the output in place of `YourKeyHere` in the config. This step is optional but recommended.

## Listen Directives

```ini
listen on localhost
listen on egress port smtp        tls          pki mail.ehouse.io auth-optional
listen on egress port submission  tls-require  pki mail.ehouse.io auth
```

This block controls which interfaces and ports accept connections, and what authentication and encryption are required.

- **Port 25 (smtp)** is used for server-to-server delivery. TLS is offered via STARTTLS but not required, since not all sending servers support it. Authentication is optional.
- **Port 587 (submission)** is used for client-to-server delivery. STARTTLS is required and authentication is mandatory.

The `pki` label references the certificate block defined earlier.

## Sending and Receiving Mail

```ini
table aliases db:/etc/mail/aliases.db

accept from any for domain "ehouse.io" alias <aliases> deliver to maildir
accept for any relay
```

The first line loads the alias table. If you update this file without restarting smtpd, run `smtpctl update table aliases` to reload it. The binary db format is preferred over plaintext because lookups scale better on large alias files. Make sure you run `newaliases` and `makemap` after editing the source file.

The `accept` line tells OpenSMTPD to receive mail from any source addressed to `ehouse.io`, resolve aliases, and deliver to maildir. OpenSMTPD supports several delivery backends; I will cover those in a later article.

The final line relays outbound mail for authenticated local users. There is an implicit rule that accepts mail from localhost and relays it and the explicit `accept for any relay` works in conjunction with the submission listener's `auth` requirement to prevent this from becoming an open relay.

That covers the OpenSMTPD setup. Start the daemon and you should be able to send and receive mail on your domain, provided you have an MX record pointed at your server. Setting up MX records is well-documented elsewhere and outside the scope of this post.

## Up Next

[Part 2: basic-dovecot-setup](/writing/basic-dovecot-setup) covers Dovecot, the MDA, which enables IMAP access and client support. [Part 2.5: amavisd-spamassassin-setup](/writing/amavisd-spamassassin-setup) covers amavisd and SpamAssassin for spam and virus filtering.

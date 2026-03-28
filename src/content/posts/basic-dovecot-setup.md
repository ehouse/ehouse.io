---
title: Basic Dovecot Setup
date: 2015-01-10
updated: 2026-03-27
tag: Email
---

{% callout type="warning" %}
**2026 Update**: The original version of this post was lost. This reconstruction is based on memory and may not reflect the exact content or configuration from the original.
{% /callout %}

---

This is part 2 of a series on building a self-hosted mail stack. [Part 1](/writing/simple-smtp-server) covered OpenSMTPD. This article covers Dovecot, the MDA, which handles delivery of mail to user mailboxes over IMAP and POP3.

## What is Dovecot?

Dovecot is a Mail Delivery Agent that serves mailboxes to clients over IMAP and POP3. It also provides a local delivery agent (LDA) that OpenSMTPD can hand mail off to, and supports Sieve filtering via the Pigeonhole plugin, which we will cover in part 3.

## Installation

Install Dovecot and the Pigeonhole plugin from the base repository:

```bash
yum install dovecot dovecot-pigeonhole
```

The main configuration lives in `/etc/dovecot/dovecot.conf`, with additional files split into `/etc/dovecot/conf.d/`.

## Protocols

In `/etc/dovecot/dovecot.conf`, enable the protocols you want to serve:

```ini
protocols = imap pop3
```

If you only want IMAP, drop `pop3`. POP3 is largely obsolete but included here for completeness.

## TLS Configuration

Dovecot needs the same certificate and key we generated in part 1. Edit `/etc/dovecot/conf.d/10-ssl.conf`:

```ini
ssl = required
ssl_cert = </etc/ssl/certs/mail.crt
ssl_key = </etc/ssl/private/mail.key
```

Setting `ssl = required` rejects plaintext connections entirely. The `<` prefix tells Dovecot to read the value from a file rather than treat the string literally.

{% callout type="warning" %}
If you are using a self-signed certificate, mail clients will warn or refuse to connect. See the note in part 1 about Let's Encrypt.
{% /callout %}

## Mail Location

Tell Dovecot where to find mailboxes. Edit `/etc/dovecot/conf.d/10-mail.conf`:

```ini
mail_location = maildir:~/Maildir
```

This matches the `deliver to maildir` directive in our OpenSMTPD config. Dovecot will look for each user's mail in `~/Maildir`.

## Authentication

Edit `/etc/dovecot/conf.d/10-auth.conf`:

```ini
disable_plaintext_auth = yes
auth_mechanisms = plain login
```

Plaintext auth is disabled over unencrypted connections. The `plain` and `login` mechanisms are both fine here because TLS is required, so credentials are never sent in the clear.

Dovecot uses PAM for system user authentication by default on CentOS, which means your existing system accounts work without additional configuration.

## LMTP / LDA Integration with OpenSMTPD

Rather than writing directly to maildir, OpenSMTPD can hand mail off to Dovecot's LDA, which gives Sieve filtering a chance to run before delivery. In `/etc/dovecot/conf.d/15-lda.conf`:

```ini
postmaster_address = postmaster@ehouse.io
```

Then update your `smtpd.conf` to deliver via the Dovecot LDA instead of writing to maildir directly:

```ini
accept from any for domain "ehouse.io" alias <aliases> deliver to lmtp "/var/run/dovecot/lmtp"
```

You also need to grant OpenSMTPD's daemon user write access to the LMTP socket. In `/etc/dovecot/conf.d/10-master.conf`, add a `unix_listener` block inside the `service lmtp` section:

```ini
service lmtp {
  unix_listener /var/run/dovecot/lmtp {
    mode = 0600
    user = smtpd
  }
}
```

This is required if you want Sieve rules to apply to incoming mail, which we will cover in part 3.

## Firewall

Open the IMAP and POP3 ports if you have a firewall running:

```bash
firewall-cmd --permanent --add-service=imap
firewall-cmd --permanent --add-service=imaps
firewall-cmd --permanent --add-service=pop3
firewall-cmd --permanent --add-service=pop3s
firewall-cmd --reload
```

## Starting Dovecot

```bash
systemctl enable dovecot
systemctl start dovecot
```

Check `/var/log/maillog` for any errors on startup. At this point you should be able to point a mail client at your server and connect over IMAP or POP3 using a system account.

## Up Next

[Part 2.5: amavisd-spamassassin-setup](/writing/amavisd-spamassassin-setup) covers amavisd and SpamAssassin, adding spam filtering and virus scanning between the MTA and your mailbox.

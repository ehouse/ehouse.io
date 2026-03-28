---
title: Spam Filtering with amavisd and SpamAssassin
date: 2015-03-15
updated: 2026-03-27
tag: Email
---

{% callout type="warning" %}
**2026 Update**: The original version of this post was lost. This reconstruction is based on memory and may not reflect the exact content or configuration from the original.
{% /callout %}

---

This is part 2.5 of a series on building a self-hosted mail stack. [Part 2](/writing/basic-dovecot-setup) covered Dovecot. This article covers amavisd-new and SpamAssassin, which together provide spam filtering and virus scanning between the MTA and your mailbox.

## How It Fits Together

amavisd-new is a policy daemon that sits between OpenSMTPD and Dovecot. When OpenSMTPD receives a message, instead of delivering it directly, it hands the message to amavisd over SMTP. amavisd passes the message through SpamAssassin for spam scoring and optionally through ClamAV for virus scanning, then re-injects the processed message back into OpenSMTPD for final delivery.

```
OpenSMTPD (port 25)
        v
amavisd (port 10024)
        |-- SpamAssassin
        |-- ClamAV (optional)
        v
OpenSMTPD (port 10025)
```

## Installation

Both `amavisd-new` and ClamAV are in EPEL, not the base CentOS repos. Enable it first if you have not already:

```bash
yum install epel-release
```

Then install amavisd and SpamAssassin:

```bash
yum install amavisd-new spamassassin
```

For virus scanning, also install ClamAV:

```bash
yum install clamav clamav-update
```

## SpamAssassin Configuration

SpamAssassin works reasonably well out of the box. The main config is at `/etc/mail/spamassassin/local.cf`. At minimum, set a score threshold and the header rewrite:

```ini
required_score 5.0
rewrite_header Subject [SPAM]
report_safe 0
```

`report_safe 0` causes SpamAssassin to add headers to the original message rather than wrapping it as an attachment, which is what our Sieve rule in part 3 depends on.

Update the SpamAssassin rules database:

```bash
sa-update
```

Set this up as a cron job to keep rules current:

```bash
echo "0 2 * * * root sa-update && systemctl restart spamassassin" > /etc/cron.d/sa-update
```

## amavisd Configuration

The main config is `/etc/amavisd/amavisd.conf`. The defaults are mostly fine. Key settings to verify or change:

```perl
$mydomain = 'ehouse.io';
$myhostname = 'mail.ehouse.io';

# Listening port for incoming mail from OpenSMTPD
$inet_socket_port = 10024;

# Port amavisd uses to re-inject clean mail back to OpenSMTPD
$forward_method = 'smtp:[127.0.0.1]:10025';
$notify_method  = 'smtp:[127.0.0.1]:10025';

# SpamAssassin integration
@bypass_spam_checks_maps = (0);
$sa_spam_subject_tag = '[SPAM] ';
$sa_tag_level_deflt  = 2.0;   # Add X-Spam headers above this score
$sa_tag2_level_deflt = 6.31;  # Add X-Spam-Flag: YES above this score
$sa_kill_level_deflt = 6.31;  # Reject/quarantine above this score
```

The `sa_tag2` and `sa_kill` thresholds control when amavisd marks a message as spam and when it quarantines or rejects it. These can be tuned over time as you see what your mail looks like.

## OpenSMTPD Integration

Update `smtpd.conf` to route incoming mail through amavisd rather than delivering directly. Add a listener on port 10025 for re-injected clean mail, and route inbound mail to amavisd on port 10024:

```ini
listen on localhost port 10025 tag REINJECTED

accept tagged REINJECTED for domain "ehouse.io" alias <aliases> deliver to lmtp "/var/run/dovecot/lmtp"
accept from any for domain "ehouse.io" relay via smtp://127.0.0.1:10024
accept for any relay
```

Messages arriving on port 10025 are tagged as `REINJECTED` and delivered normally. Everything else destined for your domain is forwarded to amavisd first.

{% callout type="warning" %}
Make sure the port 10025 listener is bound to `localhost` only. Exposing it externally would allow anyone to bypass your MTA and inject mail directly into the delivery path.
{% /callout %}

## ClamAV Setup (Optional)

If you installed ClamAV, initialize the database and enable the daemon:

```bash
freshclam
systemctl enable clamd@amavisd
systemctl start clamd@amavisd
```

In `amavisd.conf`, uncomment the ClamAV entry in the `@av_scanners` array. The exact line to uncomment looks like:

```perl
['ClamAV-clamd', \&ask_daemon, ...]
```

Search for `clamd` in the config file to find it.

## Starting Services

```bash
systemctl enable amavisd
systemctl start amavisd
systemctl restart opensmtpd
```

Check `/var/log/maillog` for amavisd startup messages and confirm it is listening on port 10024.

## Up Next

[Part 3: basic-sieve-usage](/writing/basic-sieve-usage) covers Sieve, which uses the `X-Spam-Flag` header that SpamAssassin adds to automatically route spam into a dedicated folder.

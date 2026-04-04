---
title: Basic Sieve Usage and Configuration
date: 2015-06-22
updated: 2026-03-27
tag: Email
---

This is part 3 of a series on building a self-hosted mail stack. [Part 1](/writing/simple-smtp-server) covered OpenSMTPD, [Part 2](/writing/basic-dovecot-setup) covered Dovecot, and [Part 2.5](/writing/amavisd-spamassassin-setup) covered spam and virus filtering. This article covers Sieve, a server-side mail filtering language provided by the Pigeonhole plugin bundled with Dovecot 2.x.

## What is Sieve?

Sieve is a server-side protocol for filtering mail before it reaches your mailbox. The advantage over client-side rules is that filters apply regardless of which MUA you use, and mail is sorted even when no client is connected. Sieve scripts can be managed locally or remotely via the ManageSieve protocol.

## Testing Locally

Pigeonhole treats `~/.sieve` as the active script. Write your rules directly to that file and Dovecot will pick them up on the next delivery. Any errors in the script will be logged to `~/.sieve.log`.

Send a test email that would trigger your rules and check the log if something does not behave as expected.

## Managing Scripts Remotely

Sieve scripts can be managed remotely over the ManageSieve protocol, typically on port 4190. Most mail clients with Sieve support can connect to this port to upload and activate scripts.

{% callout type="warning" %}
**Historical note (2015):** At the time of writing, the Sieve plugin for Thunderbird available through the built-in add-on store was broken following an API change. A nightly release was available from the project's GitHub page as a workaround. The plugin situation has likely changed since then, so check the current Thunderbird add-on store before looking elsewhere.
{% /callout %}

Once connected, you can edit and activate scripts directly from your client. Activating a script through ManageSieve creates the `~/.sieve` symlink for you if it does not already exist.

## Basic Sieve Configuration

A few things worth noting before reading the config below:

- Extensions like `fileinto` and `imap4flags` must be declared with `require` before use.
- The `stop` command halts processing after a match. Without it, multiple rules can apply to the same message, which is sometimes intentional but usually not.
- The `addflag` action sets IMAP flags on a message. The `label3` flag used below is a Gmail-style label and is not portable across all clients.

```ini
require ["fileinto", "imap4flags"];

# Route messages flagged as spam by SpamAssassin.
if header :contains "X-Spam-Flag" "YES" {
    fileinto "Spam";
    stop;
}

# Apply the Personal label to mail addressed directly to me.
# Does not stop, allows subsequent rules to also match.
if address :is ["to","cc"] "ehouse@ehouse.io" {
    addflag "label3";
}

# File OpenBSD misc mailing list into openbsd/misc folder.
if address :is ["to","cc"] ["misc@openbsd.org","misc@cvs.openbsd.org"] {
    fileinto "openbsd.misc";
    stop;
}

# File oss-security list into its own folder.
if address :is ["to","cc"] "oss-security@lists.openwall.com" {
    fileinto "oss-security";
    stop;
}

# File system mail from root into logs folder.
if address :is "from" "root@ehouse.io" {
    fileinto "logs";
    stop;
}
```

## Additional Resources

The [Sieve language reference](https://www.ietf.org/rfc/rfc5228.txt) covers the full set of available tests and actions. The Pigeonhole project also maintains a set of usage examples on their documentation site. The syntax is a little unusual at first but straightforward once you have written a few rules.

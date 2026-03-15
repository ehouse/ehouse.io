---
title: Running Ubiquiti in a venue that fights you back
date: 2026-03-01
tag: Networking
---

Showed up to the venue at 8am. The ceiling was essentially a Faraday cage. Great start.

{% callout %}
Always do a site survey before the day of the event. Always.
{% /callout %}

The issue turned out to be channel overlap with the house system. Here's how I found it:

```bash
iwlist scan | grep -E 'ESSID|Channel'
```

Once I identified the congested channels, switching the AP to 5GHz and manually assigning a clean channel solved it.

{% photo src="/images/rack-setup.jpg" alt="The portable rack mid-assembly at the venue" %}

The portable rack handled the rest without complaint.

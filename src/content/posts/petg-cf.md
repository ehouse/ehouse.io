---
title: PETG-CF is not PETG
date: 2026-02-10
tag: 3D Printing
---

I made the mistake of treating PETG-CF like regular PETG on my first spool. Don't do that.

The carbon fiber fill changes everything — it's abrasive, it runs hotter, and it will destroy a brass nozzle faster than you'd expect. Switch to hardened steel before you even load the spool.

## Settings that actually work

After a lot of wasted filament, here's where I landed on the Bambu P1S:

```
Nozzle temp:  260–265°C
Bed temp:     80°C
Speed:        40–60mm/s (slow down from your PETG profile)
Cooling:      Minimal — 20% max fan
```

{% callout %}
The hardened nozzle isn't optional. PETG-CF will wear a brass nozzle noticeably within a single spool.
{% /callout %}

Bed adhesion was also trickier than regular PETG. A thin layer of glue stick on the textured PEI plate solved it for me.

{% photo src="/images/petg-cf-print.jpg" alt="PETG-CF rack mount print fresh off the bed" %}

The results are worth it — the parts are noticeably stiffer and lighter than regular PETG equivalents.

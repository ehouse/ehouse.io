import type { ProjectMeta } from "../../pages/projects";
import { Nav } from "../../components/nav";
import { Layout } from "../../components/layout";
import { ProjectHeader } from "../../components/project-header";
import { html } from "../../html";

export const meta: ProjectMeta = {
  slug: "self-hosted-mail",
  title: "Self-Hosted Mail Stack",
  tag: "Email",
  description:
    "A four-part series building a complete self-hosted mail server with OpenSMTPD, Dovecot, SpamAssassin, and Sieve.",
  photo:
    "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export function render(): string {
  return Layout(html`
    ${Nav("projects")}
    <main class="section">
      <div class="post-panel">
        ${ProjectHeader(meta)}
        <div class="post-body" style="padding-bottom: 0.5rem">
          <div class="post-callout post-callout-info">
            <p>
              <strong>2018 Update:</strong> I no longer self-host my email. I
              switched to Fastmail, which supports Sieve natively along with
              many other features I use daily. My custom domain points to
              Fastmail, so the address stays the same.
            </p>
          </div>
          <p>
            In college I was the primary administrator for a Postfix and Dovecot
            mail server supporting around a thousand users. Managing that system
            taught me a lot about how email actually works. When I set up my own
            personal server years later, I simplified the stack, swapping
            Postfix for OpenSMTPD since Postfix felt like more than I needed for
            a single-user deployment. This series documents the setup I landed
            on.
          </p>
        </div>
        <div class="card-grid" style="margin-bottom: 2rem;">
          <a
            href="/writing/simple-smtp-server"
            data-link
            class="card"
            style="grid-column: span 1"
          >
            <div class="card-body">
              <span class="card-tag">Part 1</span>
              <h3 class="card-title">Basic SMTP Email Server</h3>
              <p class="card-desc">
                Setting up OpenSMTPD as the MTA with TLS and submission port
                configuration.
              </p>
            </div>
          </a>
          <a href="/writing/basic-dovecot-setup" data-link class="card">
            <div class="card-body">
              <span class="card-tag">Part 2</span>
              <h3 class="card-title">Basic Dovecot Setup</h3>
              <p class="card-desc">
                Configuring Dovecot as the MDA for IMAP access and LDA
                integration with OpenSMTPD.
              </p>
            </div>
          </a>
          <a href="/writing/amavisd-spamassassin-setup" data-link class="card">
            <div class="card-body">
              <span class="card-tag">Part 2.5</span>
              <h3 class="card-title">
                Spam Filtering with amavisd and SpamAssassin
              </h3>
              <p class="card-desc">
                Adding amavisd and SpamAssassin between the MTA and mailbox for
                spam and virus filtering.
              </p>
            </div>
          </a>
          <a href="/writing/basic-sieve-usage" data-link class="card">
            <div class="card-body">
              <span class="card-tag">Part 3</span>
              <h3 class="card-title">Basic Sieve Usage and Configuration</h3>
              <p class="card-desc">
                Writing server-side Sieve rules to sort, flag, and route mail
                before it reaches a client.
              </p>
            </div>
          </a>
        </div>
        <div class="page-actions">
          <a href="/projects" data-link class="btn btn-ghost">
            Back to projects
          </a>
        </div>
      </div>
    </main>
  `);
}

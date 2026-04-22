<script setup lang="ts">
interface SocialLink {
  name: string
  href: string
  icon: string
}

interface LegalLink {
  label: string
  href: string
}

const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/michelinguide',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>`,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@TheMICHELINGuide',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.6 2.8 12 2.8 12 2.8s-4.6 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.2.3 4.3.3 4.3s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.3 21.8 12 21.8 12 21.8s4.6 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.3v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.3l8.1 3.6-8.1 3.6z"/></svg>`,
  },
  {
    name: 'X',
    href: 'https://twitter.com/guideMichelinFR',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@michelinguide',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>`,
  },
]

const legalLinks: LegalLink[] = [
  { label: "Conditions d'utilisation", href: '#' },
  { label: 'Politique de confidentialité', href: '#' },
  { label: 'Notice légale', href: '#' },
]
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-main">

        <div class="newsletter-col">
          <h4 class="col-heading">Recevez en avant-première les nouveautés du Guide MICHELIN</h4>
          <form class="newsletter-form" @submit.prevent>
            <input
              type="email"
              class="newsletter-input"
              placeholder="Votre adresse email"
              autocomplete="email"
            />
            <button type="submit" class="newsletter-btn">S'inscrire</button>
          </form>
          <p class="newsletter-legal">
            Vos données sont traitées par MICHELIN pour gérer votre inscription et mesurer la performance de nos communications. Vous pouvez vous désabonner à tout moment.
          </p>
        </div>

        <div class="social-col">
          <h4 class="col-heading">Suivez-nous</h4>
          <div class="social-links">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              :aria-label="social.name"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              v-html="social.icon"
            />
          </div>
        </div>

      </div>

      <div class="divider" />

      <div class="footer-bottom">
        <span class="copyright">© 2026 MICHELIN Guide. Tous droits réservés.</span>
        <nav class="legal-links">
          <a
            v-for="link in legalLinks"
            :key="link.label"
            :href="link.href"
            class="legal-link"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-black);
  border-top: 1px solid rgba(240, 234, 214, 0.1);
  padding: 4rem 0 2rem;
}

.footer-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4rem;
  align-items: start;
}

.col-heading {
  font-family: var(--font-serif), sans-serif;
  font-weight: 400;
  font-size: 1.1rem;
  color: var(--color-cream);
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.02em;
  line-height: 1.4;
  max-width: 32rem;
}

.newsletter-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.newsletter-input {
  flex: 1;
  max-width: 22rem;
  background: transparent;
  border: 1px solid rgba(240, 234, 214, 0.25);
  color: var(--color-cream);
  padding: 0.65rem 1rem;
  font-family: var(--font-sans), sans-serif;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.newsletter-input::placeholder {
  color: var(--color-gray);
}

.newsletter-input:focus {
  border-color: rgba(240, 234, 214, 0.6);
}

.newsletter-btn {
  background: var(--color-red);
  color: var(--color-cream);
  border: none;
  padding: 0.65rem 1.5rem;
  font-family: var(--font-sans), sans-serif;
  font-size: 0.875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.newsletter-btn:hover {
  opacity: 0.85;
}

.newsletter-legal {
  font-size: 0.7rem;
  color: var(--color-gray);
  line-height: 1.5;
  max-width: 32rem;
  margin: 0;
}

.social-col {
  min-width: 10rem;
}

.social-links {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-gray);
  transition: color 0.2s ease;
}

.social-link:hover {
  color: var(--color-cream);
}

.social-link :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
}

.divider {
  height: 1px;
  background: rgba(240, 234, 214, 0.1);
  margin: 3rem 0 1.5rem;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  font-size: 0.75rem;
  color: var(--color-gray);
  letter-spacing: 0.04em;
}

.legal-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.legal-link {
  font-size: 0.75rem;
  color: var(--color-gray);
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: var(--color-cream);
}

@media (max-width: 640px) {
  .footer {
    padding: 2.5rem 0 1.5rem;
  }

  .footer-inner {
    padding: 0 1.25rem;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .col-heading {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .newsletter-form {
    flex-direction: column;
    gap: 0.5rem;
  }

  .newsletter-input {
    max-width: 100%;
  }

  .newsletter-btn {
    width: 100%;
    text-align: center;
  }

  .divider {
    margin: 2rem 0 1rem;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .legal-links {
    gap: 0.75rem;
    flex-direction: column;
  }
}
</style>

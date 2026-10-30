import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export function PageHero({
  number,
  eyebrow,
  title,
  accent,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
}) {
  return (
    <section className="inner-hero" id="top">
      <div className="hero-grid-pattern" />
      <div className="container inner-hero-content">
        <div className="section-label">
          <span>{number}</span> {eyebrow}
        </div>
        <h1>
          {title} {accent && <span className="gradient-text">{accent}</span>}
        </h1>
        <p>{description}</p>
        <div className="inner-hero-actions">
          <a className="button button-primary" href="/contact">
            Talk to Our Team <span>↗</span>
          </a>
          <a className="button button-secondary" href="/ecosystem">
            Explore Our Ecosystem <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function ContentPage({ children }: { children: ReactNode }) {
  return (
    <main>
      <SiteHeader />
      {children}
      <SiteFooter />
    </main>
  );
}

export function SectionHeading({
  label,
  title,
  accent,
  description,
}: {
  label: string;
  title: string;
  accent?: string;
  description?: string;
}) {
  return (
    <div className="section-top inner-section-top">
      <div>
        <div className="section-label">
          <span>✳</span> {label}
        </div>
        <h2 className="section-heading">
          {title} {accent && <span className="gradient-text">{accent}</span>}
        </h2>
      </div>
      {description && <p className="section-intro">{description}</p>}
    </div>
  );
}

export function InfoCard({
  number,
  title,
  text,
  icon = "✳",
}: {
  number?: string;
  title: string;
  text: string;
  icon?: string;
}) {
  return (
    <article className="service-card inner-info-card">
      <div className="service-card-top">
        <span className="service-number">{number ?? "INNOV5"}</span>
        <span className="service-icon">{icon}</span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

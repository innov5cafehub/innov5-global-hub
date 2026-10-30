"use client";
import { useEffect, useState, type FormEvent } from "react";
import {
  ContentPage,
  InfoCard,
  PageHero,
  SectionHeading,
} from "@/components/InnerPage";
type Job = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string;
  department: string;
  location: string;
  employment_type: string;
  requirements: string;
  deadline: string | null;
  published_at: string;
};
type Form = {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  cover_letter: string;
  resume_url: string;
  website: string;
};
const blank: Form = {
  name: "",
  email: "",
  phone: "",
  qualification: "",
  cover_letter: "",
  resume_url: "",
  website: "",
};
const paths = [
  [
    "Technology & Engineering",
    "Software development, product thinking, AI exploration, and responsible technology.",
    "⚙",
  ],
  [
    "Design & Digital Media",
    "User experience, visual identity, communication, and creative problem-solving.",
    "✳",
  ],
  [
    "Research & Innovation",
    "Exploring useful ideas, testing assumptions, and developing solutions to real challenges.",
    "⌕",
  ],
  [
    "Entrepreneurship & Community",
    "Supporting business growth, learning, collaboration, and community initiatives.",
    "◇",
  ],
];
export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Job | null>(null);
  const [form, setForm] = useState<Form>(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    fetch("/api/public/content?kind=careers", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setJobs(d.items || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!active) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const enteredResumeUrl = form.resume_url.trim();
      const currentPageUrls = [
        window.location.href,
        `${window.location.origin}${window.location.pathname}`,
      ];
      const resumeUrl = currentPageUrls.includes(enteredResumeUrl)
        ? ""
        : enteredResumeUrl;

      const r = await fetch("/api/public/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Ignore browser autofill if it inserts the Careers page as the CV.
          resume_url: resumeUrl,
          // The API uses this field as a honeypot; normal applicants should
          // leave it empty.
          website: form.website.trim(),
          job_id: active.id,
        }),
      });
      const d = await r.json();
      if (!r.ok)
        throw new Error(d.error || "Application could not be submitted.");
      setSuccess(d.application_number);
      setForm(blank);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to submit application.",
      );
    } finally {
      setBusy(false);
    }
  }
  const update = (k: keyof Form, v: string) =>
    setForm((old) => ({ ...old, [k]: v }));
  return (
    <ContentPage>
      <PageHero
        number="06"
        eyebrow="CAREERS & OPPORTUNITIES"
        title="Grow your skills."
        accent="Build what matters."
        description="Join a curious, collaborative ecosystem working on useful ideas, technology, and opportunities for growth."
      />
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            label="OPEN POSITIONS"
            title="Find your next"
            accent="opportunity."
            description="Choose a vacancy to review the role and submit your application directly on our website."
          />
          {loading ? (
            <p className="career-feedback">Loading current vacancies…</p>
          ) : jobs.length ? (
            <div className="inner-card-grid">
              {jobs.map((job) => (
                <article
                  className="service-card inner-info-card job-card"
                  key={job.id}
                >
                  <div className="service-card-top">
                    <span className="service-number">
                      {job.department || "CAREER"}
                    </span>
                    <span className="service-icon">↗</span>
                  </div>
                  <h3>{job.title}</h3>
                  <p>{job.summary}</p>
                  <div className="job-meta">
                    <span>⌖ {job.location}</span>
                    <span>◷ {job.employment_type}</span>
                  </div>
                  {job.deadline && (
                    <p className="job-deadline">
                      Apply by {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  )}
                  <details className="article-details">
                    <summary>View role details</summary>
                    <div>
                      <p>{job.body}</p>
                      {job.requirements && (
                        <p>
                          <strong>Requirements:</strong>
                          <br />
                          {job.requirements}
                        </p>
                      )}
                    </div>
                  </details>
                  <button
                    type="button"
                    className="button button-primary career-apply-button"
                    onClick={() => {
                      console.log("Apply button clicked:", job.title);
                      setForm({ ...blank });
                      setError("");
                      setSuccess("");
                      setActive(job);
                    }}
                  >
                    Apply for this vacancy <span aria-hidden="true">↗</span>
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <>
              <SectionHeading
                label="AREAS TO EXPLORE"
                title="Bring your"
                accent="curiosity."
                description="No current vacancies are published. Explore the areas where future opportunities may emerge."
              />
              <div className="inner-card-grid">
                {paths.map(([title, text, icon], i) => (
                  <InfoCard
                    key={title}
                    number={`0${i + 1}`}
                    title={title}
                    text={text}
                    icon={icon}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <section className="section-padding why-section">
        <div className="container contact-container inner-cta-panel">
          <div className="section-label">
            <span>✳</span> NO MATCHING VACANCY?
          </div>
          <h2>Keep in touch.</h2>
          <p>
            Check back for future opportunities or contact our team to introduce
            yourself.
          </p>
          <a
            className="button button-primary"
            href="mailto:innov5cafehub247@gmail.com?subject=Career%20Enquiry"
          >
            Contact the Team <span>↗</span>
          </a>
        </div>
      </section>
      {active && (
        <div
          className="career-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <section
            className="career-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="career-form-title"
          >
            <button
              className="career-modal-close"
              onClick={() => setActive(null)}
              aria-label="Close application form"
            >
              ×
            </button>
            <p className="career-modal-eyebrow">CAREER APPLICATION</p>
            <h2 id="career-form-title">Apply for {active.title}</h2>
            <p className="career-modal-intro">
              Complete the form below. Required fields are marked with an
              asterisk.
            </p>
            {success ? (
              <div className="career-application-success">
                <span>✓</span>
                <h3>Application submitted</h3>
                <p>
                  Your application has been received successfully. Save your
                  application number for future reference.
                </p>
                <strong>{success}</strong>
                <button
                  className="button button-primary"
                  onClick={() => setActive(null)}
                >
                  Done
                </button>
              </div>
            ) : (
              <form className="career-application-form" onSubmit={submit}>
                <label>
                  Full name *
                  <input
                    required
                    maxLength={140}
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </label>
                <label>
                  Email address *
                  <input
                    required
                    type="email"
                    maxLength={254}
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </label>
                <label>
                  Phone number *
                  <input
                    required
                    type="tel"
                    maxLength={60}
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </label>
                <label>
                  Highest qualification / relevant experience *
                  <input
                    required
                    maxLength={180}
                    value={form.qualification}
                    onChange={(e) => update("qualification", e.target.value)}
                    placeholder="e.g. BSc Computer Science, 2 years' experience"
                  />
                </label>
                <label>
                  Cover letter / why you are a good fit *
                  <textarea
                    required
                    minLength={20}
                    maxLength={7000}
                    rows={5}
                    value={form.cover_letter}
                    onChange={(e) => update("cover_letter", e.target.value)}
                  />
                </label>
                <label>
                  CV or portfolio link (optional)
                  <input
                    type="url"
                    name="portfolio_link_manual"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={1000}
                    value={form.resume_url}
                    onChange={(e) => update("resume_url", e.target.value)}
                    placeholder="https://…"
                  />
                  <small>
                    Use a secure share link (Google Drive, OneDrive, or
                    portfolio).
                  </small>
                </label>
                <div
                  className="career-honeypot"
                  aria-hidden="true"
                  hidden
                >
                  <label htmlFor="career-company-fax">
                    Leave this field blank
                  </label>
                  <input
                    id="career-company-fax"
                    name="company_fax_2"
                    type="text"
                    tabIndex={-1}
                    autoComplete="new-password"
                    spellCheck={false}
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                  />
                </div>
                {error && <p className="career-form-error">{error}</p>}
                <button className="button button-primary" disabled={busy}>
                  {busy ? "Submitting application…" : "Submit application"}
                </button>
                <p className="career-privacy-note">
                  Your information will be used by INNOV5 GLOBAL HUB to assess
                  this application.
                </p>
              </form>
            )}
          </section>
        </div>
      )}
    </ContentPage>
  );
}

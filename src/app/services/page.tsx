import {
  ContentPage,
  InfoCard,
  PageHero,
  SectionHeading,
} from "@/components/InnerPage";
const services = [
  [
    "Technology Solutions",
    "Practical technology solutions that help people, businesses, and institutions solve real problems.",
    "⌘",
  ],
  [
    "Software Development",
    "Websites, applications, and digital systems designed around real operational needs.",
    "⚙",
  ],
  [
    "Artificial Intelligence",
    "Exploring useful AI capabilities to improve workflows, decision-making, and digital experiences.",
    "✳",
  ],
  [
    "Digital Transformation",
    "Helping organisations modernise services, processes, and customer experiences with digital tools.",
    "↗",
  ],
  [
    "Innovation & Research",
    "Investigating ideas, emerging technologies, and practical approaches to complex challenges.",
    "⌕",
  ],
  [
    "Entrepreneurship Development",
    "Supporting founders and aspiring entrepreneurs as they shape ideas into sustainable ventures.",
    "◇",
  ],
  [
    "Business Consulting",
    "Helping businesses identify opportunities, improve operations, and plan for responsible growth.",
    "◎",
  ],
  [
    "Technology Education",
    "Promoting digital knowledge, practical skills, and learning opportunities for the next generation.",
    "✧",
  ],
  [
    "Startup Incubation",
    "Creating an environment where promising ideas can develop through guidance, collaboration, and support.",
    "↗",
  ],
  [
    "Branding & Digital Media",
    "Building clear brand identities and engaging visual communication for businesses and initiatives.",
    "✳",
  ],
  [
    "Product Design",
    "Shaping useful digital products through thoughtful user experience and product thinking.",
    "▧",
  ],
  [
    "Community Development",
    "Encouraging digital inclusion, collaboration, and initiatives that create meaningful community impact.",
    "⌘",
  ],
];
export default function ServicesPage() {
  return (
    <ContentPage>
      <PageHero
        number="03"
        eyebrow="SERVICES & SOLUTIONS"
        title="Practical expertise."
        accent="Purposeful innovation."
        description="Our areas of work connect technology, creativity, research, and business thinking to address practical needs and create opportunities for growth."
      />
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            label="WHAT WE DO"
            title="12 areas of"
            accent="possibility."
            description="Our capabilities can be combined around the needs of a project, organisation, or community. Scope and delivery are agreed for each engagement."
          />
          <div className="inner-card-grid">
            {services.map(([title, text, icon], i) => (
              <InfoCard
                key={title}
                number={String(i + 1).padStart(2, "0")}
                title={title}
                text={text}
                icon={icon}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding why-section">
        <div className="container story-grid">
          <div>
            <SectionHeading
              label="HOW WE WORK"
              title="Start with the"
              accent="real problem."
            />
          </div>
          <div className="story-copy">
            <p>
              We begin by understanding the challenge, the people affected, and
              the outcome that matters. From there, we shape a practical
              approach, identify the right capabilities, and work toward a
              solution that can evolve.
            </p>
            <p>
              We value clear communication, thoughtful design, responsible
              technology, and collaboration throughout the process.
            </p>
            <a className="button button-primary" href="/contact">
              Discuss Your Needs <span>↗</span>
            </a>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}

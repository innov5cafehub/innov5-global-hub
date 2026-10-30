import {
  ContentPage,
  InfoCard,
  PageHero,
  SectionHeading,
} from "@/components/InnerPage";
const opportunities = [
  [
    "Strategic Partnerships",
    "Collaborate on initiatives that align technology, entrepreneurship, education, and community development.",
    "◇",
  ],
  [
    "Institutional Collaboration",
    "Explore programmes with schools, organisations, public institutions, and community groups.",
    "⌘",
  ],
  [
    "Startup & Founder Support",
    "Connect around promising ideas, early-stage products, business development, and shared learning.",
    "✳",
  ],
  [
    "Technology Projects",
    "Work together on digital products, research, digital transformation, and practical technology delivery.",
    "⚙",
  ],
  [
    "Community Initiatives",
    "Develop activities that support digital inclusion, skills development, and meaningful local impact.",
    "◎",
  ],
  [
    "Business Collaboration",
    "Identify opportunities to combine complementary capabilities and build sustainable value.",
    "↗",
  ],
];
export default function PartnershipsPage() {
  return (
    <ContentPage>
      <PageHero
        number="05"
        eyebrow="PARTNERSHIPS"
        title="Progress happens"
        accent="together."
        description="We believe collaboration can turn promising ideas into stronger solutions. INNOV5 GLOBAL HUB welcomes thoughtful conversations with organisations, founders, institutions, and people who share our ambition."
      />
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            label="WAYS TO COLLABORATE"
            title="Let's create"
            accent="shared value."
            description="Partnerships begin with a shared challenge, a clear purpose, and a commitment to meaningful outcomes."
          />
          <div className="inner-card-grid">
            {opportunities.map(([title, text, icon], i) => (
              <InfoCard
                key={title}
                number={`0${i + 1}`}
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
              label="START A CONVERSATION"
              title="Tell us what"
              accent="you have in mind."
            />
          </div>
          <div className="story-copy">
            <p>
              Share a little about your organisation, the opportunity you see,
              and what you hope to achieve. Our team can use that information to
              understand whether there is a practical basis for collaboration.
            </p>
            <p>
              We review partnership enquiries individually. Submitting an
              enquiry does not imply a commitment or guarantee of funding,
              investment, or programme acceptance.
            </p>
            <a
              className="button button-primary"
              href="mailto:innov5cafehub247@gmail.com?subject=INNOV5%20Partnership%20Enquiry&body=Hello%20INNOV5%20GLOBAL%20HUB%2C%0A%0AOrganisation%3A%0AContact%20person%3A%0APartnership%20idea%3A%0ADesired%20outcome%3A"
            >
              Send Partnership Enquiry <span>↗</span>
            </a>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}

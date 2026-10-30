import { ContentPage, PageHero, SectionHeading } from "@/components/InnerPage";

const ventures = [
  {
    mark: "C",
    type: "TECHNOLOGY · CREATIVITY · ENTREPRENEURSHIP",
    name: "Innov5 Cafe' Hub",
    text: "A technology-inspired collaborative space where innovation, entrepreneurship, networking, learning, and creativity meet. It is designed to bring curious minds together and help ideas move forward.",
    link: "mailto:innov5cafehub247@gmail.com?subject=Innov5%20Cafe%20Hub%20Enquiry",
    cta: "Enquire about Cafe' Hub",
  },
  {
    mark: "V",
    type: "DIGITAL COMMERCE",
    name: "VendiLink",
    text: "A digital commerce platform helping businesses establish an online presence, showcase products, and connect with customers more effectively. VendiLink is focused on making online selling more accessible to businesses.",
    link: "https://vendilink.vercel.app/",
    cta: "Explore VendiLink",
  },
  {
    mark: "5",
    type: "RESEARCH · PRODUCT DEVELOPMENT",
    name: "Future Innovations",
    text: "An umbrella for future products, research initiatives, and technology projects that respond to practical needs. New ventures and strategic initiatives may join the ecosystem as the organisation grows.",
    link: "/contact",
    cta: "Discuss an idea",
  },
];
export default function EcosystemPage() {
  return (
    <ContentPage>
      <PageHero
        number="02"
        eyebrow="OUR ECOSYSTEM"
        title="One vision."
        accent="Many possibilities."
        description="INNOV5 GLOBAL HUB is the parent organisation connecting ventures, products, and initiatives that share a commitment to innovation and meaningful impact."
      />
      <section className="section-padding ecosystem-section">
        <div className="container">
          <SectionHeading
            label="OUR VENTURES"
            title="Different missions."
            accent="Shared ambition."
            description="Each venture serves a distinct purpose while contributing to a broader vision for technology, entrepreneurship, and inclusive growth."
          />
          <div className="ecosystem-grid">
            {ventures.map((v) => (
              <article className="ecosystem-card" key={v.name}>
                <div className="ecosystem-mark">{v.mark}</div>
                <span className="solution-category">{v.type}</span>
                <h3>{v.name}</h3>
                <p>{v.text}</p>
                <a
                  className="text-link"
                  href={v.link}
                  target={v.link.startsWith("http") ? "_blank" : undefined}
                  rel={
                    v.link.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {v.cta} <span>↗</span>
                </a>
              </article>
            ))}
          </div>
          <p className="ecosystem-note">
            INNOV5 GLOBAL HUB may develop additional subsidiaries, products, and
            strategic initiatives as the organisation expands.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container contact-container inner-cta-panel">
          <div className="section-label">
            <span>✳</span> BUILDING THE ECOSYSTEM
          </div>
          <h2>Have an idea that belongs here?</h2>
          <p>
            We welcome conversations with founders, collaborators, institutions,
            and organisations interested in building practical solutions.
          </p>
          <a className="button button-primary" href="/partnerships">
            Explore Partnerships <span>↗</span>
          </a>
        </div>
      </section>
    </ContentPage>
  );
}

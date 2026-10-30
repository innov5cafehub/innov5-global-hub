import { ContentPage, PageHero, SectionHeading } from "@/components/InnerPage";
const projects = [
  {
    category: "HEALTHCARE TECHNOLOGY · WEBSITE PROJECT",
    name: "Divine Mercy Hospital",
    text: "A healthcare website project designed to establish a professional digital presence for a healthcare institution and help visitors access essential information.",
    url: "https://divine-mercy-hospital.vercel.app/",
    label: "Visit Project",
    mark: "+",
  },
  {
    category: "DIGITAL COMMERCE · INNOV5 PRODUCT",
    name: "VendiLink",
    text: "A digital commerce platform helping businesses showcase products online and connect with customers more effectively.",
    url: "https://vendilink.vercel.app/",
    label: "Explore VendiLink",
    mark: "V",
  },
  {
    category: "TECHNOLOGY · COMMUNITY · ENTREPRENEURSHIP",
    name: "Innov5 Cafe' Hub",
    text: "A technology-inspired venture centred on creativity, collaboration, digital skills, entrepreneurship, and innovation.",
    url: "mailto:innov5cafehub247@gmail.com?subject=Innov5%20Cafe%20Hub%20Enquiry",
    label: "Contact the Hub",
    mark: "C",
  },
];
export default function ProjectsPage() {
  return (
    <ContentPage>
      <PageHero
        number="04"
        eyebrow="PROJECTS & PORTFOLIO"
        title="Ideas made"
        accent="tangible."
        description="Explore selected projects and initiatives connected to the INNOV5 GLOBAL HUB ecosystem. This portfolio will continue to grow as new work is delivered."
      />
      <section className="section-padding projects-section">
        <div className="container">
          <SectionHeading
            label="SELECTED WORK"
            title="Building useful"
            accent="digital experiences."
            description="We focus on practical outcomes, thoughtful user experiences, and technology that supports real needs."
          />
          <div className="portfolio-grid">
            {projects.map((p, i) => (
              <article className="portfolio-card" key={p.name}>
                <div
                  className={`portfolio-visual ${i === 0 ? "portfolio-hospital" : i === 1 ? "portfolio-commerce" : "portfolio-cafe"}`}
                >
                  <span className="portfolio-category">{p.category}</span>
                  <div className="portfolio-project-mark">{p.mark}</div>
                  <div className="portfolio-visual-caption">
                    <span>INNOV5 ECOSYSTEM</span>
                    <strong>
                      {i === 0
                        ? "Healthcare, connected."
                        : i === 1
                          ? "Your business. Online."
                          : "Curiosity meets creativity."}
                    </strong>
                  </div>
                </div>
                <div className="portfolio-content">
                  <span className="solution-category">PROJECT 0{i + 1}</span>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                  <a
                    className="text-link"
                    href={p.url}
                    target={p.url.startsWith("http") ? "_blank" : undefined}
                    rel={
                      p.url.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {p.label} <span>↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="portfolio-cta">
            <p>Have a challenge you'd like us to help solve?</p>
            <a className="button button-primary" href="/contact">
              Start a Conversation <span>↗</span>
            </a>
          </div>
        </div>
      </section>
    </ContentPage>
  );
}

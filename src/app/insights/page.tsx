import {
  ContentPage,
  InfoCard,
  PageHero,
  SectionHeading,
} from "@/components/InnerPage";
export const dynamic = "force-dynamic";
const topics = [
  [
    "Digital Transformation for Growing Businesses",
    "A practical look at how organisations can identify processes that benefit from digital tools, choose priorities, and improve experiences without adopting technology for its own sake.",
    "01",
  ],
  [
    "Building Products Around Real Problems",
    "Why product development should begin with users, context, and a clear problem statement before choosing features or technology.",
    "02",
  ],
  [
    "Innovation, Skills & Opportunity",
    "How digital literacy, collaboration, and practical learning can help more people participate in the technology economy.",
    "03",
  ],
  [
    "Digital Commerce for Small Businesses",
    "Considerations for presenting products online, building customer confidence, and creating a more consistent buying experience.",
    "04",
  ],
  [
    "Responsible Uses of Artificial Intelligence",
    "An introduction to approaching AI with clear goals, human oversight, privacy awareness, and realistic expectations.",
    "05",
  ],
  [
    "Partnerships That Create Impact",
    "How shared goals, clear roles, and honest communication help collaborations become more effective.",
    "06",
  ],
];
type Article = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: string;
  author: string;
  featured_image: string;
  published_at: string;
};
async function getArticles(): Promise<Article[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  try {
    const r = await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/news_articles?select=id,title,slug,summary,body,category,author,featured_image,published_at&status=eq.published&order=published_at.desc&limit=50`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      },
    );
    return r.ok ? await r.json() : [];
  } catch {
    return [];
  }
}
export default async function InsightsPage() {
  const articles = await getArticles();
  return (
    <ContentPage>
      <PageHero
        number="07"
        eyebrow="NEWS & INSIGHTS"
        title="Ideas worth"
        accent="putting to work."
        description="Perspectives on technology, entrepreneurship, digital transformation, and the practical work of turning ideas into solutions."
      />
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            label={articles.length ? "LATEST PUBLICATIONS" : "EDITORIAL THEMES"}
            title={articles.length ? "Latest news &" : "Explore what we're"}
            accent={articles.length ? "insights." : "thinking about."}
            description={
              articles.length
                ? "Updates and articles from the INNOV5 GLOBAL HUB ecosystem."
                : "Our editorial themes for future articles and company updates. These are themes, not already-published articles."
            }
          />
          <div className="inner-card-grid">
            {articles.length
              ? articles.map((a) => (
                  <article
                    className="service-card inner-info-card published-article"
                    key={a.id}
                  >
                    {a.featured_image && (
                      <img
                        src={a.featured_image}
                        alt=""
                        className="article-image"
                      />
                    )}
                    <div className="service-card-top">
                      <span className="service-number">
                        {a.category || "INSIGHTS"}
                      </span>
                      <span className="service-icon">✧</span>
                    </div>
                    <h3>{a.title}</h3>
                    <p>{a.summary}</p>
                    <small className="article-meta">
                      {a.author || "INNOV5 GLOBAL HUB"}
                      {a.published_at
                        ? ` · ${new Date(a.published_at).toLocaleDateString()}`
                        : ""}
                    </small>
                    <details className="article-details">
                      <summary>Read article</summary>
                      <div>
                        {a.body.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </details>
                  </article>
                ))
              : topics.map(([title, text, number]) => (
                  <InfoCard
                    key={number}
                    number={number}
                    title={title}
                    text={text}
                    icon="✧"
                  />
                ))}
          </div>
        </div>
      </section>
      <section className="section-padding why-section">
        <div className="container contact-container inner-cta-panel">
          <div className="section-label">
            <span>✳</span> HAVE A STORY OR IDEA?
          </div>
          <h2>Let&apos;s exchange perspectives.</h2>
          <p>
            Have an innovation story, partnership update, or idea relevant to
            our ecosystem? Contact the team to start a conversation.
          </p>
          <a
            className="button button-primary"
            href="mailto:innov5cafehub247@gmail.com?subject=News%20and%20Insights%20Enquiry"
          >
            Contact the Team <span>↗</span>
          </a>
        </div>
      </section>
    </ContentPage>
  );
}

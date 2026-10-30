"use client";

import { useState } from "react";
import Image from "next/image";

const services = [
  {
    number: "01",
    title: "Technology Solutions",
    description:
      "Practical technology solutions that help people, businesses, and institutions solve real problems.",
    icon: "⌘",
  },
  {
    number: "02",
    title: "Software Development",
    description:
      "Purpose-built websites, applications, and digital systems designed around real operational needs.",
    icon: "⚙",
  },
  {
    number: "03",
    title: "Artificial Intelligence",
    description:
      "Exploring useful AI capabilities to improve workflows, decision-making, and digital experiences.",
    icon: "✳",
  },
  {
    number: "04",
    title: "Digital Transformation",
    description:
      "Helping organisations use digital tools to modernise services, processes, and customer experiences.",
    icon: "↗",
  },
  {
    number: "05",
    title: "Innovation & Research",
    description:
      "Investigating ideas, emerging technologies, and practical approaches to complex challenges.",
    icon: "⌕",
  },
  {
    number: "06",
    title: "Entrepreneurship Development",
    description:
      "Supporting founders and aspiring entrepreneurs as they shape ideas into sustainable ventures.",
    icon: "◇",
  },
  {
    number: "07",
    title: "Business Consulting",
    description:
      "Helping businesses identify opportunities, improve operations, and plan for responsible growth.",
    icon: "◎",
  },
  {
    number: "08",
    title: "Technology Education",
    description:
      "Promoting digital knowledge, practical skills, and learning opportunities for the next generation.",
    icon: "✧",
  },
  {
    number: "09",
    title: "Startup Incubation",
    description:
      "Creating an environment where promising ideas can develop through guidance, collaboration, and support.",
    icon: "↗",
  },
  {
    number: "10",
    title: "Branding & Digital Media",
    description:
      "Building clear brand identities and engaging visual communication for businesses and initiatives.",
    icon: "✳",
  },
  {
    number: "11",
    title: "Product Design",
    description:
      "Shaping useful, accessible digital products through thoughtful user experience and product thinking.",
    icon: "▧",
  },
  {
    number: "12",
    title: "Community Development",
    description:
      "Encouraging digital inclusion, collaboration, and initiatives that create meaningful community impact.",
    icon: "⌘",
  },
];

const solutions = [
  {
    name: "VendiLink",
    category: "DIGITAL COMMERCE",
    description:
      "Our digital commerce platform helps businesses establish an online presence, showcase products, and connect with customers more effectively.",
    badge: "DIGITAL COMMERCE PRODUCT",
    letter: "V",
    href: "https://vendilink.vercel.app/",
    linkText: "Explore VendiLink",
  },
  {
    name: "Innov5 Cafe' Hub",
    category: "TECHNOLOGY & ENTREPRENEURSHIP",
    description:
      "A technology-inspired collaborative space where innovation, entrepreneurship, networking, learning, and creativity meet.",
    badge: "INNOVATION & COLLABORATION",
    letter: "C",
    href: "mailto:innov5cafehub247@gmail.com?subject=Innov5%20Cafe%20Hub%20Enquiry",
    linkText: "Enquire About Cafe' Hub",
  },
  {
    name: "Future Innovations",
    category: "RESEARCH & DEVELOPMENT",
    description:
      "We explore emerging technologies, develop practical software, and pursue new ideas that address real-world challenges.",
    badge: "BUILDING WHAT COMES NEXT",
    letter: "5",
    href: "#contact",
    linkText: "Discuss an Innovation",
  },
];

const values = [
  {
    title: "Innovation",
    text: "We explore new ideas and develop transformative technologies that address real-world challenges.",
    icon: "✳",
  },
  {
    title: "Integrity",
    text: "We build trust through honesty, transparency, responsibility, and ethical business practices.",
    icon: "◇",
  },
  {
    title: "Excellence",
    text: "We pursue quality in our products, services, partnerships, and customer experiences.",
    icon: "↗",
  },
  {
    title: "Collaboration",
    text: "We bring people, ideas, and organisations together to create solutions with greater impact.",
    icon: "⌘",
  },
  {
    title: "Empowerment",
    text: "We support individuals, entrepreneurs, and communities with opportunities to learn, build, and grow.",
    icon: "✧",
  },
  {
    title: "Impact",
    text: "We focus on creating practical solutions that improve lives and contribute to sustainable development.",
    icon: "◎",
  },
  {
    title: "Global Mindset",
    text: "We develop ideas with the ambition to serve African communities and create value around the world.",
    icon: "↗",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      {/* NAVIGATION */}
      <header className="site-header">
        <div className="container nav-container">
          <a
            href="#home"
            className="brand"
            aria-label="Innov5 Global Hub homepage"
            onClick={closeMenu}
          >
            <span className="brand-image">
              <Image
                src="/innov5-global-hub-logo.png"
                alt="INNOV5 GLOBAL HUB — Innovating Tomorrow, Today"
                width={300}
                height={300}
                priority
                className="brand-logo-image"
              />
            </span>

            <span className="brand-copy">
              <strong>INNOV5</strong>
              <small>GLOBAL HUB</small>
            </span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <nav
            className={`nav-links ${menuOpen ? "nav-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="/" onClick={closeMenu}>
              Home
            </a>
            <a href="/about" onClick={closeMenu}>
              About
            </a>
            <a href="/ecosystem" onClick={closeMenu}>
              Ecosystem
            </a>
            <a href="/services" onClick={closeMenu}>
              Services
            </a>
            <a href="/projects" onClick={closeMenu}>
              Projects
            </a>
            <a href="/partnerships" onClick={closeMenu}>
              Partnerships
            </a>
            <a href="/careers" onClick={closeMenu}>
              Careers
            </a>
            <a href="/insights" onClick={closeMenu}>
              Insights
            </a>
            <a href="/contact" onClick={closeMenu}>
              Contact
            </a>
            <a
              href="https://wa.me/2349033543367?text=Hello%20INNOV5%20GLOBAL%20HUB%2C%20I%20would%20like%20to%20make%20an%20enquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta"
              onClick={closeMenu}
            >
              Let&apos;s Talk <span>↗</span>
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-grid-pattern" />

        <div className="container hero-container">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot" />
              TECHNOLOGY · CREATIVITY · INNOVATION
            </div>

            <h1>
              Innovating
              <br />
              Tomorrow,
              <br />
              <span className="gradient-text">Today.</span>
            </h1>

            <p className="hero-description">
              We turn bold ideas into meaningful digital experiences. Discover
              technology solutions designed to help businesses grow, innovate,
              and move forward.
            </p>

            <div className="hero-actions">
              <a href="#solutions" className="button button-primary">
                Explore Our Solutions <span>↗</span>
              </a>

              <a href="#about" className="button button-secondary">
                Discover Innov5 <span>→</span>
              </a>
            </div>

            <div className="hero-note">
              <span className="hero-note-line" />A technology company built
              around possibilities.
            </div>
          </div>

          <div
            className="hero-visual"
            aria-label="Abstract digital innovation artwork"
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />

            <div className="visual-glow" />

            <div className="floating-card card-top">
              <span className="card-icon">✳</span>
              <div>
                <strong>Think Different</strong>
                <small>Challenge the ordinary</small>
              </div>
            </div>

            <div className="hero-emblem">
              <div className="emblem-inner">
                <span className="emblem-symbol">5</span>
                <span className="emblem-caption">INNOVATE</span>
              </div>
            </div>

            <div className="floating-card card-bottom">
              <span className="mini-chart">↗</span>
              <div>
                <strong>Build What&apos;s Next</strong>
                <small>Ideas into solutions</small>
              </div>
              <span className="live-dot" />
            </div>

            <div className="visual-label label-left">
              <span>01</span>
              DIGITAL THINKING
            </div>

            <div className="visual-label label-right">
              FUTURE READY <span>02</span>
            </div>

            <div className="visual-cross cross-one">+</div>
            <div className="visual-cross cross-two">+</div>
          </div>
        </div>

        <div className="hero-bottom container">
          <span>INNOVATION STARTS WITH AN IDEA</span>
          <span className="scroll-indicator">
            SCROLL TO EXPLORE <span>↓</span>
          </span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="intro-section section-padding" id="about">
        <div className="container intro-grid">
          <div>
            <div className="section-label">
              <span>01</span> WHO WE ARE
            </div>

            <h2 className="section-heading">
              Technology is our tool.
              <br />
              <span className="muted-heading">Possibility is our purpose.</span>
            </h2>
          </div>

          <div className="intro-copy">
            <p>
              INNOV5 GLOBAL HUB is a technology and innovation company committed
              to transformative solutions that empower individuals, businesses,
              institutions, and communities. As a parent organisation, we bring
              together technology-driven ventures focused on digital
              transformation, entrepreneurship, education, research, and
              business growth.
            </p>

            <p>
              We believe innovation should be practical, inclusive, and
              impactful. We bring creativity, technical expertise, and
              collaboration together to help promising ideas become useful
              products, services, and enterprises.
            </p>

            <a href="#mission" className="text-link">
              Get to know our vision <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* OUR STORY & PURPOSE */}
      <section className="company-story section-padding" id="story">
        <div className="container story-grid">
          <div>
            <div className="section-label">
              <span>01A</span> OUR STORY
            </div>
            <h2 className="section-heading">
              Great ideas can come from anywhere.
              <br />
              <span className="gradient-text">They need room to grow.</span>
            </h2>
          </div>
          <div className="story-copy">
            <p>
              INNOV5 GLOBAL HUB was founded on the belief that promising ideas
              need the right environment, tools, guidance, and support to become
              meaningful solutions.
            </p>
            <p>
              We recognise the challenges faced by young innovators, startups,
              and small businesses—including access to technology, mentorship,
              business support, and opportunities to grow. Our response is to
              build an innovation ecosystem, not just a single business.
            </p>
            <div className="purpose-statement">
              <span>OUR PURPOSE</span>
              <p>
                To inspire innovation, unlock potential, and build technologies
                and enterprises that improve lives and shape the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section section-padding" id="services">
        <div className="container">
          <div className="section-top">
            <div>
              <div className="section-label">
                <span>02</span> WHAT WE DO
              </div>

              <h2 className="section-heading">
                Ideas meet <span className="gradient-text">execution.</span>
              </h2>
            </div>

            <p className="section-intro">
              We combine technical expertise and creative thinking to deliver
              digital solutions for real-world needs.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-card-top">
                  <span className="service-number">{service.number}</span>
                  <span className="service-icon">{service.icon}</span>
                </div>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <a
                  href="#contact"
                  className="service-link"
                  aria-label={`Enquire about ${service.title}`}
                >
                  <span>Discuss a project</span>
                  <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="solutions-section section-padding" id="solutions">
        <div className="container">
          <div className="section-top">
            <div>
              <div className="section-label">
                <span>03</span> OUR SOLUTIONS
              </div>

              <h2 className="section-heading">
                Built to solve.
                <br />
                <span className="muted-heading">Designed to evolve.</span>
              </h2>
            </div>

            <p className="section-intro">
              Explore the products and technology initiatives taking shape
              within the Innov5 ecosystem.
            </p>
          </div>

          <div className="solutions-grid">
            {solutions.map((solution, index) => (
              <article
                className={`solution-card solution-card-${index + 1}`}
                key={solution.name}
              >
                <div className="solution-art">
                  <div className="solution-art-ring ring-one" />
                  <div className="solution-art-ring ring-two" />

                  <span className="solution-letter">{solution.letter}</span>

                  <span className="solution-art-plus">+</span>
                  <span className="solution-art-dot" />
                </div>

                <div className="solution-body">
                  <span className="solution-category">{solution.category}</span>

                  <h3>{solution.name}</h3>

                  <p>{solution.description}</p>

                  <a
                    href={solution.href}
                    target={
                      solution.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      solution.href.startsWith("http")
                        ? "noreferrer"
                        : undefined
                    }
                    className="text-link"
                  >
                    {solution.linkText} <span>↗</span>
                  </a>

                  <span className="solution-badge">{solution.badge}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION AND VISION */}
      <section className="purpose-section section-padding" id="mission">
        <div className="container">
          <div className="section-label">
            <span>04</span> OUR PURPOSE
          </div>

          <div className="purpose-grid">
            <article className="purpose-card purpose-card-primary">
              <span className="purpose-index">01 / OUR MISSION</span>

              <div className="purpose-icon">◎</div>

              <h2>Empowering ideas through innovation.</h2>

              <p>
                To discover, develop, and support innovative ideas, businesses,
                and technologies by providing world-class digital solutions,
                entrepreneurship support, research, education, and collaborative
                platforms that empower communities and drive sustainable growth.
              </p>
            </article>

            <article className="purpose-card">
              <span className="purpose-index">02 / OUR VISION</span>

              <div className="purpose-icon">✧</div>

              <h2>Building a future without limits.</h2>

              <p>
                To become Africa's leading innovation ecosystem, empowering
                people and organizations to build transformative solutions that
                create lasting global impact.
              </p>
            </article>
          </div>

          <div className="values-heading">
            <h3>What guides us</h3>
            <p>The principles behind every idea we pursue.</p>
          </div>

          <div className="values-grid">
            {values.map((value) => (
              <article className="value-item" key={value.title}>
                <span className="value-icon">{value.icon}</span>
                <h4>{value.title}</h4>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="ecosystem-section section-padding" id="ecosystem">
        <div className="container">
          <div className="section-top">
            <div>
              <div className="section-label">
                <span>04A</span> OUR ECOSYSTEM
              </div>
              <h2 className="section-heading">
                One hub.
                <br />
                <span className="gradient-text">
                  Many ways to create impact.
                </span>
              </h2>
            </div>
            <p className="section-intro">
              INNOV5 GLOBAL HUB is the parent organisation bringing together
              ventures and initiatives with a shared commitment to technology,
              entrepreneurship, and practical innovation.
            </p>
          </div>
          <div className="ecosystem-grid">
            <article className="ecosystem-card">
              <span className="ecosystem-mark">IG</span>
              <span className="solution-category">PARENT COMPANY</span>
              <h3>INNOV5 GLOBAL HUB</h3>
              <p>
                The umbrella organisation developing technology-driven ventures
                and initiatives focused on digital transformation, education,
                research, entrepreneurship, and business growth.
              </p>
              <a href="#about" className="text-link">
                Explore our vision <span>↗</span>
              </a>
            </article>
            <article className="ecosystem-card">
              <span className="ecosystem-mark">C</span>
              <span className="solution-category">
                TECHNOLOGY & ENTREPRENEURSHIP
              </span>
              <h3>Innov5 Cafe&apos; Hub</h3>
              <p>
                A technology-inspired collaborative space for learning,
                creativity, networking, entrepreneurship, and innovation.
              </p>
              <a
                href="mailto:innov5cafehub247@gmail.com?subject=Innov5%20Cafe%20Hub%20Enquiry"
                className="text-link"
              >
                Connect with the Hub <span>↗</span>
              </a>
            </article>
            <article className="ecosystem-card">
              <span className="ecosystem-mark">V</span>
              <span className="solution-category">DIGITAL COMMERCE</span>
              <h3>VendiLink</h3>
              <p>
                A digital commerce platform helping businesses establish an
                online presence, showcase products, and connect with customers
                more effectively.
              </p>
              <a
                href="https://vendilink.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Visit VendiLink <span>↗</span>
              </a>
            </article>
          </div>
          <p className="ecosystem-note">
            Additional subsidiaries and strategic initiatives may join the
            ecosystem as the organisation grows.
          </p>
        </div>
      </section>

      {/* WHY INNOV5 */}
      <section className="why-section section-padding" id="why-us">
        <div className="container">
          <div className="section-top">
            <div>
              <div className="section-label">
                <span>04B</span> WHY INNOV5
              </div>
              <h2 className="section-heading">
                Innovation with <span className="gradient-text">purpose.</span>
              </h2>
            </div>
            <p className="section-intro">
              We pair ambition with practical execution, putting people and
              meaningful outcomes at the centre of our work.
            </p>
          </div>
          <div className="why-grid">
            {[
              "Innovative Thinking",
              "Technology-Driven Solutions",
              "Customer-Centered Approach",
              "Youth Empowerment Focus",
              "Strategic Partnerships",
              "Scalable Business Models",
              "Commitment to Excellence",
            ].map((item, i) => (
              <article className="why-item" key={item}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{item}</h3>
                <p>
                  {
                    [
                      "We question assumptions and stay open to better ways of solving problems.",
                      "We use appropriate technology to create useful, practical outcomes.",
                      "We consider the needs and experiences of the people our solutions serve.",
                      "We want young people to have opportunities to learn, create, and build.",
                      "We believe collaboration expands knowledge, opportunity, and impact.",
                      "We aim to develop ventures and products that can grow responsibly.",
                      "We hold our work to high standards of quality, trust, and responsibility.",
                    ][i]
                  }
                </p>
              </article>
            ))}
          </div>
          <div className="goals-commitment-grid">
            <article className="goals-panel">
              <span className="solution-category">OUR LONG-TERM GOALS</span>
              <h3>Build for lasting impact.</h3>
              <ul>
                <li>Build globally recognised technology products.</li>
                <li>
                  Support entrepreneurs, startups, and impactful businesses.
                </li>
                <li>Create employment and promote digital inclusion.</li>
                <li>Establish innovation hubs across Africa.</li>
                <li>
                  Develop world-class talent and become one of Africa&apos;s
                  respected innovation companies.
                </li>
              </ul>
            </article>
            <article className="commitment-panel">
              <span className="solution-category">OUR COMMITMENT</span>
              <h3>A future where innovation is accessible to everyone.</h3>
              <p>
                Through technology, collaboration, and entrepreneurship, we will
                keep working to develop solutions that create value, inspire
                progress, and improve lives.
              </p>
              <a href="#contact" className="text-link">
                Build with us <span>↗</span>
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects-section section-padding" id="projects">
        <div className="container">
          <div className="section-top">
            <div>
              <div className="section-label">
                <span>07</span> OUR WORK
              </div>

              <h2 className="section-heading">
                Ideas turned into
                <br />
                <span className="gradient-text">digital experiences.</span>
              </h2>
            </div>

            <p className="section-intro">
              We build digital experiences and explore technology solutions that
              address practical needs across different industries.
            </p>
          </div>

          <div className="portfolio-grid">
            <article className="portfolio-card">
              <div className="portfolio-visual portfolio-hospital">
                <span className="portfolio-category">
                  HEALTHCARE TECHNOLOGY
                </span>

                <div className="hospital-symbol">+</div>

                <div className="portfolio-visual-caption">
                  <span>WEB DEVELOPMENT</span>
                  <strong>Healthcare, connected.</strong>
                </div>
              </div>

              <div className="portfolio-content">
                <span className="solution-category">WEBSITE PROJECT</span>

                <h3>Divine Mercy Hospital</h3>

                <p>
                  A healthcare website project developed to establish a
                  professional digital presence for a healthcare institution.
                </p>

                <a
                  href="https://divine-mercy-hospital.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  Visit Project <span>↗</span>
                </a>
              </div>
            </article>

            <article className="portfolio-card">
              <div className="portfolio-visual portfolio-commerce">
                <span className="portfolio-category">DIGITAL COMMERCE</span>

                <div className="commerce-symbol">V</div>

                <div className="portfolio-visual-caption">
                  <span>INNOV5 PRODUCT</span>
                  <strong>Your business. Online.</strong>
                </div>
              </div>

              <div className="portfolio-content">
                <span className="solution-category">OUR PRODUCT</span>

                <h3>VendiLink</h3>

                <p>
                  A digital commerce platform helping businesses showcase
                  products online and connect with customers.
                </p>

                <a
                  href="https://vendilink.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  Explore VendiLink <span>↗</span>
                </a>
              </div>
            </article>

            <article className="portfolio-card">
              <div className="portfolio-visual portfolio-cafe">
                <span className="portfolio-category">
                  INNOVATION & COMMUNITY
                </span>

                <div className="cafe-symbol">C</div>

                <div className="portfolio-visual-caption">
                  <span>INNOV5 VENTURE</span>
                  <strong>Where curiosity meets creativity.</strong>
                </div>
              </div>

              <div className="portfolio-content">
                <span className="solution-category">TECHNOLOGY HUB</span>

                <h3>Innov5 Cafe' Hub</h3>

                <p>
                  A technology-inspired venture centred on creativity,
                  collaboration, digital skills, entrepreneurship, and
                  innovation.
                </p>

                <a
                  href="mailto:innov5cafehub247@gmail.com?subject=Innov5%20Cafe%20Hub%20Enquiry"
                  className="text-link"
                >
                  Contact the Hub <span>↗</span>
                </a>
              </div>
            </article>
          </div>

          <div className="portfolio-cta">
            <p>Have a project that needs a digital solution?</p>

            <a
              href="https://wa.me/2349033543367?text=Hello%20INNOV5%20GLOBAL%20HUB%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20your%20team."
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary"
            >
              Let&apos;s Discuss Your Project <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="contact-section section-padding" id="contact">
        <div className="container contact-container">
          <div className="contact-glow" />

          <div className="section-label">
            <span>08</span> LET&apos;S BUILD SOMETHING
          </div>

          <h2>
            Have an idea?
            <br />
            <span className="gradient-text">Let&apos;s make it real.</span>
          </h2>

          <p>
            Whether you have a project, a business challenge, or an idea waiting
            to happen, we&apos;re ready to start the conversation.
          </p>

          <div className="contact-actions">
            <a
              href="mailto:innov5cafehub247@gmail.com?subject=Business%20Enquiry&body=Hello%20INNOV5%20GLOBAL%20HUB%2C%0A%0AI%20would%20like%20to%20make%20a%20business%20enquiry.%0A%0AName%3A%0ABusiness%3A%0AEnquiry%3A"
              className="button button-primary"
            >
              Send a Business Enquiry <span>↗</span>
            </a>

            <a href="#home" className="button button-secondary">
              Back to Top ↑
            </a>
          </div>

          <span className="contact-decoration">INNOV5</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <a href="#home" className="brand footer-brand">
              <span className="brand-image">
                <Image
                  src="/innov5-global-hub-logo.png"
                  alt="INNOV5 GLOBAL HUB — Innovating Tomorrow, Today"
                  width={300}
                  height={300}
                  priority
                  className="brand-logo-image"
                />
              </span>

              <span className="brand-copy">
                <strong>INNOV5</strong>
                <small>GLOBAL HUB</small>
              </span>
            </a>

            <p className="footer-tagline">Innovating Tomorrow, Today.</p>

            <a href="#home" className="footer-back">
              BACK TO TOP ↑
            </a>
          </div>

          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} INNOV5 GLOBAL HUB. All rights
              reserved.
            </p>

            <div className="footer-links">
              <a href="mailto:innov5cafehub247@gmail.com">Email Us</a>
              <a href="#about">About</a>
              <a href="#solutions">Solutions</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

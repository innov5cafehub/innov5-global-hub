import { ContentPage, PageHero, SectionHeading } from "@/components/InnerPage";
import ContactEnquiryForm from "@/components/ContactEnquiryForm";
export default function ContactPage() {
  return (
    <ContentPage>
      <PageHero
        number="08"
        eyebrow="CONTACT INNOV5"
        title="Let's start a"
        accent="conversation."
        description="Tell us about your project, business challenge, partnership idea, or question. We look forward to understanding what you want to build."
      />
      <section className="section-padding">
        <div className="container contact-page-grid">
          <div>
            <SectionHeading
              label="GET IN TOUCH"
              title="A good idea starts"
              accent="with a conversation."
            />
            <p className="inner-lead">
              Choose the channel that works best for you, or use the secure
              enquiry form to send us a message directly.
            </p>
            <div className="contact-detail-list">
              <a
                className="contact-detail"
                href="mailto:innov5cafehub247@gmail.com"
              >
                <span className="contact-detail-icon">@</span>
                <span>
                  <small>EMAIL</small>
                  <strong>innov5cafehub247@gmail.com</strong>
                </span>
                <span>↗</span>
              </a>
              <a
                className="contact-detail"
                href="https://wa.me/2349033543367?text=Hello%20INNOV5%20GLOBAL%20HUB%2C%20I%20would%20like%20to%20make%20an%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-detail-icon">↗</span>
                <span>
                  <small>WHATSAPP</small>
                  <strong>+234 903 354 3367</strong>
                </span>
                <span>↗</span>
              </a>
              <div className="contact-detail">
                <span className="contact-detail-icon">✳</span>
                <span>
                  <small>ENQUIRIES</small>
                  <strong>Projects · Partnerships · Ventures</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="contact-form-panel">
            <div className="section-label">
              <span>✧</span> SEND AN ENQUIRY
            </div>
            <ContactEnquiryForm />
          </div>
        </div>
      </section>
    </ContentPage>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Ecosystem", "/ecosystem"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Partnerships", "/partnerships"],
  ["Careers", "/careers"],
  ["Insights", "/insights"],
  ["Contact", "/contact"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav-container">
        <a
          href="/"
          className="brand"
          aria-label="INNOV5 GLOBAL HUB home"
          onClick={() => setOpen(false)}
        >
          <span className="brand-image">
            <Image
              src="/innov5-global-hub-logo.png"
              alt="INNOV5 GLOBAL HUB logo"
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
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
        <nav
          className={`nav-links ${open ? "nav-open" : ""}`}
          aria-label="Main navigation"
        >
          {links.map(([label, href]) => (
            <a href={href} key={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a
            href="https://wa.me/2349033543367?text=Hello%20INNOV5%20GLOBAL%20HUB%2C%20I%20would%20like%20to%20make%20an%20enquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
            onClick={() => setOpen(false)}
          >
            Let&apos;s Talk <span>↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <a href="/" className="brand footer-brand">
            <span className="brand-image">
              <Image
                src="/innov5-global-hub-logo.png"
                alt="INNOV5 GLOBAL HUB logo"
                width={300}
                height={300}
                className="brand-logo-image"
              />
            </span>
            <span className="brand-copy">
              <strong>INNOV5</strong>
              <small>GLOBAL HUB</small>
            </span>
          </a>
          <p className="footer-tagline">Innovating Tomorrow, Today.</p>
          <a href="#top" className="footer-back">
            BACK TO TOP ↑
          </a>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} INNOV5 GLOBAL HUB. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="mailto:innov5cafehub247@gmail.com">Email Us</a>
            <a href="/about">About</a>
            <a href="/ecosystem">Ecosystem</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

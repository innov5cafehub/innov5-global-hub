"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type SubmitState = "idle" | "sending" | "success" | "saved" | "error";

export default function ContactEnquiryForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      subject: String(data.get("subject") || "General business enquiry"),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "We couldn't submit your enquiry. Please try again.",
        );
      setState(result.notification === "saved" ? "saved" : "success");
      form.reset();
    } catch (submissionError) {
      setState("error");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        Full name
        <input
          name="name"
          autoComplete="name"
          maxLength={120}
          required
          placeholder="Your name"
        />
      </label>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          placeholder="you@example.com"
        />
      </label>
      <label>
        What is your enquiry about?
        <select name="subject" defaultValue="General business enquiry">
          <option>General business enquiry</option>
          <option>Technology project</option>
          <option>Partnership opportunity</option>
          <option>VendiLink</option>
          <option>Innov5 Cafe' Hub</option>
          <option>Careers or internship</option>
          <option>Media and insights</option>
        </select>
      </label>
      <label>
        Tell us a little more
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="How can we help?"
        />
      </label>
      <div className="contact-honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        className="button button-primary"
        type="submit"
        disabled={state === "sending"}
      >
        {state === "sending" ? "Sending enquiry…" : "Send Enquiry"}{" "}
        <span>↗</span>
      </button>
      {state === "success" && (
        <p className="form-note" role="status">
          Thank you. Your enquiry has been submitted successfully. Our team will
          get back to you.
        </p>
      )}
      {state === "saved" && (
        <p className="form-note" role="status">
          Your enquiry has been received and saved. Email notification is
          temporarily delayed, but your message is safely recorded.
        </p>
      )}
      {state === "error" && (
        <p className="form-note" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

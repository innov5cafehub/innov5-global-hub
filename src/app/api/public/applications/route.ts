import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApplicationRequest = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  qualification?: unknown;
  cover_letter?: unknown;
  resume_url?: unknown;
  website?: unknown;
  job_id?: unknown;
};

type CareerJob = {
  id: number;
  title: string;
  slug: string;
  deadline: string | null;
};

function clean(value: unknown, maxLength: number): string {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] || character,
  );
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("Resend is not configured. Email notification was skipped.");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();

      console.error("Resend email request failed:", {
        status: response.status,
        details,
      });

      return false;
    }

    return true;
  } catch (error) {
    console.error("Unable to contact Resend:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    let body: ApplicationRequest;

    try {
      body = (await request.json()) as ApplicationRequest;
    } catch {
      return jsonError("Invalid request body.", 400);
    }

    // Basic bot filtering. Do not save submissions that fill this field.
    // Return a generic success response to avoid exposing the honeypot.
    if (clean(body.website, 200)) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Validate and normalize applicant information.
    const name = clean(body.name, 140);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 60);
    const qualification = clean(body.qualification, 180);
    const coverLetter = clean(body.cover_letter, 7000);
    const resumeUrl = clean(body.resume_url, 1000);
    console.info("[Careers] CV/portfolio received:", {
      provided: Boolean(resumeUrl),
      length: resumeUrl.length,
    });
    const jobId = Number(body.job_id);

    const validEmail = /^\S+@\S+\.\S+$/.test(email);

    if (
      !name ||
      !validEmail ||
      !phone ||
      !qualification ||
      coverLetter.length < 20 ||
      !Number.isInteger(jobId) ||
      jobId < 1
    ) {
      return jsonError(
        "Please complete all required fields and provide a valid email address. Your cover letter must contain at least 20 characters.",
        400,
      );
    }

    // Accept only HTTPS links for an optional CV or portfolio.
    if (resumeUrl) {
      let parsedResumeUrl: URL;

      try {
        parsedResumeUrl = new URL(resumeUrl);
      } catch {
        return jsonError(
          "Please enter a valid CV or portfolio URL beginning with https://",
          400,
        );
      }

      if (parsedResumeUrl.protocol !== "https:") {
        return jsonError("CV or portfolio links must begin with https://", 400);
      }
    }

    // Use server-only credentials. Never expose the secret key to the browser.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "Career applications API is missing Supabase configuration.",
      );

      return jsonError(
        "The application service is temporarily unavailable. Please try again later.",
        503,
      );
    }

    const baseUrl = supabaseUrl.replace(/\/+$/, "");

    // Confirm that the vacancy exists and is published.
    const jobResponse = await fetch(
      `${baseUrl}/rest/v1/career_jobs?id=eq.${jobId}&status=eq.published&select=id,title,slug,deadline&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      },
    );

    if (!jobResponse.ok) {
      const details = await jobResponse.text();

      console.error("Could not verify career vacancy:", {
        status: jobResponse.status,
        details,
      });

      return jsonError(
        "We could not verify this vacancy. Please try again later.",
        502,
      );
    }

    const jobs = (await jobResponse.json()) as CareerJob[];

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return jsonError(
        "This vacancy is no longer accepting applications.",
        404,
      );
    }

    const job = jobs[0];

    // Check the closing date, treating the deadline as the end of that day.
    if (job.deadline) {
      const deadline = new Date(`${job.deadline.slice(0, 10)}T23:59:59.999Z`);

      if (
        !Number.isNaN(deadline.getTime()) &&
        deadline.getTime() < Date.now()
      ) {
        return jsonError(
          "The application deadline for this vacancy has passed.",
          400,
        );
      }
    }

    // Generate a unique reference for the applicant.
    const applicationNumber =
      `I5-${new Date().getFullYear()}-` +
      crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

    const application = {
      application_number: applicationNumber,
      job_id: job.id,
      job_title: job.title,
      applicant_name: name,
      email,
      phone,
      qualification,
      cover_letter: coverLetter,
      resume_url: resumeUrl || null,
      status: "received",
    };

    // Save the application to Supabase.
    const insertResponse = await fetch(
      `${baseUrl}/rest/v1/career_applications`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(application),
        cache: "no-store",
      },
    );

    if (!insertResponse.ok) {
      const details = await insertResponse.text();

      // Keep detailed database errors in the server log, not the public response.
      console.error("Career application insert failed:", {
        status: insertResponse.status,
        details,
        jobId,
      });

      return jsonError(
        "We could not save your application. Please try again later.",
        502,
      );
    }

    const savedApplications = await insertResponse.json();

    if (!Array.isArray(savedApplications) || savedApplications.length === 0) {
      console.error("Supabase returned no inserted application record.");

      return jsonError(
        "We could not confirm that your application was saved. Please contact the recruitment team before submitting again.",
        502,
      );
    }

    // The database insert succeeded. Email failures must not undo it.
    const notificationAddress =
      process.env.CONTACT_EMAIL || "innov5cafehub247@gmail.com";

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeQualification = escapeHtml(qualification);
    const safeJobTitle = escapeHtml(job.title);
    const safeApplicationNumber = escapeHtml(applicationNumber);
    const safeCoverLetter = escapeHtml(coverLetter).replace(/\n/g, "<br>");

    const safeResumeLink = resumeUrl
      ? `<a href="${escapeHtml(resumeUrl)}" rel="noopener noreferrer">Open CV/portfolio</a>`
      : "Not provided";

    // Notify the recruitment team.
    await sendEmail(
      notificationAddress,
      `New job application: ${job.title} (${applicationNumber})`,
      `
        <div style="font-family:Arial,sans-serif;line-height:1.7;color:#14254b;max-width:640px;margin:auto">
          <h2>New career application</h2>
          <p><strong>Application number:</strong> ${safeApplicationNumber}</p>
          <p><strong>Vacancy:</strong> ${safeJobTitle}</p>
          <p><strong>Applicant:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Qualification:</strong> ${safeQualification}</p>
          <p><strong>CV/Portfolio:</strong> ${safeResumeLink}</p>
          <p><strong>Cover letter:</strong></p>
          <p>${safeCoverLetter}</p>
        </div>
      `,
    );

    // Send confirmation to the applicant.
    await sendEmail(
      email,
      `Application received: ${applicationNumber}`,
      `
        <div style="font-family:Arial,sans-serif;line-height:1.7;color:#14254b;max-width:640px;margin:auto">
          <h2 style="color:#175fd1">INNOV5 GLOBAL HUB</h2>
          <p>Dear ${safeName},</p>
          <p>
            Thank you for applying for
            <strong>${safeJobTitle}</strong>.
            We have successfully received your application.
          </p>
          <p>Your application reference number is:</p>
          <p style="font-size:22px;font-weight:bold;letter-spacing:1px;background:#eef5ff;padding:14px;border-radius:10px">
            ${safeApplicationNumber}
          </p>
          <p>Please keep this number for your records.</p>
          <p>
            If you are shortlisted, our recruitment team will contact you.
          </p>
          <p>
            Regards,<br>
            Recruitment Team<br>
            INNOV5 GLOBAL HUB
          </p>
        </div>
      `,
    );

    // Return a response that the Careers page can display.
    console.log("INNOV5 CAREERS APPLICATION ROUTE HIT");

    return NextResponse.json(
      {
        success: true,
        message: "Your application has been submitted successfully.",
        application_number: applicationNumber,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Career application submission error:", error);

    return jsonError(
      "Unable to submit your application right now. Please try again later.",
      500,
    );
  }
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Pocket Circle",
  description:
    "How Pocket Circle collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="25 July 2026">
      <section>
        <h2>1. Who we are</h2>
        <p>
          Pocket Circle (“we”, “us”) provides a web app that helps rotating
          savings groups coordinate cycles, bank details within a group, and
          payment receipts. This policy explains what personal information we
          collect and how we use it.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <ul>
          <li>
            <span className="font-medium text-text">Account details:</span>{" "}
            name, email address, and password (stored in hashed form by our
            backend).
          </li>
          <li>
            <span className="font-medium text-text">Bank details:</span> bank
            name/code and account number you provide so group members know where
            to send contributions when you are the collector. Account name
            resolution may be used to help you confirm the correct account.
          </li>
          <li>
            <span className="font-medium text-text">Group activity:</span> group
            membership, contribution amounts and schedules, cycle records,
            receipt files (images or PDFs), amounts, optional notes, dispute
            reasons, and related notifications or activity events.
          </li>
          <li>
            <span className="font-medium text-text">Technical data:</span>{" "}
            standard server logs such as IP address, browser type, and request
            timestamps needed to operate and secure the service.
          </li>
        </ul>
        <p>
          We do not ask for BVN, NIN, card numbers, or wallet balances. We do
          not process payments through the app.
        </p>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <ul>
          <li>Create and secure your account</li>
          <li>Run groups, cycles, invites, and notifications</li>
          <li>
            Show collector bank details to members of that group during the
            relevant cycle
          </li>
          <li>Store receipts and dispute notes for your group’s records</li>
          <li>Improve reliability, prevent abuse, and provide support</li>
          <li>Comply with law where we are required to</li>
        </ul>
      </section>

      <section>
        <h2>4. Who can see your information</h2>
        <ul>
          <li>
            <span className="font-medium text-text">Group members</span> can see
            information needed to run the circle: membership, cycle status,
            contribution statuses, receipts you upload in that group, and the
            current collector’s bank details for that group.
          </li>
          <li>
            <span className="font-medium text-text">Group admins</span> can
            manage membership, settings, and invites for their groups.
          </li>
          <li>
            <span className="font-medium text-text">Platform operators</span>{" "}
            (including super admins) may access account and group data to
            operate, support, and secure the service.
          </li>
          <li>
            We do not sell your personal information. We do not share your bank
            details publicly or across unrelated groups.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Service providers</h2>
        <p>
          We use infrastructure and services (for example hosting, email, or
          file storage) that process data on our behalf under instructions
          limited to providing Pocket Circle. Where bank account name resolution
          is offered, that lookup is performed through a third-party banking
          data provider solely to verify account details you enter.
        </p>
      </section>

      <section>
        <h2>6. Cookies and sessions</h2>
        <p>
          We use an httpOnly session cookie to keep you signed in. We do not use
          advertising trackers on the product. Essential cookies required for
          authentication and security may be set when you use the app.
        </p>
      </section>

      <section>
        <h2>7. Retention</h2>
        <p>
          We keep account, group, cycle, and receipt records for as long as
          needed to provide the service and maintain group history, unless a
          longer period is required by law or to resolve disputes about the
          service. If you ask us to delete your account, we will remove or
          anonymise personal data we no longer need, subject to records other
          members still rely on in active or historical groups.
        </p>
      </section>

      <section>
        <h2>8. Security</h2>
        <p>
          We use reasonable technical and organisational measures to protect
          personal information, including encrypted transport (HTTPS) and
          session cookies that are not exposed to client-side script storage.
          No method of transmission or storage is completely secure. Please use
          a strong password and keep it private.
        </p>
      </section>

      <section>
        <h2>9. Your choices</h2>
        <ul>
          <li>Update your profile and bank details in Settings</li>
          <li>Leave or manage groups according to the tools available to you</li>
          <li>
            Contact us to request access, correction, or deletion of personal
            data we hold about you, subject to legal and operational limits
          </li>
        </ul>
      </section>

      <section>
        <h2>10. Children</h2>
        <p>
          Pocket Circle is not directed at anyone under 18. We do not knowingly
          collect personal information from children.
        </p>
      </section>

      <section>
        <h2>11. International processing</h2>
        <p>
          Pocket Circle is built for users in Nigeria. Your information may be
          processed on servers in Nigeria or in other countries where our
          providers operate. Where that happens, we take steps appropriate to
          the nature of the transfer and the service.
        </p>
      </section>

      <section>
        <h2>12. Changes</h2>
        <p>
          We may update this policy from time to time. The “Last updated” date
          at the top will change when we do. Continued use after an update means
          you acknowledge the revised policy.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          Privacy questions:{" "}
          <a
            href="mailto:hello@pocketcircle.app"
            className="font-medium text-primary hover:underline"
          >
            hello@pocketcircle.app
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}

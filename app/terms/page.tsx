import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — Pocket Circle",
  description:
    "Terms for using Pocket Circle, a coordination tool for rotating savings groups.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="25 July 2026">
      <section>
        <h2>1. What Pocket Circle is</h2>
        <p>
          Pocket Circle is a coordination tool for rotating savings groups (Ajo,
          Esusu, Adashe, and similar). It helps your group track whose turn it
          is, share collector bank details within the group, upload payment
          receipts, and keep a record of each cycle.
        </p>
        <p>
          Pocket Circle does not hold, move, or escrow money. Transfers happen
          outside the app, bank to bank, between members. We are not a bank,
          payment service provider, lender, or investment platform.
        </p>
      </section>

      <section>
        <h2>2. Who can use the service</h2>
        <p>
          You must be at least 18 years old and able to form a binding agreement
          under the laws of Nigeria. By creating an account, you confirm that the
          information you provide is accurate and that you will keep it up to
          date.
        </p>
      </section>

      <section>
        <h2>3. Your account</h2>
        <ul>
          <li>
            You are responsible for keeping your login details secure and for
            activity under your account.
          </li>
          <li>
            Bank account details you add are shown to members of groups you join
            when it is your turn to collect, so they know where to send
            contributions.
          </li>
          <li>
            You must not impersonate another person, share an account in a way
            that misleads others, or use the service for fraud or illegal
            activity.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Groups, cycles, and receipts</h2>
        <ul>
          <li>
            Group admins set contribution amounts, schedules, and membership.
            Collectors confirm or flag receipts. Disputes between members are
            for the group to resolve. We do not adjudicate who is right.
          </li>
          <li>
            Receipt uploads (photos or PDFs) and notes are records for your
            group. They are not a payment rail and do not guarantee that money
            was received.
          </li>
          <li>
            Reminders that open WhatsApp are tools for coordination. Sending
            them does not create a legal obligation for Pocket Circle to collect
            or enforce payment.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. What we do not do</h2>
        <ul>
          <li>Hold deposits or operate wallets</li>
          <li>Move funds on anyone’s behalf</li>
          <li>Offer credit, interest, or investment returns</li>
          <li>Enforce contribution agreements between members</li>
          <li>Act as your group’s banker, escrow agent, or legal advisor</li>
        </ul>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Upload content that is unlawful, harmful, or infringes others’ rights</li>
          <li>Attempt to access accounts or data you are not authorised to see</li>
          <li>Interfere with or disrupt the service</li>
          <li>Use the service to facilitate money laundering or other crime</li>
        </ul>
      </section>

      <section>
        <h2>7. Beta status</h2>
        <p>
          Pocket Circle is in beta. Features may change, and availability is not
          guaranteed. We may suspend or discontinue parts of the service with
          reasonable notice where practical. If pricing is introduced later, we
          will notify existing groups before it applies to them.
        </p>
      </section>

      <section>
        <h2>8. Intellectual property</h2>
        <p>
          The Pocket Circle name, branding, and software belong to us or our
          licensors. You keep ownership of content you upload (such as receipts
          and notes), and you grant us a licence to host and display that
          content so the service can work for your groups.
        </p>
      </section>

      <section>
        <h2>9. Disclaimer and limitation of liability</h2>
        <p>
          The service is provided on an “as is” and “as available” basis. To the
          fullest extent permitted by law, we are not liable for losses arising
          from member-to-member transfers, unpaid contributions, disputed
          receipts, group decisions, or your reliance on information shown in the
          app. Nothing in these terms limits liability that cannot be limited
          under applicable law.
        </p>
      </section>

      <section>
        <h2>10. Termination</h2>
        <p>
          You may stop using the service at any time. We may suspend or close
          accounts that breach these terms or that we reasonably believe pose a
          risk to other users or to the service.
        </p>
      </section>

      <section>
        <h2>11. Changes</h2>
        <p>
          We may update these terms from time to time. Material changes will be
          posted on this page with an updated date. Continued use after changes
          take effect means you accept the revised terms.
        </p>
      </section>

      <section>
        <h2>12. Governing law</h2>
        <p>
          These terms are governed by the laws of the Federal Republic of
          Nigeria. Courts in Lagos, Nigeria have jurisdiction over disputes
          arising from these terms, without prejudice to any mandatory consumer
          protections that apply to you.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          For questions about these terms, email{" "}
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

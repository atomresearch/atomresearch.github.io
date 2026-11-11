import { createFileRoute, Link } from "@tanstack/react-router";
import { MemberLinks } from "@/components/site/member-links";
import { PageHeader } from "@/components/site/section";
import { members } from "@/data/members";
import { absoluteUrl, staticPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/members/")({
  head: () => ({ meta: staticPageMeta("/members") }),
  component: MembersPage,
});

// Structured data, so search engines can index each person.
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": members.map((m) => ({
    "@type": "Person",
    "@id": absoluteUrl(`/members/${m.id}`),
    name: m.name,
    jobTitle: m.role,
    affiliation: m.affiliation,
    image: absoluteUrl(m.photo),
    url: absoluteUrl(`/members/${m.id}`),
    sameAs: [m.links.website, m.links.github, m.links.twitter, m.links.scholar].filter(Boolean),
    description: m.bio,
  })),
});

function MembersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <PageHeader title="Members">
        <p>The people building ATOM.</p>
      </PageHeader>

      <section aria-labelledby="members-heading" className="container-page">
        <h2 id="members-heading" className="eyebrow border-b border-border-strong pb-3">
          Members &amp; Researchers
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {members.map((m) => (
            <li key={m.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-4 lg:flex-col">
                <img
                  src={m.photo}
                  alt=""
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 shrink-0 rounded-2xl border border-border bg-secondary object-cover lg:h-24 lg:w-24"
                />
                <div className="min-w-0">
                  <h3 id={`member-${m.id}`} className="text-[1.375rem] leading-tight">
                    <Link
                      to="/members/$id"
                      params={{ id: m.id }}
                      className="decoration-1 underline-offset-4 hover:underline"
                    >
                      {m.name}
                    </Link>
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-primary">{m.role}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.affiliation}</p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              <div className="mt-4">
                <MemberLinks member={m} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

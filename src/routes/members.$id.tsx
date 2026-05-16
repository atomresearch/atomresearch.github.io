import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExternalLink, Github, Mail, Twitter, GraduationCap } from "lucide-react";
import { members, type Member } from "@/data/members";

const siteUrl = import.meta.env.SITE_URL || import.meta.env.VITE_SITE_URL || import.meta.env.VITE_BASE_PATH || import.meta.env.BASE_URL || '';

export const Route = createFileRoute("/members/$id")({
  head: ({ params }) => {
    const m = members.find((mm) => mm.id === params.id);
    if (!m) return { meta: [{ title: "Member not found - ATOM" }] };
    const url = siteUrl ? `${siteUrl.replace(/\/$/, '')}/members/${m.id}` : `/members/${m.id}`;
    return {
      meta: [
        { title: `${m.name} - ATOM` },
        { name: "description", content: m.bio },
        { name: "keywords", content: `${m.name}, ${m.role}, ATOM Research Group, ${m.affiliation}` },
        { property: "og:title", content: `${m.name} - ATOM` },
        { property: "og:description", content: m.bio },
        { property: "og:image", content: m.photo },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ params }) => {
    const member = members.find((m) => m.id === params.id);
    if (!member) throw notFound();
    return { member };
  },
  component: MemberPage,
});

function MemberPage() {
  const { member } = Route.useLoaderData() as { member: Member };
  const sameAs = [member.links.website, member.links.github, member.links.twitter, member.links.scholar].filter(Boolean);
  const url = siteUrl ? `${siteUrl.replace(/\/$/, '')}/members/${member.id}` : `/members/${member.id}`;

  return (
    <section className="mx-auto max-w-4xl px-6 pt-24 pb-24">
      <nav className="text-sm text-muted-foreground">
        <Link to="/members" className="hover:underline">← Back to members</Link>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-[200px_1fr] items-start">
        <div>
          <img src={member.photo} alt={member.name} className="rounded-full w-48 h-48 object-cover border border-border" />
        </div>
        <div>
          <h1 className="font-display text-4xl font-semibold">{member.name}</h1>
          <div className="mt-2 text-sm text-primary">{member.role}</div>
          <div className="mt-1 text-sm text-muted-foreground">{member.affiliation}</div>
          <p className="mt-6 text-sm text-foreground/85 leading-relaxed">{member.bio}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {member.links.website && (
              <a href={member.links.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary">
                <ExternalLink className="h-4 w-4" /> Website
              </a>
            )}
            {member.links.github && (
              <a href={member.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary">
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
            {member.links.twitter && (
              <a href={member.links.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary">
                <Twitter className="h-4 w-4" /> Twitter
              </a>
            )}
            {member.links.scholar && (
              <a href={member.links.scholar} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary">
                <GraduationCap className="h-4 w-4" /> Scholar
              </a>
            )}
            {member.links.email && (
              <a href={`mailto:${member.links.email}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary">
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
          </div>

          {/* Person JSON-LD for this profile */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": url,
                name: member.name,
                jobTitle: member.role,
                affiliation: member.affiliation,
                image: member.photo,
                url,
                sameAs,
                email: member.links.email ? `mailto:${member.links.email}` : undefined,
                description: member.bio,
              }),
            }}
          />
        </div>
      </div>
    </section>
  );
}

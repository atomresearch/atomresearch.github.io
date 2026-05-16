import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ExternalLink, Github, GraduationCap, Mail, Twitter } from "lucide-react";
import { members, type Member } from "@/data/members";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members - ATOM" },
      { name: "description", content: "The people behind ATOM: faculty, postdocs, students, and researchers." },
      { name: "keywords", content: "ATOM members, researchers, faculty, postdocs, students" },
      { property: "og:image", content: "/preview.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/preview.png" },
      { property: "og:title", content: "Members - ATOM" },
      { property: "og:description", content: "Faculty, postdocs, students, and visiting researchers at the ATOM Research Group." },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  const faculty = members.filter((m) => m.group === "faculty");
  const others = members.filter((m) => m.group === "members");
  return (
    <section className="mx-auto max-w-7xl px-6 pt-20 pb-24">
      {/* JSON-LD for members to help search engines index individual people */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": members.map((m) => ({
              "@type": "Person",
              "@id": `#member-${m.id}`,
              name: m.name,
              jobTitle: m.role,
              affiliation: m.affiliation,
              image: m.photo,
              url: m.links.website ?? undefined,
              sameAs: [m.links.website, m.links.github, m.links.twitter, m.links.scholar].filter(Boolean),
              email: m.links.email ? `mailto:${m.links.email}` : undefined,
              description: m.bio,
            })),
          }),
        }}
      />

      <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight">Members</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">The people building ATOM.</p>

      {/* <Section title="Faculty" people={faculty} large /> */}
      <Section title="Members & Researchers" people={others} />
    </section>
  );
}

function Section({ title, people, large = false }: { title: string; people: Member[]; large?: boolean }) {
  return (
    <div className="mt-16">
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className={`mt-6 grid gap-6 ${large ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {people.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="card-hover rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-md" />
                <img
                  src={m.photo}
                  alt={m.name}
                  className="relative h-24 w-24 rounded-full object-cover border border-border bg-secondary"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id={`member-${m.id}`} className="font-display text-sm font-semibold">
                  <Link to="/members/$id" params={{ id: m.id }} className="hover:underline">{m.name}</Link>
                </h3>
                <div className="text-sm text-primary mt-0.5">{m.role}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{m.affiliation}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {m.links.website && <IconLink href={m.links.website} icon={ExternalLink} label="Website" />}
              {m.links.scholar && <IconLink href={m.links.scholar} icon={GraduationCap} label="Scholar" />}
              {m.links.twitter && <IconLink href={m.links.twitter} icon={Twitter} label="Twitter" />}
              {m.links.github && <IconLink href={m.links.github} icon={Github} label="GitHub" />}
              {m.links.email && <IconLink href={`mailto:${m.links.email}`} icon={Mail} label="Email" />}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function IconLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="h-8 w-8 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}

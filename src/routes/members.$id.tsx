import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MemberLinks } from "@/components/site/member-links";
import { getMember, type Member } from "@/data/members";
import { pageMeta } from "@/lib/seo";
import { breadcrumbs, profilePageLd } from "@/lib/structured-data";

export const Route = createFileRoute("/members/$id")({
  head: ({ params }) => {
    const member = getMember(params.id);
    if (!member) return { meta: [{ title: "Member not found - ATOM" }] };
    return {
      meta: pageMeta({
        title: `${member.name} - ATOM`,
        description: `${member.role}, ${member.affiliation}. ${member.bio}`,
        type: "profile",
        jsonLd: [
          profilePageLd(member),
          breadcrumbs([
            { name: "Members", path: "/members" },
            { name: member.name, path: `/members/${member.id}` },
          ]),
        ],
      }),
    };
  },
  loader: ({ params }) => {
    const member = getMember(params.id);
    if (!member) throw notFound();
    return { member };
  },
  component: MemberPage,
});

function MemberPage() {
  const { member } = Route.useLoaderData() as { member: Member };
  return (
    <article className="container-page max-w-4xl pt-10 md:pt-16">
      <Link
        to="/members/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to members
      </Link>

      <div className="mt-10 grid items-start gap-8 md:grid-cols-[12rem_1fr] md:gap-12">
        <img
          src={member.photo}
          alt={`Portrait of ${member.name}`}
          width={192}
          height={192}
          className="h-36 w-36 rounded-3xl border border-border bg-secondary object-cover md:h-48 md:w-48"
        />
        <div>
          <h1 className="text-4xl leading-tight tracking-[-0.02em] md:text-5xl">{member.name}</h1>
          <p className="mt-3 font-medium text-primary">{member.role}</p>
          <p className="mt-1 text-muted-foreground">{member.affiliation}</p>
          <p className="mt-7 max-w-xl text-lg leading-relaxed">{member.bio}</p>
          <div className="mt-8">
            <MemberLinks member={member} labels />
          </div>
        </div>
      </div>
    </article>
  );
}

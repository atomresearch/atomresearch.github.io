import { ExternalLink, Github, GraduationCap, Mail, Twitter } from "lucide-react";
import type { Member } from "@/data/members";
import { cn } from "@/lib/utils";

function linksOf(member: Member) {
  const { website, scholar, twitter, github, email } = member.links;
  return [
    { href: website, label: "Website", icon: ExternalLink },
    { href: scholar, label: "Scholar", icon: GraduationCap },
    { href: twitter, label: "Twitter", icon: Twitter },
    { href: github, label: "GitHub", icon: Github },
    { href: email && `mailto:${email}`, label: "Email", icon: Mail },
  ].filter((link) => link.href);
}

/** A member's links: icons only on cards, icons with labels on profiles. */
export function MemberLinks({ member, labels = false }: { member: Member; labels?: boolean }) {
  return (
    <ul className={cn("flex flex-wrap", labels ? "gap-2" : "-ml-2 gap-0.5")}>
      {linksOf(member).map(({ href, label, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={label === "Email" ? undefined : "_blank"}
            rel="noreferrer"
            aria-label={labels ? undefined : `${member.name}: ${label}`}
            title={labels ? undefined : label}
            className={cn(
              "inline-flex items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-primary",
              labels
                ? "h-9 rounded-full border border-border-strong px-3.5 text-[0.8125rem] font-medium text-foreground hover:border-primary/50"
                : "h-9 w-9 rounded-full hover:bg-secondary",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {labels && label}
          </a>
        </li>
      ))}
    </ul>
  );
}

import { Link } from "@tanstack/react-router";
import { Github, Mail, Twitter } from "lucide-react";
import site from "@/data/site.json";
import { NAV } from "./header";
import { AtomWordmark } from "./logo";

const CONNECT = [
  { href: `mailto:${site.email}`, label: "Email", icon: Mail },
  { href: site.github, label: "GitHub", icon: Github },
  { href: site.twitter, label: "Twitter / X", icon: Twitter },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface md:mt-32">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr] md:py-16">
        <div>
          <Link to="/" className="inline-block rounded-md">
            <AtomWordmark />
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Toward an Agent Foundation Model - building agents that explore, model, and discover.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">Connect</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CONNECT.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-wrap justify-between gap-2 py-5 text-xs text-muted-foreground">
          <span>© {__BUILD_YEAR__} ATOM Research Group. All rights reserved.</span>
          <span>Crafted for open science.</span>
        </div>
      </div>
    </footer>
  );
}

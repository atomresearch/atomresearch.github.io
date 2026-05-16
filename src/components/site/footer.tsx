import { Link } from "@tanstack/react-router";
import { Github, Mail, Twitter } from "lucide-react";
import { AtomLogo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-primary">
            <AtomLogo className="h-6 w-6" />
            <span className="font-display text-base font-semibold text-foreground">ATOM</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Toward an Agent Foundation Model - building agents that explore, model, and discover.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/research" className="hover:text-primary">Research</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/members" className="hover:text-primary">Members</Link></li>
            {/* <li><Link to="/join" className="hover:text-primary">Join Us</Link></li> */}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Connect</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="mailto:lancelot.dacosta@gmail.com" className="inline-flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4" /> Email</a></li>
            <li><a href="https://github.com/atomresearch" className="inline-flex items-center gap-2 hover:text-primary"><Github className="h-4 w-4" /> GitHub</a></li>
            <li><a href="https://x.com/lancelotdacosta" className="inline-flex items-center gap-2 hover:text-primary"><Twitter className="h-4 w-4" /> Twitter / X</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} ATOM Research Group. All rights reserved.</span>
          <span>Crafted for open science.</span>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { moreLinkClass } from "@/components/site/section";
import { members } from "@/data/members";

/** A row of member portraits linking to the members page. */
export function PeopleStrip() {
  return (
    <section aria-labelledby="people" className="border-t border-border">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-10 gap-y-6 py-12 md:py-16">
        <div>
          <h2 id="people" className="text-3xl tracking-[-0.02em] md:text-[2.5rem]">
            The people building ATOM.
          </h2>
          <Link to="/members/" className={`${moreLinkClass} mt-4`}>
            Members <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <ul className="flex flex-wrap gap-2.5">
          {members.map((m) => (
            <li key={m.id}>
              <Link
                to="/members/$id/"
                params={{ id: m.id }}
                title={m.name}
                className="block rounded-full transition-transform hover:-translate-y-0.5"
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 rounded-full border border-border bg-secondary object-cover"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

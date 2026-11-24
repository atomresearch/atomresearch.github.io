import { createFileRoute, redirect } from "@tanstack/react-router";

// Hidden for the launch (24 Nov 2026): the page is not published and its URL goes home.
export const Route = createFileRoute("/media")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});

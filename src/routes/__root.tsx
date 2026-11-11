import { Link, Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ThemeProvider } from "@/components/site/theme-provider";
import { Button } from "@/components/ui/button";
import { jsonLdTags, useDocumentHead } from "@/lib/seo";
import { siteGraph } from "@/lib/structured-data";

export const Route = createRootRoute({
  // The group and the website, described on every page for search engines.
  head: () => ({ meta: jsonLdTags(siteGraph()) }),
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorScreen,
});

function RootComponent() {
  useDocumentHead();

  return (
    <ThemeProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

function Message({
  code,
  title,
  children,
  actions,
}: {
  code?: string;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-start justify-center py-24">
      {code && <p className="eyebrow mb-4">{code}</p>}
      <h1 className="text-4xl tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-md text-muted-foreground">{children}</p>
      <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
    </div>
  );
}

function NotFound() {
  return (
    <Message
      code="404"
      title="Page not found"
      actions={
        <Button asChild>
          <Link to="/">Go home</Link>
        </Button>
      }
    >
      The page you're looking for doesn't exist or has been moved.
    </Message>
  );
}

function ErrorScreen({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <Message
      title="This page didn't load"
      actions={
        <>
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        </>
      }
    >
      Something went wrong on our end. You can try refreshing or head back home.
    </Message>
  );
}

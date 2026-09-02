import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";

const isMaintenanceMode = true;

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function MaintenanceScreen() {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,217,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),transparent_30%)]" />

      <div className="absolute -top-20 left-10 h-52 w-52 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/4 right-1/4 h-24 w-24 rounded-full border border-primary/30 animate-glow" />
      <div className="absolute bottom-1/4 left-1/4 h-20 w-20 rounded-full border border-secondary/30 animate-glow" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-2xl border border-primary/20 bg-card/75 p-8 shadow-[0_0_40px_rgba(0,217,255,0.15)] backdrop-blur-xl animate-fade-in-up md:p-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary animate-pulse-glow">
            Site em manutenção
          </div>

          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-6xl">
            Portfólio em
            <span className="mt-2 block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              atualização
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            Estamos ajustando conteúdo, detalhes, projetos e melhorias para entregar
            uma versão mais forte, mais profissional e mais representativa do meu
            trabalho.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "Atualizando layout",
              "Refinando textos",
              "Melhorando projetos",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border bg-background/50 px-4 py-3 text-center text-sm font-medium text-foreground"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground sm:flex-row">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Em breve a versão oficial volta ao ar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            {isMaintenanceMode ? <MaintenanceScreen /> : <Router />}
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

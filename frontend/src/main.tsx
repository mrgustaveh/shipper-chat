import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/index.scss";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("missing clerk publishable key");
}

const queryclient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryclient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <MantineProvider>
          <App />
          <Notifications
            position="top-right"
            zIndex={10000}
            color="violet"
            autoClose={5000}
            transitionDuration={500}
          />
        </MantineProvider>
      </ClerkProvider>
    </QueryClientProvider>
  </StrictMode>,
);

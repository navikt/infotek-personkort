import { Alert, Box, InternalHeader, Page, Search } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { hentPersonkort } from "~/api/personkortApi";
import { erGyldigFnrVerdi } from "~/utils/fnr";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fnr, setFnr] = useState("");
  const [error, setError] = useState<string>();
  const maskeringMasterId = useRef(Math.random().toString());

  useEffect(() => {
    localStorage.setItem("blur-sensitive-info-master", maskeringMasterId.current);
    const alleredeMaskert = localStorage.getItem("blur-sensitive-info") === "true";
    document.body.classList.toggle("blur-sensitive-info", alleredeMaskert);

    const eventListener = (event: KeyboardEvent) => {
      const masterId = localStorage.getItem("blur-sensitive-info-master");
      if (masterId !== maskeringMasterId.current) {
        return;
      }

      if (event.ctrlKey && (event.key === "ø" || event.key === "|")) {
        event.preventDefault();
        const blirMaskert = !document.body.classList.contains("blur-sensitive-info");
        document.body.classList.toggle("blur-sensitive-info", blirMaskert);
        localStorage.setItem("blur-sensitive-info", String(blirMaskert));
      }
    };

    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  }, []);

  return (
    <Page>
      <Page.Block as="header">
        <InternalHeader>
          <InternalHeader.Title as="h1">Infotek personkort</InternalHeader.Title>
          <Box
            className="personident"
            as="form"
            style={{ alignSelf: "center" }}
            onSubmit={async (event) => {
              event.preventDefault();
              if (!erGyldigFnrVerdi(fnr)) {
                setError("Skriv et gyldig fødselsnummer (11 siffer)");
                return;
              }

              try {
                await queryClient.fetchQuery({
                  queryKey: ["personkort-visning"],
                  queryFn: () => hentPersonkort(fnr),
                });
                setError(undefined);
                setFnr("");
                navigate({ to: "/personkort" });
              } catch (e) {
                setError(e instanceof Error ? e.message : "Kunne ikke hente personkort");
              }
            }}
          >
            <Search
              label="Søk person"
              variant="simple"
              placeholder="Fødselsnummer"
              autoComplete="off"
              value={fnr}
              onChange={setFnr}
              size="small"
            />
          </Box>
        </InternalHeader>
      </Page.Block>
      <Page.Block as="main" width="2xl" gutters>
        {error && <Alert variant="error">{error}</Alert>}
        <Outlet />
      </Page.Block>
    </Page>
  );
}

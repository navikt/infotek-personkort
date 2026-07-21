import { Box, InternalHeader, Page, Search } from "@navikt/ds-react";
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { erGyldigFnrVerdi } from "~/utils/fnr";

export const Route = createRootRoute({
  component: RootComponent
});

function RootComponent() {
  const navigate = useNavigate();
  const [fnr, setFnr] = useState("");
  const [error, setError] = useState<string>();

  return (
    <Page>
      <Page.Block as="header">
        <InternalHeader>
          <InternalHeader.Title as="h1">Infotek personkort</InternalHeader.Title>
          <Box as="form" onSubmit={(event) => {
            event.preventDefault();
            if (!erGyldigFnrVerdi(fnr)) {
              setError("Skriv et gyldig fodselsnummer (11 siffer)");
              return;
            }
            setError(undefined);
            navigate({ to: "/personkort/$fnr", params: { fnr } });
          }}>
            <Search
              label="Sok person"
              variant="simple"
              placeholder="Fodselsnummer"
              value={fnr}
              onChange={setFnr}
              error={error}
              size="small"
            />
          </Box>
        </InternalHeader>
      </Page.Block>
      <Page.Block as="main" width="2xl" gutters>
        <Outlet />
      </Page.Block>
    </Page>
  );
}

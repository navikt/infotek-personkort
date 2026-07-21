import { Alert, BodyShort, Heading, HGrid, Label, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { hentPersonkort } from "~/api/personkortApi";

export const Route = createFileRoute("/personkort/$fnr")({
  component: PersonkortPage
});

function PersonkortPage() {
  const { fnr } = Route.useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["personkort", fnr],
    queryFn: () => hentPersonkort(fnr)
  });

  if (isLoading) {
    return <BodyShort>Laster personkort...</BodyShort>;
  }

  if (isError || !data) {
    return <Alert variant="error">Kunne ikke hente personkort.</Alert>;
  }

  return (
    <VStack gap="space-8" paddingBlock="space-16">
      <Heading size="large" level="2">
        Personkort
      </Heading>
      <HGrid columns={2} gap="space-4">
        <Label>Fodselsnummer</Label>
        <BodyShort>{data.fnrMaskert}</BodyShort>
        <Label>Navn</Label>
        <BodyShort>{data.navn}</BodyShort>
        <Label>Status</Label>
        <BodyShort>{data.status}</BodyShort>
        <Label>Siste vedtak</Label>
        <BodyShort>{data.sisteVedtakDato ?? "-"}</BodyShort>
        <Label>Konto</Label>
        <BodyShort>{data.kontonummerMaskert ?? "-"}</BodyShort>
        <Label>Tekst</Label>
        <BodyShort>{data.tekst ?? "-"}</BodyShort>
      </HGrid>
    </VStack>
  );
}


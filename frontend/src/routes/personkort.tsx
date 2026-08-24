import { Alert, BodyShort, CopyButton, Heading, HStack, Tooltip, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Personkort } from "~/api/personkortApi";
import { PersonkortDatagrid } from "~/components/personkort/PersonkortDatagrid";

export const Route = createFileRoute("/personkort")({
  component: PersonkortPage,
});

function PersonkortPage() {
  // Henter aldri selv - søket i headeren (__root.tsx) gjør et fetchQuery mot samme
  // queryKey. useQuery (i motsetning til queryClient.getQueryData) abonnerer på
  // cachen, slik at siden oppdateres når man søker på en ny person uten at ruten
  // remountes (URL-en er uendret: "/personkort" -> "/personkort").
  const { data } = useQuery<Personkort>({
    queryKey: ["personkort-visning"],
    queryFn: () => Promise.reject(new Error("Ingen aktivt søk")),
    enabled: false,
  });

  if (!data) {
    return <Alert variant="warning">Søk opp en person for å se personkort.</Alert>;
  }

  return (
    <VStack gap="space-8" paddingBlock="space-16">
      <Heading size="large" level="2">
        Personkort
      </Heading>
      <BodyShort>
        <HStack gap="space-4" align="center">
          <span className="personnavn">{data.navn}</span>
          <span>/</span>
          <HStack gap="space-2" align="center">
            <span className="personident">{data.fnr}</span>
            <Tooltip content="Kopier fødselsnummer" placement="bottom">
              <CopyButton size="small" copyText={data.fnr} activeText="Kopiert fødselsnummer" />
            </Tooltip>
          </HStack>
        </HStack>
      </BodyShort>
      <PersonkortDatagrid innslag={data.innslag} />
    </VStack>
  );
}

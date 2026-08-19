import { Alert, BodyShort, CopyButton, Heading, HStack, Tooltip, VStack } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Personkort } from "~/api/personkortApi";
import { PersonkortDatagrid } from "~/components/personkort/PersonkortDatagrid";

export const Route = createFileRoute("/personkort")({
  component: PersonkortPage,
});

function PersonkortPage() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<Personkort>(["personkort-visning"]);

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

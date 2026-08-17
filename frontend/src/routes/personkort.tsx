import { Alert, BodyShort, Heading, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PersonkortDatagrid } from "~/components/personkort/PersonkortDatagrid";

export const Route = createFileRoute("/personkort")({
  component: PersonkortPage,
});

function PersonkortPage() {
  const { data } = useQuery({
    queryKey: ["personkort-visning"],
    queryFn: async () => {
      throw new Error("Mangler personkortdata");
    },
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
        <span className="personnavn">{data.navn}</span>
        {" ("}
        <span className="personident">{data.fnrMaskert}</span>
        {")"}
      </BodyShort>
      <PersonkortDatagrid innslag={data.innslag} />
    </VStack>
  );
}

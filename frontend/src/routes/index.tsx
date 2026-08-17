import { BodyLong, Heading, VStack } from "@navikt/ds-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <VStack gap="space-8" paddingBlock="space-16">
      <Heading size="large" level="2">
        Personkort-oppslag
      </Heading>
      <BodyLong>Bruk søkefeltet i toppen for å hente demo-data for en person.</BodyLong>
    </VStack>
  );
}

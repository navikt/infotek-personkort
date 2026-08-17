import { Table } from "@navikt/ds-react";
import type { PersonkortInnslag } from "~/api/personkortApi";

type Props = {
  innslag: PersonkortInnslag[];
};

function visVerdi(verdi: string | null) {
  return verdi ?? "-";
}

function formatBelop(verdi: string | null) {
  if (!verdi) {
    return "-";
  }

  const parsed = Number.parseFloat(verdi);
  if (Number.isNaN(parsed)) {
    return verdi;
  }

  return parsed.toLocaleString("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function PersonkortDatagrid({ innslag }: Props) {
  return (
    <Table size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Status</Table.HeaderCell>
          <Table.HeaderCell scope="col">Dato</Table.HeaderCell>
          <Table.HeaderCell scope="col">FOM</Table.HeaderCell>
          <Table.HeaderCell scope="col">TOM</Table.HeaderCell>
          <Table.HeaderCell scope="col">Bevilget beløp</Table.HeaderCell>
          <Table.HeaderCell scope="col">Betalt beløp</Table.HeaderCell>
          <Table.HeaderCell scope="col">Tekst</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {innslag.map((rad, index) => (
          <Table.Row key={`${rad.datoSekvens ?? "ukjent"}-${rad.dato ?? "ingen-dato"}-${index}`}>
            <Table.DataCell>{visVerdi(rad.status)}</Table.DataCell>
            <Table.DataCell>{visVerdi(rad.dato)}</Table.DataCell>
            <Table.DataCell>{visVerdi(rad.fom)}</Table.DataCell>
            <Table.DataCell>{visVerdi(rad.tom)}</Table.DataCell>
            <Table.DataCell>{formatBelop(rad.bevilgetBelop)}</Table.DataCell>
            <Table.DataCell>{formatBelop(rad.betaltBelop)}</Table.DataCell>
            <Table.DataCell>
              <span className="personinfo">{visVerdi(rad.tekst)}</span>
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

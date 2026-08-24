import { DataGrid } from "@navikt/ds-react/PREVIEW/DataGrid";
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

const kolonner: DataGrid.Columns<PersonkortInnslag> = [
  {
    id: "dato",
    header: "Dato",
    isRowHeader: true,
    width: { defaultValue: 110 },
    bodyCell: (rad) => visVerdi(rad.dato),
  },
  {
    id: "kontonummer",
    header: "Kontonr",
    width: { defaultValue: 140 },
    bodyCell: (rad) => visVerdi(rad.kontonummer),
  },
  {
    id: "belop",
    header: "Bel\u00f8p",
    align: "right",
    width: { defaultValue: 120 },
    bodyCell: (rad) => formatBelop(rad.bevilgetBelop),
  },
  {
    id: "fom",
    header: "FOM",
    width: { defaultValue: 110 },
    bodyCell: (rad) => visVerdi(rad.fom),
  },
  {
    id: "tom",
    header: "TOM",
    width: { defaultValue: 110 },
    bodyCell: (rad) => visVerdi(rad.tom),
  },
  {
    id: "tekst",
    header: "Tekst",
    width: { defaultValue: 420, resizeMax: 900 },
    bodyCell: (rad) => <span className="personinfo">{visVerdi(rad.tekst)}</span>,
  },
];

export function PersonkortDatagrid({ innslag }: Props) {
  return (
    <DataGrid
      columns={kolonner}
      data={innslag}
      defaultSettings={{
        rowDensity: "tight",
        textSize: "small",
        truncateContent: false,
      }}
    >
      <DataGrid.Table layout="fixed" />
    </DataGrid>
  );
}

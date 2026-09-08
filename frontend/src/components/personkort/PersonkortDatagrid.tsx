import { HStack, Pagination, Search, VStack } from "@navikt/ds-react";
import { DataGrid } from "@navikt/ds-react/PREVIEW/DataGrid";
import { useMemo, useState } from "react";
import type { PersonkortInnslag } from "~/api/personkortApi";

type Props = {
  innslag: PersonkortInnslag[];
};

const RADER_PER_SIDE = 20;

function matcherFilter(rad: PersonkortInnslag, filter: string) {
  const feltverdier = [rad.dato, rad.kontonummer, rad.bevilgetBelop, rad.fom, rad.tom, rad.tekst];
  return feltverdier.some((verdi) => verdi?.toLowerCase().includes(filter));
}

const sorteringsverdier: Record<string, (rad: PersonkortInnslag) => string | number> = {
  dato: (rad) => rad.dato ?? "",
  kontonummer: (rad) => rad.kontonummer ?? "",
  belop: (rad) => (rad.bevilgetBelop ? Number.parseFloat(rad.bevilgetBelop) : Number.NEGATIVE_INFINITY),
  fom: (rad) => rad.fom ?? "",
  tom: (rad) => rad.tom ?? "",
  tekst: (rad) => rad.tekst ?? "",
};

function sorterRader(rader: PersonkortInnslag[], sortOrder: DataGrid.Table.SortEntry[]) {
  if (sortOrder.length === 0) {
    return rader;
  }

  return [...rader].sort((a, b) => {
    for (const { columnId, direction } of sortOrder) {
      const hentVerdi = sorteringsverdier[columnId];
      if (!hentVerdi) {
        continue;
      }

      const verdiA = hentVerdi(a);
      const verdiB = hentVerdi(b);
      if (verdiA < verdiB) {
        return direction === "asc" ? -1 : 1;
      }
      if (verdiA > verdiB) {
        return direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });
}

function visVerdi(verdi: string | null) {
  return verdi ?? "-";
}

function ikkeBrytendeCelle(innhold: string) {
  return <span style={{ whiteSpace: "nowrap" }}>{innhold}</span>;
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
    isSortable: true,
    bodyCell: (rad) => ikkeBrytendeCelle(visVerdi(rad.dato)),
  },
  {
    id: "kontonummer",
    header: "Kontonr",
    isSortable: true,
    bodyCell: (rad) => ikkeBrytendeCelle(visVerdi(rad.kontonummer)),
  },
  {
    id: "belop",
    header: "Bel\u00f8p",
    align: "right",
    isSortable: true,
    bodyCell: (rad) => ikkeBrytendeCelle(formatBelop(rad.bevilgetBelop)),
  },
  {
    id: "fom",
    header: "FOM",
    isSortable: true,
    bodyCell: (rad) => ikkeBrytendeCelle(visVerdi(rad.fom)),
  },
  {
    id: "tom",
    header: "TOM",
    isSortable: true,
    bodyCell: (rad) => ikkeBrytendeCelle(visVerdi(rad.tom)),
  },
  {
    id: "tekst",
    header: "Tekst",
    isSortable: true,
    bodyCell: (rad) => <span className="personinfo">{visVerdi(rad.tekst)}</span>,
  },
];

export function PersonkortDatagrid({ innslag }: Props) {
  const [filter, setFilter] = useState("");
  const [side, setSide] = useState(1);
  const [sortOrder, setSortOrder] = useState<DataGrid.Table.SortEntry[]>([]);

  const filtrerteRader = useMemo(() => {
    const normalisertFilter = filter.trim().toLowerCase();
    if (!normalisertFilter) {
      return innslag;
    }
    return innslag.filter((rad) => matcherFilter(rad, normalisertFilter));
  }, [innslag, filter]);

  const sorterteRader = useMemo(() => sorterRader(filtrerteRader, sortOrder), [filtrerteRader, sortOrder]);

  const antallSider = Math.max(1, Math.ceil(sorterteRader.length / RADER_PER_SIDE));
  const gjeldendeSide = Math.min(side, antallSider);
  const radervisning = sorterteRader.slice((gjeldendeSide - 1) * RADER_PER_SIDE, gjeldendeSide * RADER_PER_SIDE);

  function oppdaterFilter(verdi: string) {
    setFilter(verdi);
    setSide(1);
  }

  return (
    <VStack gap="space-16">
      <Search
        label="Filtrer personkort"
        hideLabel
        placeholder="Filtrer på dato, kontonr, beløp eller tekst"
        variant="simple"
        size="small"
        value={filter}
        onChange={oppdaterFilter}
        onClear={() => oppdaterFilter("")}
      />
      <DataGrid
        columns={kolonner}
        data={radervisning}
        defaultSettings={{
          rowDensity: "tight",
          textSize: "small",
          truncateContent: false,
        }}
      >
        <DataGrid.Table layout="auto" sorting={{ sortOrder, onSortOrderChange: setSortOrder }} />
      </DataGrid>
      {antallSider > 1 && (
        <HStack justify="center">
          <Pagination page={gjeldendeSide} onPageChange={setSide} count={antallSider} size="small" />
        </HStack>
      )}
    </VStack>
  );
}

import { useEffect, useState } from 'react';
import { Waybill } from '@/types/waybillTypes';
import { fetchLocationById } from '@/services/locationService';
import { fetchCommodityById } from '@/services/commodityService';

interface WaybillTableProps {
  waybills: Waybill[];
  onSelect: (waybill: Waybill) => void;
}

interface EnrichedWaybill extends Waybill {
  from?: string;
  to?: string;
  commodity?: string;
}

export default function WaybillTable({ waybills, onSelect }: WaybillTableProps) {
  const [enrichedWaybills, setEnrichedWaybills] = useState<EnrichedWaybill[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(enrichedWaybills.length / rowsPerPage);
  const paginatedWaybills = enrichedWaybills.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const start = enrichedWaybills.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, enrichedWaybills.length);

  useEffect(() => {
    let isMounted = true;

    const enrichWaybills = async () => {
      const enriched: EnrichedWaybill[] = (
        await Promise.all(
          waybills.map(async (wb): Promise<EnrichedWaybill | undefined> => {
            try {
              const instructions = wb.Instructions || [];
              let from = '';
              let to = '';
              let commodity = 'Empty';

              if (instructions.length > 0) {
                const sorted = [...instructions].sort(
                  (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)
                );
                const first = sorted[0];
                const last = sorted[sorted.length - 1];

                try {
                  const [fromLoc, toLoc] = await Promise.all([
                    fetchLocationById(first.locationId),
                    fetchLocationById(last.locationId),
                  ]);
                  from = fromLoc?.name ?? 'Unknown';
                  to = toLoc?.name ?? 'Unknown';
                } catch (e) {
                  console.warn(`Could not fetch from/to location(s) for waybill ${wb.id}`, e);
                }

                const nonEmpty = sorted.find(instr => instr.commodityId !== null);

                if (nonEmpty?.commodityId) {
                  try {
                    const commodityData = await fetchCommodityById(nonEmpty.commodityId);
                    commodity = commodityData.name || 'Empty';
                  } catch (e) {
                    console.warn(`Could not fetch commodity ${nonEmpty.commodityId}`, e);
                  }
                }
              }

              return { ...wb, from, to, commodity };
            } catch (err) {
              console.error(`Error enriching waybill ${wb.id}`, err);
              return undefined;
            }
          })
        )
      ).filter((wb): wb is EnrichedWaybill => wb !== undefined);

      if (isMounted) {
        setEnrichedWaybills(enriched);
      }
    };

    if (waybills.length > 0) enrichWaybills();
    else setEnrichedWaybills([]);

    return () => {
      isMounted = false;
    };
  }, [waybills]);

  useEffect(() => {
    setCurrentPage(1);
  }, [enrichedWaybills.length, rowsPerPage]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Existing Waybills</h2>

      <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
        <div>
          Showing {start}–{end} of {enrichedWaybills.length} waybills
        </div>
        <div className="flex items-center gap-2">
          Rows per page:
          <select
            className="border rounded px-2 py-1"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Waybill Number</th>
              <th className="px-4 py-2 border">Car Type</th>
              <th className="px-4 py-2 border"># Instructions</th>
              <th className="px-4 py-2 border">From</th>
              <th className="px-4 py-2 border">To</th>
              <th className="px-4 py-2 border">Commodity</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedWaybills.map((wb) => (
              <tr key={wb.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{wb.id}</td>
                <td className="px-4 py-2 border text-center">{wb.carType}</td>
                <td className="px-4 py-2 border text-center">{wb.Instructions?.length || '-'}</td>
                <td className="px-4 py-2 border text-center">{wb.from || '—'}</td>
                <td className="px-4 py-2 border text-center">{wb.to || '—'}</td>
                <td className="px-4 py-2 border text-center">{wb.commodity || '—'}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => onSelect(wb)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {paginatedWaybills.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-4">
                  No waybills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-gray-200' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

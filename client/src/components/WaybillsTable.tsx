import { useEffect, useState } from 'react';
import { Waybill } from '@/types/waybillTypes';
import { Instruction } from '@/types/instructionTypes';
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

  useEffect(() => {
    let isMounted = true;

    const enrichWaybills = async () => {
      console.log(`Starting enrichment for ${waybills.length} waybills...`);

      const enriched: EnrichedWaybill[] = (
        await Promise.all(
          waybills.map(async (wb): Promise<EnrichedWaybill | undefined> => {
            try {
              const instructions = wb.Instructions || [];
              console.debug(`Waybill ${wb.id} has ${instructions.length} instructions.`);

              let from = '';
              let to = '';
              let commodity = 'Empty';

              if (instructions.length > 0) {
                // Ensure instructions are sorted by sequenece
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

                const nonEmpty = sorted.find(
                  (instr: Instruction) => instr.commodityId !== null
                );

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
        if (enriched.length !== waybills.length) {
          console.warn(`Some waybills failed to enrich: ${waybills.length - enriched.length}`);
        }
        setEnrichedWaybills(enriched);
      }
    };

    if (waybills.length > 0) enrichWaybills();

    return () => {
      isMounted = false;
    };
  }, [waybills]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Existing Waybills</h2>
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
            {enrichedWaybills.map((wb) => (
              <tr key={wb.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{wb.id}</td>
                <td className="px-4 py-2 border text-center">{wb.carType}</td>
                <td className="px-4 py-2 border text-center">{wb.Instructions?.length || "-"}</td>
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
            {enrichedWaybills.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-4">
                  No waybills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

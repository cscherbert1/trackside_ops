// components/WaybillTable.tsx
import { Waybill } from '@/types/waybillTypes';

interface WaybillTableProps {
  waybills: Waybill[];
  onSelect: (waybill: Waybill) => void;
}

export default function WaybillTable({ waybills, onSelect }: WaybillTableProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Existing Waybills</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Car Type</th>
              <th className="px-4 py-2 border">Repeating</th>
              <th className="px-4 py-2 border">Rare</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {waybills.map((wb) => (
              <tr key={wb.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{wb.id}</td>
                <td className="px-4 py-2 border text-center">{wb.carType}</td>
                <td className="px-4 py-2 border text-center">{wb.repeating ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border text-center">{wb.rareWaybill ? 'Yes' : 'No'}</td>
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
            {waybills.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
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

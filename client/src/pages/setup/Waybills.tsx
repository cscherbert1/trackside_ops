import { useEffect, useState } from 'react';
import { Commodity } from '@/types/commodityTypes';
import { Location } from '@/types/locationTypes';
import { Waybill } from '@/types/waybillTypes';
import { fetchLocationByLayoutId } from '@/services/locationService';
import { fetchCommoditiesbyLayoutId } from '@/services/commodityService';
import { fetchWaybillsByLayoutId } from '@/services/waybillService';
import LayoutSelector from '@/components/LayoutSelector';
import WaybillForm from '@/components/WaybillsForm';
import WaybillTable from '@/components/WaybillsTable';

export default function WaybillsPage() {
  const [layoutId, setLayoutId] = useState<number | null>(null);
  const [waybills, setWaybills] = useState<Waybill[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [selectedWaybill, setSelectedWaybill] = useState<Waybill | null>(null);

  useEffect(() => {
    if (layoutId !== null) {
      fetchWaybillsByLayoutId(layoutId).then(setWaybills);
      fetchLocationByLayoutId(layoutId).then(setLocations).catch(console.error);
      fetchCommoditiesbyLayoutId(layoutId).then(setCommodities).catch(console.error);
    }
  }, [layoutId]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Waybills</h1>
      <LayoutSelector onSelect={(id) => setLayoutId(id)} />

      {layoutId !== null && (
        <>
          <WaybillForm
            layoutId={layoutId}
            locations={locations}
            commodities={commodities}
            setWaybills={setWaybills}
            initialWaybill={selectedWaybill}
          />

          <WaybillTable
            waybills={waybills}
            onSelect={(wb) => setSelectedWaybill(wb)}
          />
        </>
      )}
    </div>
  );
}

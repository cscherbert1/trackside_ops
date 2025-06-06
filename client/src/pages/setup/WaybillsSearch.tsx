// pages/WaybillsSearchPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import WaybillTable from '@/components/WaybillsTable';
import { Waybill } from '@/types/waybillTypes';
import { Location } from '@/types/locationTypes';
import { Commodity } from '@/types/commodityTypes';
import { fetchWaybillsByLayoutId } from '@/services/waybillService';
import { fetchLocationsByLayoutId } from '@/services/locationService';
import { fetchCommoditiesByLayoutId } from '@/services/commodityService';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export default function WaybillsSearchPage() {
  const { layoutId } = useParams();
  const [waybills, setWaybills] = useState<Waybill[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!layoutId) return;
      const id = parseInt(layoutId, 10);
      if (isNaN(id)) return;

      try {
        const [waybills, locations, commodities] = await Promise.all([
          fetchWaybillsByLayoutId(id),
          fetchLocationsByLayoutId(id),
          fetchCommoditiesByLayoutId(id),
        ]);
        setWaybills(waybills);
        setLocations(locations);
        setCommodities(commodities);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    loadData();
  }, [layoutId]);

  useEffect(() => {
      console.log('Updated waybills:', waybills);
  }, [waybills]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
              <BreadcrumbLink asChild>
              <Link to="/setup/waybills">Waybills</Link>
              </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
              <BreadcrumbPage className='font-bold'>Search Waybills</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        </Breadcrumb>
      <h1 className="text-2xl font-bold mb-4">Search Waybills</h1>
      <WaybillTable waybills={waybills} locations={locations} commodities={commodities} />
    </div>
  );
}

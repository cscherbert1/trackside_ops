// pages/WaybillsSearchPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import WaybillTable from '@/components/WaybillsTable';
import { Waybill } from '@/types/waybillTypes';
import { fetchWaybillsByLayoutId } from '@/services/waybillService';
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

  useEffect(() => {
    const loadWaybills = async () => {
        console.log(`layoutId: ${layoutId}`);
      if (!layoutId) return;

      try {
        const numericLayoutId = parseInt(layoutId, 10);
        if (isNaN(numericLayoutId)) {
          console.error('Invalid layoutId:', layoutId);
          return;
        }

        const data = await fetchWaybillsByLayoutId(numericLayoutId);
        console.log(`returned waybill data: ${JSON.stringify(data)}`);
        setWaybills(data);
        console.log(`waybills value = ${JSON.stringify(waybills)}`);
      } catch (error) {
        console.error('Failed to load waybills:', error);
      }
    };
    

    loadWaybills();
  }, [layoutId]);

    useEffect(() => {
        console.log('Updated waybills:', waybills);
    }, [waybills]);


  const handleSelectWaybill = (waybill: Waybill) => {
    // TODO: Add navigation or modal logic to edit the selected waybill
    console.log('Selected waybill:', waybill);
  };

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
      <h1 className="text-2xl font-bold mb-4">Edit Waybills</h1>
      <WaybillTable waybills={waybills} onSelect={handleSelectWaybill} />
    </div>
  );
}

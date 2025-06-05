// pages/WaybillEditPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WaybillTable from '@/components/WaybillsTable';
import { Waybill } from '@/types/waybillTypes';
import { fetchWaybillsByLayoutId } from '@/services/waybillService';


export default function WaybillEditPage() {
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Waybills</h1>
      <WaybillTable waybills={waybills} onSelect={handleSelectWaybill} />
    </div>
  );
}

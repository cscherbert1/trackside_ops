import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waybill } from '@/types/waybillTypes';
import { fetchWaybillsByLayoutId } from '@/services/waybillService';
import LayoutSelector from '@/components/LayoutSelector';
import { Button } from '@/components/ui/button';

export default function WaybillsPage() {
  const navigate = useNavigate();
  const [layoutId, setLayoutId] = useState<number | null>(null);
  const [waybills, setWaybills] = useState<Waybill[]>([]);

  useEffect(() => {
    if (layoutId !== null) {
      fetchWaybillsByLayoutId(layoutId).then(setWaybills);
    }
  }, [layoutId]);

  const handleCreateWaybillsClick = () => {
    navigate(`/setup/waybills/create/${layoutId}`);
  };

  const handleEditWaybillsClick = () => {
    navigate(`/setup/waybills/search/${layoutId}`);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Waybills</h1>
      <LayoutSelector onSelect={(id) => setLayoutId(id)} />

      {layoutId !== null && (
        <>
          <div><h3>Total Waybills: {waybills.length}</h3></div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="bg-slate-700 text-white border border-black w-full sm:w-auto sm:flex-1" onClick={handleCreateWaybillsClick}>
              Create Waybills
            </Button>
            <Button className="bg-slate-500 text-white border border-black w-full sm:w-auto sm:flex-1" onClick={handleEditWaybillsClick}>
              Edit Waybills
            </Button>
          </div>
          
          {/*
          <WaybillTable
            waybills={waybills}
            onSelect={(wb) => setSelectedWaybill(wb)}
          /> */}
        </>
      )}
    </div>
  );
}

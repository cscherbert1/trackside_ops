// client/src/pages/setup/WaybillEdit.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWaybillById, updateWaybillWithInstructions } from '@/services/waybillService';
import { Waybill, WaybillInput } from '@/types/waybillTypes';
import { Instruction } from '@/types/instructionTypes';
import WaybillForm from '@/components/WaybillsForm';
import InstructionsForm from '@/components/InstructionsForm';

export default function WaybillEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [waybill, setWaybill] = useState<Waybill | null>(null);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadWaybill = async () => {
      if (!id) return;
      try {
        const data = await fetchWaybillById(Number(id));
        setWaybill({
          layoutId: data.layoutId,
          carType: data.carType,
          repeating: data.repeating, 
          rareWaybill: data.rareWaybill, 
          currentSequence: data.currentSequence,
          Instructions: data.Instructions || [],
        });
        setInstructions(data.Instructions || []);
      } catch (err) {
        console.error('Failed to fetch waybill:', err);
        alert('Unable to load waybill');
      }
    };

    loadWaybill();
  }, [id]);

  const handleSave = async () => {
    if (!id || !waybill) return;
    setIsSaving(true);
    try {
      await updateWaybillWithInstructions(Number(id), {
        ...waybill,
        instructions: instructions,
      });
      alert('Waybill saved successfully');
      navigate('/waybills');
    } catch (err) {
      console.error('Failed to save waybill:', err);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (!waybill) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Edit Waybill</h1>
      <WaybillForm
        initialWaybill={waybill}
        onChange={(updated) => setWaybill(updated)}
      />
      <InstructionsForm
        layoutId={waybill.layoutId}
        instructions={instructions}
        onChange={setInstructions}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => navigate('/waybills')}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';

export default function WaybillsEdit() {
    const {layoutId} = useParams();

  return (
        <>
            <h1 className="text-2xl p-4">Edit Waybills</h1>
            <p>layout Id: {layoutId}</p>
        </>
    );
}

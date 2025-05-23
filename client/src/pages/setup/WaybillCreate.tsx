/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Commodity } from '@/types/commodityTypes';
import { Location } from '@/types/locationTypes';
import { Waybill } from '@/types/waybillTypes';
import { fetchLocationByLayoutId } from '@/services/locationService';
import { fetchCommoditiesbyLayoutId } from '@/services/commodityService';
import { fetchWaybillsByLayoutId } from '@/services/waybillService';
import WaybillForm from '@/components/WaybillsForm';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function WaybillsCreate() {
    const {layoutId} = useParams();
    const layoutIdNum = layoutId ? Number(layoutId) : null;
    const [waybills, setWaybills] = useState<Waybill[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [commodities, setCommodities] = useState<Commodity[]>([]);
    const [selectedWaybill, setSelectedWaybill] = useState<Waybill | null>(null);

    useEffect(() => {
        if (layoutIdNum !== null && !isNaN(layoutIdNum)) {
        fetchWaybillsByLayoutId(layoutIdNum).then(setWaybills);
        fetchLocationByLayoutId(layoutIdNum).then(setLocations).catch(console.error);
        fetchCommoditiesbyLayoutId(layoutIdNum).then(setCommodities).catch(console.error);
        }
    }, [layoutIdNum]);

    
    if (!layoutIdNum || isNaN(layoutIdNum)) {
        return <p className="text-red-500">Invalid or missing layout ID.</p>;
    }

    return (
        <>
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
                            <BreadcrumbPage className='font-bold'>Create Waybills</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-2xl font-bold">Create Waybills</h1>
                <div><h3 className='font-semibold'>Total Waybills: {waybills.length}</h3></div>
                <div>
                    <WaybillForm
                        layoutId={layoutIdNum}
                        locations={locations}
                        commodities={commodities}
                        setWaybills={setWaybills}
                        initialWaybill={selectedWaybill}
                    />
                </div>
            </div>
        </>
    );
}

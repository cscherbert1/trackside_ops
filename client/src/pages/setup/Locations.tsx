// File: client/src/pages/LocationsPage.tsx
import { useParams, Link } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableHeader, TableRow, TableCell } from '@/components/ui/table'
// Add modal or inline form components as needed

export default function Locations() {
  const { layoutId } = useParams()

  console.log(`Setup Locations for Layout Id: ${layoutId}`)
  return (
    <div className="p-4 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link to="/setup/layouts">Layouts</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>Locations</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
        </Breadcrumb>


      {/* Form */}
      <div className="space-y-4 border p-4 rounded-xl bg-muted">
        <h2 className="text-lg font-bold">Add New Location</h2>
        <Input placeholder="Location Name" />
        <div className="flex gap-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="switching" />
                <label htmlFor="switching" className="text-sm font-medium leading-none">
                    Switching Location
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="classification" />
                <label htmlFor="classification" className="text-sm font-medium leading-none">
                    Classification Yard
                </label>
            </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button>Create</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          {/* Map data here */}
          <tbody>
            <TableRow>
              <TableCell>Springfield Yard</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline">Spots</Button>
                <Button size="icon" variant="ghost">🖉</Button>
                <Button size="icon" variant="destructive">⊖</Button>
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
      </div>
    </div>
  )
}

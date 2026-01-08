import React from 'react';
import { format } from 'date-fns';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Check, X, Eye, ExternalLink } from 'lucide-react';
import { QRPayment } from '../../types/payment';

interface QRPaymentsTableProps {
  payments: QRPayment[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onVerify: (paymentId: string, payment: QRPayment) => void;
  onReject: (paymentId: string, payment: QRPayment) => void;
}

export function QRPaymentsTable({
  payments,
  globalFilter,
  onGlobalFilterChange,
  onVerify,
  onReject,
}: QRPaymentsTableProps) {
  const columnHelper = createColumnHelper<QRPayment>();

  const columns = [
    columnHelper.accessor('bookingId', {
      header: 'Booking ID',
      cell: (info) => (
        <span className="font-mono text-sm">{info.getValue().slice(-8)}</span>
      ),
    }),
    columnHelper.accessor('payerName', {
      header: 'Payer Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('payerPhone', {
      header: 'Phone',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('utrNumber', {
      header: 'UTR/Transaction ID',
      cell: (info) => (
        <span className="font-mono text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => info.getValue() ? `₹${info.getValue()}` : 'N/A',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            info.getValue() === 'verified'
              ? 'bg-green-100 text-green-800'
              : info.getValue() === 'failed'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Submitted',
      cell: (info) => format(new Date(info.getValue()), 'MMM dd, yyyy HH:mm'),
    }),
    columnHelper.accessor('proofUrl', {
      header: 'Proof',
      cell: (info) => info.getValue() ? (
        <a 
          href={info.getValue()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </a>
      ) : 'No proof',
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          {info.row.original.status === 'pending' && (
            <>
              <button
                onClick={() => onVerify(info.getValue(), info.row.original)}
                className="p-1 rounded hover:bg-green-100"
                title="Verify Payment"
              >
                <Check className="h-4 w-4 text-green-600" />
              </button>
              <button
                onClick={() => onReject(info.getValue(), info.row.original)}
                className="p-1 rounded hover:bg-red-100"
                title="Mark as Failed"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </>
          )}
          {info.row.original.adminNotes && (
            <button
              title={info.row.original.adminNotes}
              className="p-1 rounded hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange,
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { Asset, Provider, Transaction } from '@/db/schema';
import { formatCurrency } from '@coingecko/cryptoformat';

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = String(row.getValue('type'));
      return <Badge>{type}</Badge>;
    },
  },
  {
    accessorKey: 'asset',
    header: 'Asset',
    cell: ({ row }) => {
      const asset = row.getValue('asset') as Asset;
      return <Button variant="ghost">{asset.name}</Button>;
    },
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
    cell: ({ row }) => {
      const provider = row.getValue('provider') as Provider;
      return <Button variant="ghost">{provider.name}</Button>;
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue('amount'));
      const asset = row.getValue('asset') as Asset;
      const ticker = asset.ticker;
      const formatted = formatCurrency(amount, ticker, 'fr');

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'price_per_unit_usd',
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price_per_unit_usd'));
      const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const txn = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(txn.id))}
            >
              Copy txn ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

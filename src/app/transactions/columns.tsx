'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import Image from 'next/image';
import Link from 'next/link';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'type',
    header: () => <div>Type</div>,
    cell: ({ row }) => {
      const type = String(row.getValue('type'));
      return <Badge>{type.toUpperCase()}</Badge>;
    },
  },
  {
    accessorKey: 'asset',
    header: () => <div className="px-4">Asset</div>,
    cell: ({ row }) => {
      const asset = row.getValue('asset') as Asset;
      return (
        <Link href={`/assets/${asset.ticker}`}>
          <Button variant="ghost">
            {asset.icon && (
              <Image
                src={asset.icon}
                alt={`${asset.name} icon`}
                width={64}
                height={64}
                className="w-4 h-4 mr-2"
              />
            )}
            {asset.name}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'provider',
    header: () => <div className="px-4">Provider</div>,
    cell: ({ row }) => {
      const provider = row.getValue('provider') as Provider;
      return (
        <Link href={`/providers/${provider.slug}`}>
          <Button variant="ghost">
            {provider.icon && (
              <Image
                src={provider.icon}
                alt={`${provider.name} icon`}
                width={64}
                height={64}
                className="w-4 h-4 mr-2"
              />
            )}
            {provider.name}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue('amount'));
      const asset = row.getValue('asset') as Asset;
      const ticker = asset.ticker;
      const formatted = formatCurrency(amount, ticker, 'fr');

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'price_per_unit_usd',
    header: () => <div>Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price_per_unit_usd'));
      const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
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

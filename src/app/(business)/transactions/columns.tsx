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
import { TransactionDto } from '@/data/transactions';

export const columns: ColumnDef<TransactionDto>[] = [
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
    accessorFn: (row) => row.asset?.name || row.asset?.ticker,
    header: () => <div className="px-4">Asset</div>,
    cell: ({ row }) => {
      const asset = row.original.asset as Asset;
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
    accessorFn: (row) => row.provider?.name,
    header: () => <div className="px-4">Provider</div>,
    cell: ({ row }) => {
      const provider = row.original.provider as Provider;
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
      const amount = Number(row.original.amount);
      const ticker = row.original.asset?.ticker;
      if (!ticker) {
        return <div className="font-medium">{amount}</div>;
      }

      const formatted = formatCurrency(amount, ticker, 'fr');

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'price_per_unit',
    header: () => <div>Price</div>,
    cell: ({ row }) => {
      const ppu = parseFloat(row.getValue('price_per_unit'));
      const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(ppu);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'value_usd',
    header: () => <div>Value $</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const ppu = parseFloat(row.getValue('price_per_unit'));
      const v = amount * ppu;
      const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'USD',
      }).format(v);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'Date',
    header: () => <div>Date</div>,
    cell: ({ row }) => {
      const date = (row.original.created_at as Date).toLocaleString('fr-FR', {
        timeZone: 'UTC',
      });

      return <div className="font-medium">{date}</div>;
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

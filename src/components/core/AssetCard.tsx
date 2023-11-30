'use client';
import { formatCurrency } from '@coingecko/cryptoformat';

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { AssetDto } from '@/data/assets';

type Props = {
  data: AssetDto;
  price: number;
  total: number;
};
export default function AssetCard({ data, price, total }: Props) {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <div className="flex flex-row items-center py-2">
          <Avatar className="mr-4">
            <AvatarImage alt={data.ticker} src={data.icon ?? undefined} />
            <AvatarFallback>{data.ticker}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-bold">{data.name}</CardTitle>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {data.ticker}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Price:</h2>
          <span className="text-xl font-semibold text-green-500 dark:text-green-300">
            {formatCurrency(price, 'usd', 'fr')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Amount:</h2>
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {formatCurrency(total, data.ticker, 'fr')}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button size="sm" variant="secondary">
          To do
        </Button>
      </CardFooter>
    </Card>
  );
}

import { ProviderDto } from '@/data/providers';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Props = {
  data: ProviderDto;
};
export default function ProviderCard({ data }: Props) {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <div className="flex flex-row items-center py-2">
          <Avatar className="mr-4">
            <AvatarImage alt={data.slug} src={data.icon ?? undefined} />
            <AvatarFallback>{data.slug}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-bold">{data.name}</CardTitle>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {data.slug}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

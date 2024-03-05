'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const FormSchema = z.object({
  provider: z.string({
    required_error: 'Please select a provider',
  }),
  file: z.instanceof(File),
});

export default function UploadFile() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      provider: '',
    },
  });

  const uploadFile = async (file: File, provider: string) => {
    try {
      const data = new FormData();
      data.set('file', file);
      data.set('provider', provider);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      // handle the error
      if (!res.ok) throw new Error(await res.text());
      return json;
    } catch (e: any) {
      // Handle errors here
      console.log(e);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.getValues();
    // @ts-ignore
    const reponse = await uploadFile(
      // @ts-ignore
      e.target.file?.files[0] as File,
      values.provider
    );
    // console.log({ debug: reponse });
    // const file = e.target;

    // if (!file) return;

    // await uploadFile(file)
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Provider type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="coinbase">Coinbase</SelectItem>
                  <SelectItem value="ledger">Ledger</SelectItem>
                  <SelectItem value="crypto-dot-com">Crypto.com</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>File to import</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={onChange}
                  //  onChange={(e) => uploadFile(e.target.files?.[0] as File)}
                  id="file"
                  type="file"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Upload</Button>
      </form>
    </Form>
  );
}

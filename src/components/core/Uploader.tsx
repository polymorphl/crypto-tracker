'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';

export default function Uploader() {
  const [file, setFile] = useState<File>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      // handle the error
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file">File to import</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
      </div>
      <Button type="submit">Upload</Button>
    </form>
  );
}

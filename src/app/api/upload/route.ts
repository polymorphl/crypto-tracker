import { writeFile } from 'fs';
import { join } from 'path';

export async function POST(req: Request, res: Response) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return {
      error: 'No file uploaded',
    };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const path = join('tmp', file.name);
  await writeFile(path, buffer, () => {});

  return new Response(path);
}

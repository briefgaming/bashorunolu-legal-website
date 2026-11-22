import { sniffImage } from './post-form';
import { saveImage } from './posts';

export class BadImageError extends Error {}

/** Stores an uploaded cover in the database and returns the URL it is served from. */
export async function storeCover(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type) throw new BadImageError('The cover image must be a JPEG, PNG or WebP file.');
  return `/blog/media/${await saveImage(type, bytes)}`;
}

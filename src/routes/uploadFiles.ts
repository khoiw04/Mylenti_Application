import { createServerFileRoute } from '@tanstack/react-start/server';
import type { uploadFilesToBucketProps } from '@/types';
import { getSupabaseServerClient, supabaseUrl } from '@/lib/supabase';
import { getImageDimensions } from '@/lib/getImageDimension';

export const ServerRoute = createServerFileRoute('/uploadFiles').methods({
  POST: async ({ request }) => {
    // Get Data and Filter
    const formData = await request.formData();
    const from = formData.get('from') as string;
    const rawFiles = formData.getAll('files');
    const files = rawFiles.filter((f): f is File => f instanceof File);

    if (!from || files.length === 0) {
      return new Response(JSON.stringify({ error: 'Thiếu thông tin hoặc không có file.' }), {
        status: 400,
      });
    }

    const result = await uploadFilesToBucket({files, from});

    if ('error' in result) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ fullPaths: result.fullPaths }), {
      status: 200,
    });
  },
});


async function uploadFilesToBucket(value: uploadFilesToBucketProps) {
  const { files, from } = value
  const supabase = getSupabaseServerClient();
  const fullPaths: Array<string> = [];

  for (const file of files) {
    try {
      const { width, height } = await getImageDimensions(file);
      const { data, error } = await supabase.storage
        .from(from)
        .upload(file.name, file, {
          cacheControl: '3600',
          upsert: true,
          metadata: {
            name: file.name,
            type: file.type,
            lastModified: file.lastModified,
            width,
            height
          }
        });
  
      if (error) {
        return { 
          fullPaths,
          error: { 
            fileName: file.name, 
            message: error.message 
          } 
        };
      }
  
      fullPaths.push(`${supabaseUrl}/storage/v1/object/public/${data.fullPath}`);
    } catch (err) {
      return {
        fullPaths,
        error: {
          fileName: file.name,
          message: 'Không thể lấy kích thước ảnh'
        }
      };
    }
  }

  return { fullPaths };
}
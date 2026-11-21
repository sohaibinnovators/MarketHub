const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 1.5 * 1024 * 1024;

export async function fileToPreviewDataUrl(
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      ok: false,
      message: "Use JPG, PNG, WEBP, or GIF images only.",
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      message: "Image must be under 1.5MB for this demo preview.",
    };
  }

  const url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });

  return { ok: true, url };
}

export function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

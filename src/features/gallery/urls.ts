const imageResizingEnabled =
  typeof import.meta !== "undefined" &&
  import.meta.env?.VITE_PUBLIC_CF_IMAGE_RESIZING === "true";

function resizedUrl(cdnBaseUrl: string, photoPath: string, width: number) {
  if (!imageResizingEnabled) return `${cdnBaseUrl}/${photoPath}`;
  return `${cdnBaseUrl}/cdn-cgi/image/width=${width},quality=80,format=auto/${photoPath}`;
}

export function getPhotoPath(
  cdnBaseUrl: string,
  baseUrl: string,
  src: string,
) {
  return `${baseUrl}/${src}`.replace(cdnBaseUrl + "/", "");
}

export function thumbnailUrl(cdnBaseUrl: string, photoPath: string) {
  return resizedUrl(cdnBaseUrl, photoPath, 800);
}

export function coverImageUrl(cdnBaseUrl: string, photoPath: string) {
  return resizedUrl(cdnBaseUrl, photoPath, 1920);
}

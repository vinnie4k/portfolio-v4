export interface Photo {
  src: string;
  width: number;
  height: number;
}

export interface Section {
  label: string;
  photos: Photo[];
}

export interface Manifest {
  title: string;
  password: string;
  coverImage: string;
  sections: Section[];
}

export interface GalleryMeta {
  title: string;
  coverImage: string;
  exists: boolean;
}

export interface GalleryData {
  title: string;
  coverImage: string;
  sections: Section[];
  baseUrl: string;
  cdnBaseUrl: string;
}

/** Maps a photo's `src` to the list of guest names who liked it. */
export type GalleryLikes = Record<string, string[]>;

import galleryConfig from './gallery.json';
import rosterConfig from './roster.json';
import { driveImage } from '../assets/images';
import type { GalleryItem, RosterMember } from '../types';

export const gallery: GalleryItem[] = galleryConfig.items.map(({ url, ...item }) => ({
  ...item,
  imageUrl: url.trim() ? driveImage(`gallery-${item.id}`, '') : '',
}));

export const roster: RosterMember[] = rosterConfig.map(({ url, ...item }) => ({
  ...item,
  role: item.role as RosterMember['role'],
  position: item.position as RosterMember['position'],
  image: url.trim() ? driveImage(`roster-${item.id}`, '') : '',
}));

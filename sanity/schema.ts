import seo from './schemas/objects/seo';
import staffMember from './schemas/documents/staff';
import newsArticle from './schemas/documents/newsArticle';
import event from './schemas/documents/event';
import post from './schemas/documents/post';
import galleryItem from './schemas/documents/galleryItem';

export const schema = {
  types: [
    seo,
    staffMember,
    newsArticle,
    event,
    post,
    galleryItem,
  ],
};

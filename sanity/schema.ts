import seo from './schemas/objects/seo';
import staffMember from './schemas/documents/staff';
import newsArticle from './schemas/documents/newsArticle';
import event from './schemas/documents/event';
import post from './schemas/documents/post';
import galleryItem from './schemas/documents/galleryItem';
import partner from './schemas/documents/partner';
import testimonial from './schemas/documents/testimonial';
import activityHighlight from './schemas/documents/activityHighlight';

export const schema = {
  types: [
    seo,
    partner,
    testimonial,
    activityHighlight,
    staffMember,
    newsArticle,
    event,
    post,
    galleryItem,
  ],
};

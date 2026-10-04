import type { StructureResolver } from 'sanity/structure';

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('A.A.U Chamo Content Studio')
    .items([
      S.listItem()
        .title('Site Management')
        .child(
          S.list()
            .title('Site Management')
            .items([
              S.documentTypeListItem('partner').title('Partners & Strategic Alliances'),
              S.documentTypeListItem('testimonial').title('Client Testimonials & Feedback'),
              S.documentTypeListItem('activityHighlight').title('Operational Activities & Highlights'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Editorial & Media')
        .child(
          S.list()
            .title('Editorial & Media')
            .items([
              S.documentTypeListItem('newsArticle').title('News & Articles'),
              S.documentTypeListItem('event').title('Events & Forums'),
              S.documentTypeListItem('galleryItem').title('Gallery Items'),
              S.documentTypeListItem('post').title('Posts & Guides'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Corporate & Team')
        .child(
          S.list()
            .title('Corporate & Team')
            .items([
              S.documentTypeListItem('staffMember').title('Staff & Leadership'),
            ])
        ),
    ]);

export const pollingInterval = 120;
export const tags = {
  fetchPage: (slug: string) => `fetchPage-${slug}`,
  fetchTenant: (host: string) => `fetchTenant-${host}`,
  fetchCart: "fetchCart",
  fetchProduct: (slug: string) => `fetchProduct-${slug}`,
  fetchProducts: "fetchProducts",
  fetchInterestingProducts: (slug: string | number) => `fetchInterestingProducts-${slug}`,
  fetchCourse: (slug: string | number) => `fetchCourse-${slug}`,
  fetchInterestingCourses: (slug: string | number) => `fetchInterestingCourses-${slug}`,
  fetchContent: (slug: string | number, chapterId: string | number, contentId: string | number) =>
    `fetchContent-${slug}-${chapterId}-${contentId}`,
  fetchContentComments: (slug: string | number, chapterId: string | number, contentId: string | number) =>
    `fetchContentComments-${slug}-${chapterId}-${contentId}`,
  fetchMemberSurvey: (slug: string | number, chapterId: string | number, contentId: string | number) =>
    `fetchMemberSurvey-${slug}-${chapterId}-${contentId}`,
  fetchMemberQuiz: (slug: string | number, chapterId: string | number, contentId: string | number) =>
    `fetchMemberQuiz-${slug}-${chapterId}-${contentId}`,
  fetchArticle: (slug: string | number) => `fetchArticle-${slug}`,
  fetchArticleComments: (slug: string | number) => `fetchArticleComments-${slug}`,
  fetchTaxonomy: (slug: string) => `fetchTaxonomy-${slug}`,
  fetchAffiliate: "fetchAffiliate",
  fetchPayouts: "fetchPayouts",
  fetchOrders: "fetchOrders",
  fetchTranslations: "fetchTranslations",
  fetchInstructor: (id: number) => `fetchInstructor-${id}`,
  fetchBankData: "fetchBankData",
  fetchCurrencies: "fetchCurrencies",
  fetchReviews: (relationType: string, relationId: number) => `fetchReviews-${relationType}-${relationId}`,
  fetchReviewsDistribution: (relationType: string, relationId: number | string) =>
    `fetchReviewsDistribution-${relationType}-${relationId}`,
  fetchMemberAppointments: "fetchMemberAppointments"
};

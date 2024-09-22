function breadcrumbListJsonLd(
  elements: {
    name: string;
    id: string;
  }[]
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: elements.map((element, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        name: element.name,
        "@id": element.id,
        url: element.id
      }
    }))
  };
}
export default breadcrumbListJsonLd;

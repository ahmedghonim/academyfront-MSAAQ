import { Page } from "@/types";

//1- import all blocks components
import Articles from "./articles";
import BaseSection from "./base-section";
import Carousel from "./carousel";
import Chapters from "./chapters";
import ContactForm from "./contact-form";
import Courses from "./courses";
import Cta from "./cta";
import Faq from "./faq";
import Features from "./features";
import Html from "./html";
import ImageOrVideo from "./image-or-video";
import NewsletterForm from "./newsletter-form";
import Products from "./products";
import Reviews from "./reviews";
import Taxonomies from "./taxonomies";

//2- register blocks components
const Blocks = {
  text: BaseSection,
  image: ImageOrVideo,
  video: ImageOrVideo,
  cta: Cta,
  features: Features,
  html: Html,
  articles: Articles,
  faq: Faq,
  chapters: Chapters,
  courses: Courses,
  products: Products,
  "contact-form": ContactForm,
  "newsletter-form": NewsletterForm,
  taxonomies: Taxonomies,
  carousel: Carousel,
  reviews: Reviews
};

//3- dynamically render blocks components
function renderDynamicBlocks(page: Page | undefined) {
  return page?.blocks.map((block) => {
    const Block = Blocks[block.key as keyof typeof Blocks];

    if (!Block) return null;

    return (
      // @ts-ignore
      <Block
        // @ts-ignore
        block={block}
        key={block.id}
      />
    );
  });
}

interface Props {
  page: Page;
}

export default function DynamicPage({ page }: Props) {
  return <>{renderDynamicBlocks(page)}</>;
}

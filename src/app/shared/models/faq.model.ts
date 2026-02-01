export class FaqCategory {
  id: string = "";
  category_name: string = "";
  category_slug: string = "";
  title: string = "";
  image: string = "";
  order_by: string = "";
  status: string = "";
  create_date: string = "";
  updated_date: string = "";
  permalink: string = "";
}

export class FaqDetails {
  faq_id: string = "";
  category_id: string = "";
  faq_question: string = "";
  title: string = "";
  permalink: string = "";
  description: string = "";
  image: string = "";
  writer_name: string = "";
  order_by: string = "";
  status: string = "";
  create_date: string = "";
  updated_date: string = "";
}

export type FAQItem = {
  question: string;
  answer: string;
  language: string;
  id: string;
};

export type FAQs = {
  id: string;
  language: string;
  title: string;
  type: string;
  items: FAQItem[];
};

import type { FaqItem } from "@/types/faq";

export const mockFaqs: FaqItem[] = [
  {
    id: "faq-lead",
    question: "What is a typical lead time for standard fasteners?",
    answer:
      "Stocked hex bolts, nuts, screws, and nails in regular sizes leave in 3–7 working days. Special lengths, hot-dip galvanizing, and stainless lots are quoted with a packing week attached.",
  },
  {
    id: "faq-drawings",
    question: "Can you supply to a size list or a drawing?",
    answer:
      "Yes. Send the diameter, length, grade, and finish — or a bolt schedule. We confirm the standard (ISO / DIN / IS) before packing so the site is not guessing.",
  },
  {
    id: "faq-inspection",
    question: "What travels with the shipment?",
    answer:
      "A packing list by size and count, grade marks on heads where specified, and material certificates when the order asks for them.",
  },
  {
    id: "faq-spares",
    question: "Do you keep common sizes in store?",
    answer:
      "M6 to M20 hex bolts and nuts, common machine screws, and wire nails in the usual lengths are held as running stock. Odd lengths are cut or headed against the order.",
  },
];

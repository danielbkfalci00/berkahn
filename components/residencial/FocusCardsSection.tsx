"use client";

import { FocusCards } from "@/components/ui/focus-cards";

interface FocusCardsSectionProps {
  cards: { title: string; src: string }[];
}

export function FocusCardsSection({ cards }: FocusCardsSectionProps) {
  return <FocusCards cards={cards} />;
}

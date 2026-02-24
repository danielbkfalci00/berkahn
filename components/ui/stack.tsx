"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import Image from "next/image";

interface CardData {
  id: number;
  img: string;
}

interface CardRotation {
  x: number;
  y: number;
  rotate: number;
}

interface StackProps {
  cards: CardData[];
  sensitivity?: number;
  randomRotation?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

function CardStack({
  cards: initialCards,
  sensitivity = 200,
  randomRotation = false,
  autoplay = false,
  autoplayInterval = 4000,
}: StackProps) {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInteractingRef = useRef(false);

  const sendToBack = (id: number) => {
    setCards((prev) => {
      const card = prev.find((c) => c.id === id);
      if (!card) return prev;
      return [...prev.filter((c) => c.id !== id), card];
    });
  };

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        if (!isInteractingRef.current) {
          setCards((prev) => {
            if (prev.length === 0) return prev;
            const [first, ...rest] = prev;
            return [...rest, first];
          });
        }
      }, autoplayInterval);
    };

    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoplay, autoplayInterval]);

  return (
    <div className="stack-perspective relative flex items-center justify-center w-[280px] h-[200px] md:w-[400px] md:h-[280px]">
      {cards.map((card, index) => {
        const randomRotate = randomRotation
          ? Math.random() * 8 - 4
          : 0;

        return (
          <CardComponent
            key={card.id}
            card={card}
            index={cards.length - 1 - index}
            total={cards.length}
            sendToBack={sendToBack}
            sensitivity={sensitivity}
            randomRotation={randomRotation}
            initialRotation={{
              x: 0,
              y: 0,
              rotate: randomRotate,
            }}
            onInteractionStart={() => {
              isInteractingRef.current = true;
            }}
            onInteractionEnd={() => {
              isInteractingRef.current = false;
            }}
          />
        );
      })}
    </div>
  );
}

interface CardComponentProps {
  card: CardData;
  index: number;
  total: number;
  sendToBack: (id: number) => void;
  sensitivity: number;
  randomRotation: boolean;
  initialRotation: CardRotation;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
}

function CardComponent({
  card,
  index,
  total,
  sendToBack,
  sensitivity,
  randomRotation,
  initialRotation,
  onInteractionStart,
  onInteractionEnd,
}: CardComponentProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-sensitivity, sensitivity], [10, -10]);
  const rotateY = useTransform(x, [-sensitivity, sensitivity], [-10, 10]);

  const isFront = index === total - 1;

  return (
    <motion.div
      className="absolute w-[280px] h-[200px] md:w-[400px] md:h-[280px] rounded-lg stack-card-shadow overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        x,
        y,
        rotateX,
        rotateY,
        rotate: initialRotation.rotate,
        zIndex: index,
      }}
      animate={{
        scale: 1 - (total - 1 - index) * 0.03,
        y: -(total - 1 - index) * 8,
      }}
      drag={isFront}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.6}
      onDragStart={() => onInteractionStart()}
      onDragEnd={(_, info) => {
        onInteractionEnd();
        if (
          Math.abs(info.offset.x) > sensitivity ||
          Math.abs(info.offset.y) > sensitivity
        ) {
          sendToBack(card.id);
        }
      }}
      whileTap={isFront ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <Image
        src={card.img}
        alt={`Projeto ${card.id}`}
        fill
        className="object-cover pointer-events-none"
        sizes="(max-width: 768px) 280px, 400px"
      />
    </motion.div>
  );
}

export { CardStack as Stack };

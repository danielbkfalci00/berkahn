"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { DecisionGuide } from "@/types/article";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

interface DecisionGuideSectionProps {
  guide: DecisionGuide;
  className?: string;
}

export function DecisionGuideSection({ guide, className = "" }: DecisionGuideSectionProps) {
  const getBadgeVariant = (rec: string) => {
    if (rec === 'lsf') return 'default';
    if (rec === 'alvenaria') return 'secondary';
    return 'outline';
  };

  const getRecommendationLabel = (rec: string) => {
    if (rec === 'lsf') return 'Steel Frame';
    if (rec === 'alvenaria') return 'Alvenaria';
    return 'Depende do contexto';
  };

  return (
    <RevealOnScroll>
      <div className={`space-y-6 ${className}`}>
        <h3 className="headline-sm mb-8 text-center">{guide.question}</h3>

        <div className="grid gap-4 md:gap-6">
          {guide.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.19, 1, 0.22, 1]
              }}
            >
              <Card className="hover:shadow-luxury-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1 text-black" />

                    <div className="flex-1 space-y-3">
                      <p className="font-heading font-semibold text-lg">
                        {option.label}
                      </p>

                      <Badge variant={getBadgeVariant(option.recommendation)}>
                        Recomendação: {getRecommendationLabel(option.recommendation)}
                      </Badge>

                      <p className="body-md text-black-70">
                        {option.explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
}

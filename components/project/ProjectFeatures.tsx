"use client";

import { Project } from "@/types/project";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Bed,
  Bath,
  ChefHat,
  Sofa,
  UtensilsCrossed,
  WashingMachine,
  Car,
  Sparkles,
} from "lucide-react";

interface ProjectFeaturesProps {
  project: Project;
}

export function ProjectFeatures({ project }: ProjectFeaturesProps) {
  const { features } = project;

  const featureItems = [
    {
      icon: Bed,
      label: "Dormitório",
      labelPlural: "Dormitórios",
      value: features.bedrooms,
    },
    {
      icon: Bath,
      label: "Banheiro",
      labelPlural: "Banheiros",
      value: features.bathrooms,
    },
    {
      icon: Sparkles,
      label: "Suíte",
      labelPlural: "Suítes",
      value: features.suites,
    },
    {
      icon: ChefHat,
      label: "Cozinha",
      labelPlural: "Cozinhas",
      value: features.kitchens,
    },
    {
      icon: Sofa,
      label: "Sala de Estar",
      labelPlural: "Salas de Estar",
      value: features.livingRooms,
    },
    {
      icon: UtensilsCrossed,
      label: "Sala de Jantar",
      labelPlural: "Salas de Jantar",
      value: features.diningRooms,
    },
    {
      icon: WashingMachine,
      label: "Lavanderia",
      labelPlural: "Lavanderias",
      value: features.laundries,
    },
    {
      icon: Car,
      label: "Vaga",
      labelPlural: "Vagas",
      value: features.garages,
    },
  ].filter((item) => item.value > 0); // Só mostra features com valor > 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {featureItems.map((feature, index) => (
        <RevealOnScroll key={feature.label} delay={index * 0.05}>
          <div className="bg-white p-6 text-center shadow-luxury-sm hover:shadow-luxury-md transition-shadow duration-300">
            <div className="w-14 h-14 mx-auto mb-4 bg-black-5 rounded-full flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-black" />
            </div>
            <p className="text-3xl font-heading font-semibold mb-2">
              {feature.value}
            </p>
            <p className="text-sm text-black-70">
              {feature.value === 1 ? feature.label : feature.labelPlural}
            </p>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}

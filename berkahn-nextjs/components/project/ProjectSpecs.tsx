import { Project, formatArea, formatDimensions } from "@/types/project";
import { Maximize2, Grid3X3, Ruler } from "lucide-react";

interface ProjectSpecsProps {
  project: Project;
}

export function ProjectSpecs({ project }: ProjectSpecsProps) {
  const { area } = project;

  const specs = [
    {
      icon: Maximize2,
      label: "Área Construída",
      value: formatArea(area.builtArea),
      highlight: true,
    },
    {
      icon: Grid3X3,
      label: "Lote Mínimo (LxC)",
      value: formatDimensions(area.minLotWidth, area.minLotLength),
      highlight: false,
    },
    {
      icon: Ruler,
      label: "Dimensões da Obra (LxC)",
      value: formatDimensions(area.buildWidth, area.buildLength),
      highlight: false,
    },
  ];

  return (
    <div className="bg-black-5 p-8 lg:p-10">
      <h3 className="headline-sm mb-8">Área da Casa e do Lote</h3>

      <div className="space-y-6">
        {specs.map((spec, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              spec.highlight ? "pb-6 border-b border-black/10" : ""
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                spec.highlight
                  ? "bg-black text-white"
                  : "bg-white text-black shadow-luxury-sm"
              }`}
            >
              <spec.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-black-50 mb-1">{spec.label}</p>
              <p
                className={`font-heading ${
                  spec.highlight
                    ? "text-3xl font-semibold"
                    : "text-xl font-medium"
                }`}
              >
                {spec.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 pt-8 border-t border-black/10">
        <a
          href="/contato"
          className="block w-full py-4 bg-black text-white text-center uppercase tracking-wider text-sm font-medium hover:bg-black-90 transition-colors duration-300"
        >
          Solicitar Orçamento
        </a>
      </div>
    </div>
  );
}

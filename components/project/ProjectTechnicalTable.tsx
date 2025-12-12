"use client";

import { motion } from "framer-motion";
import { ProjectSpecification } from "@/types/project";

interface ProjectTechnicalTableProps {
  specifications: ProjectSpecification[];
}

export function ProjectTechnicalTable({ specifications }: ProjectTechnicalTableProps) {
  if (!specifications || specifications.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow-luxury-lg overflow-hidden">
        <thead className="bg-black text-white">
          <tr>
            <th className="py-6 px-6 font-heading text-lg font-medium text-left">
              Categoria
            </th>
            <th className="py-6 px-6 font-heading text-lg font-medium text-left">
              Especificação
            </th>
            <th className="py-6 px-6 font-heading text-lg font-medium text-left">
              Detalhes
            </th>
          </tr>
        </thead>
        <tbody>
          {specifications.map((spec, index) => (
            <motion.tr
              key={spec.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="border-b border-black-10 hover:bg-black-5 transition-colors duration-200"
            >
              <td className="py-5 px-6 body-md font-medium text-black">
                {spec.category}
              </td>
              <td className="py-5 px-6 body-md text-black">
                {spec.name}
              </td>
              <td className="py-5 px-6 body-md text-black-70">
                {spec.description || "—"}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Summary box */}
      <div className="mt-6 bg-black-5 rounded-lg py-4 px-6">
        <p className="text-sm text-black-70">
          Todas as especificações seguem rigorosos padrões de qualidade e normas técnicas brasileiras.
        </p>
      </div>
    </div>
  );
}

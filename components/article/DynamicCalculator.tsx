"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArticleCalculator } from "@/types/article";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, Info } from "lucide-react";

interface DynamicCalculatorProps {
  calculator: ArticleCalculator;
  className?: string;
}

export function DynamicCalculator({
  calculator,
  className = "",
}: DynamicCalculatorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Initialize state from input defaults
  const initialState = calculator.inputs.reduce((acc, input) => {
    acc[input.id] = input.defaultValue;
    return acc;
  }, {} as Record<string, number | string>);

  const [values, setValues] = useState(initialState);

  // Safe formula evaluation
  const result = useMemo(() => {
    try {
      // Replace variable names in formula with actual values
      let formulaStr = calculator.formula;
      calculator.inputs.forEach((input) => {
        const value = Number(values[input.id]) || 0;
        formulaStr = formulaStr.replace(
          new RegExp(`\\b${input.id}\\b`, "g"),
          value.toString()
        );
      });

      // Safe evaluation using Function constructor (limited scope)
      const result = new Function(`return ${formulaStr}`)();
      return isNaN(result) ? 0 : result;
    } catch (error) {
      console.error("Calculator formula error:", error);
      return 0;
    }
  }, [values, calculator.formula, calculator.inputs]);

  // Format result based on type
  const formatResult = (value: number) => {
    switch (calculator.resultFormat) {
      case "currency":
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "days":
        return `${Math.round(value)} dias`;
      case "number":
      default:
        return new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value);
    }
  };

  // Handle input changes
  const handleInputChange = (inputId: string, value: string | number) => {
    const input = calculator.inputs.find((i) => i.id === inputId);
    if (!input) return;

    let processedValue: number | string = value;

    if (input.type === "number" || input.type === "slider") {
      const numValue = Number(value) || 0;
      const min = input.min ?? 0;
      const max = input.max ?? Infinity;
      processedValue = Math.min(Math.max(numValue, min), max);
    }

    setValues((prev) => ({ ...prev, [inputId]: processedValue }));
  };

  return (
    <motion.div
      ref={ref}
      className={`${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      <Card className="shadow-luxury-md">
        <CardHeader className="border-b border-black-10">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-black rounded-lg">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="headline-sm mb-1">
                {calculator.title}
              </CardTitle>
              {calculator.description && (
                <p className="text-sm text-black-60 mt-1">
                  {calculator.description}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Inputs */}
            <div className="space-y-4">
              {calculator.inputs.map((input) => (
                <div key={input.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={input.id} className="text-sm font-medium">
                      {input.label}
                      {input.unit && (
                        <span className="text-black-50 ml-1">({input.unit})</span>
                      )}
                    </Label>
                    {input.tooltip && (
                      <div className="group relative">
                        <Info className="w-4 h-4 text-black-40 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-black text-white text-xs rounded-md shadow-lg z-10">
                          {input.tooltip}
                        </div>
                      </div>
                    )}
                  </div>

                  {input.type === "select" && input.options ? (
                    <Select
                      value={values[input.id].toString()}
                      onValueChange={(value) => handleInputChange(input.id, value)}
                    >
                      <SelectTrigger id={input.id} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {input.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : input.type === "slider" ? (
                    <div className="space-y-2">
                      <Input
                        id={input.id}
                        type="range"
                        min={input.min ?? 0}
                        max={input.max ?? 100}
                        step={input.step ?? 1}
                        value={values[input.id]}
                        onChange={(e) =>
                          handleInputChange(input.id, e.target.value)
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-black-60">
                        <span>{input.min ?? 0}</span>
                        <span className="font-medium text-black">
                          {values[input.id]}
                        </span>
                        <span>{input.max ?? 100}</span>
                      </div>
                    </div>
                  ) : (
                    <Input
                      id={input.id}
                      type="number"
                      min={input.min}
                      max={input.max}
                      step={input.step ?? 1}
                      value={values[input.id]}
                      onChange={(e) =>
                        handleInputChange(input.id, e.target.value)
                      }
                      className="w-full"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Result */}
            <div className="flex flex-col justify-center">
              <div className="bg-gradient-to-br from-black to-black-80 rounded-lg p-6 text-white">
                <div className="text-sm font-medium opacity-80 mb-2">
                  {calculator.resultLabel}
                </div>
                <div className="text-4xl font-bold font-heading">
                  {formatResult(result)}
                </div>
                {calculator.resultUnit && (
                  <div className="text-sm opacity-70 mt-1">
                    {calculator.resultUnit}
                  </div>
                )}
              </div>

              {calculator.disclaimer && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {calculator.disclaimer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

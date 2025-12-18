"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Calculator, TrendingUp, DollarSign, Calendar } from "lucide-react";

interface FinancingCalculatorProps {
  className?: string;
}

export function FinancingCalculator({ className = "" }: FinancingCalculatorProps) {
  // Estado dos inputs
  const [propertyValue, setPropertyValue] = useState(300000);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(10.99);
  const [term, setTerm] = useState(30);

  // Cálculos usando useMemo para performance
  const calculations = useMemo(() => {
    // Valor da entrada
    const downPaymentAmount = propertyValue * (downPayment / 100);

    // Valor financiado
    const financedAmount = propertyValue - downPaymentAmount;

    // Taxa mensal
    const monthlyRate = interestRate / 100 / 12;

    // Prazo em meses
    const months = term * 12;

    // Parcela mensal (Sistema Price/Francês)
    const monthlyPayment = financedAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    // Total pago
    const totalPaid = monthlyPayment * months + downPaymentAmount;

    // Total de juros
    const totalInterest = totalPaid - propertyValue;

    return {
      downPaymentAmount,
      financedAmount,
      monthlyPayment,
      totalPaid,
      totalInterest
    };
  }, [propertyValue, downPayment, interestRate, term]);

  // Formatador de moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Handlers com validação
  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setPropertyValue(Math.min(Math.max(value, 50000), 5000000));
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDownPayment(Math.min(Math.max(value, 0), 80));
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setInterestRate(Math.min(Math.max(value, 3), 20));
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setTerm(Math.min(Math.max(value, 1), 35));
  };

  return (
    <RevealOnScroll>
      <Card className={`overflow-hidden border-black-10 shadow-luxury-md ${className}`}>
        <CardHeader className="bg-black text-white">
          <CardTitle className="flex items-center gap-2 headline-sm">
            <Calculator className="w-6 h-6" />
            Calculadora de Financiamento
          </CardTitle>
          <p className="text-sm text-white/70 mt-2">
            Simule sua construção em Steel Frame e descubra quanto vai pagar
          </p>
        </CardHeader>

        <CardContent className="p-4 md:p-6 lg:p-8">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            {/* Valor do Imóvel */}
            <div className="space-y-2">
              <Label htmlFor="property-value" className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="w-4 h-4" />
                Valor do Imóvel
              </Label>
              <Input
                id="property-value"
                type="number"
                value={propertyValue}
                onChange={handlePropertyValueChange}
                min={50000}
                max={5000000}
                step={10000}
                className="text-lg font-medium"
                aria-label="Valor do imóvel em reais"
              />
              <p className="text-xs text-black-50">
                Mínimo: R$ 50.000 | Máximo: R$ 5.000.000
              </p>
            </div>

            {/* Entrada */}
            <div className="space-y-2">
              <Label htmlFor="down-payment" className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Entrada (%)
              </Label>
              <Input
                id="down-payment"
                type="number"
                value={downPayment}
                onChange={handleDownPaymentChange}
                min={0}
                max={80}
                step={5}
                className="text-lg font-medium"
                aria-label="Percentual de entrada"
              />
              <p className="text-xs text-black-50">
                Valor: {formatCurrency(calculations.downPaymentAmount)}
              </p>
            </div>

            {/* Taxa de Juros */}
            <div className="space-y-2">
              <Label htmlFor="interest-rate" className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Taxa de Juros (% a.a.)
              </Label>
              <Input
                id="interest-rate"
                type="number"
                value={interestRate}
                onChange={handleInterestRateChange}
                min={3}
                max={20}
                step={0.01}
                className="text-lg font-medium"
                aria-label="Taxa de juros anual"
              />
              <p className="text-xs text-black-50">
                Mínimo: 3% | Máximo: 20%
              </p>
            </div>

            {/* Prazo */}
            <div className="space-y-2">
              <Label htmlFor="term" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Prazo (anos)
              </Label>
              <Input
                id="term"
                type="number"
                value={term}
                onChange={handleTermChange}
                min={1}
                max={35}
                step={1}
                className="text-lg font-medium"
                aria-label="Prazo do financiamento em anos"
              />
              <p className="text-xs text-black-50">
                {term * 12} meses | Mínimo: 1 ano | Máximo: 35 anos
              </p>
            </div>
          </div>

          {/* Divisor */}
          <div className="border-t border-black-10 my-6"></div>

          {/* Resultados */}
          <div className="space-y-4">
            <p className="label-text text-black-50 mb-4">
              Resultados da Simulação
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Parcela Mensal */}
              <div className="bg-black-5 rounded-lg p-4 border border-black-10">
                <p className="text-xs text-black-50 mb-1 uppercase tracking-wide">
                  Parcela Mensal
                </p>
                <p className="text-2xl md:text-3xl font-bold text-black mb-1">
                  {formatCurrency(calculations.monthlyPayment)}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {term * 12}x parcelas
                </Badge>
              </div>

              {/* Total Pago */}
              <div className="bg-black-5 rounded-lg p-4 border border-black-10">
                <p className="text-xs text-black-50 mb-1 uppercase tracking-wide">
                  Total Pago
                </p>
                <p className="text-2xl md:text-3xl font-bold text-black mb-1">
                  {formatCurrency(calculations.totalPaid)}
                </p>
                <Badge variant="outline" className="text-xs">
                  Entrada + Parcelas
                </Badge>
              </div>

              {/* Total de Juros */}
              <div className="bg-black-5 rounded-lg p-4 border border-black-10">
                <p className="text-xs text-black-50 mb-1 uppercase tracking-wide">
                  Total de Juros
                </p>
                <p className="text-2xl md:text-3xl font-bold text-black mb-1">
                  {formatCurrency(calculations.totalInterest)}
                </p>
                <Badge variant="destructive" className="text-xs">
                  {((calculations.totalInterest / propertyValue) * 100).toFixed(1)}% do valor
                </Badge>
              </div>
            </div>

            {/* Detalhamento */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-black-10">
              <p className="text-sm font-medium text-black-70 mb-3">
                Detalhamento do Financiamento
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-black-60">Valor do imóvel:</span>
                  <span className="font-medium text-black">{formatCurrency(propertyValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black-60">Entrada ({downPayment}%):</span>
                  <span className="font-medium text-black">{formatCurrency(calculations.downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-black-10 pt-2">
                  <span className="text-black-60">Valor financiado:</span>
                  <span className="font-medium text-black">{formatCurrency(calculations.financedAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black-60">Sistema de amortização:</span>
                  <span className="font-medium text-black">Tabela Price</span>
                </div>
              </div>
            </div>

            {/* Aviso */}
            <p className="text-xs text-black-50 mt-4">
              * Valores simulados. As condições finais podem variar conforme análise de crédito,
              relacionamento com o banco e políticas vigentes. Consulte sua instituição financeira
              para uma proposta personalizada.
            </p>
          </div>
        </CardContent>
      </Card>
    </RevealOnScroll>
  );
}

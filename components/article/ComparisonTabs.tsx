"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatsGrid } from "@/components/article/StatHighlight";
import { DataTable } from "@/components/article/DataTable";
import { TabComparison } from "@/types/article";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

interface ComparisonTabsProps {
  comparison: TabComparison;
  className?: string;
}

export function ComparisonTabs({ comparison, className = "" }: ComparisonTabsProps) {
  return (
    <RevealOnScroll>
      <div className={`space-y-6 ${className}`}>
        {comparison.title && (
          <h3 className="headline-sm">{comparison.title}</h3>
        )}

        <Tabs defaultValue={comparison.tabs[0].value} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black-5 p-1.5 rounded-lg">
            {comparison.tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-black data-[state=active]:text-white transition-all duration-300"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {comparison.tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6 space-y-6">
              {tab.content.stats && (
                <StatsGrid stats={tab.content.stats} />
              )}

              {tab.content.description && (
                <p className="body-lg text-black-70">{tab.content.description}</p>
              )}

              {tab.content.table && (
                <DataTable table={tab.content.table} />
              )}

              {tab.content.items && (
                <ul className="space-y-2">
                  {tab.content.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                      <span className="body-md text-black-70">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </RevealOnScroll>
  );
}

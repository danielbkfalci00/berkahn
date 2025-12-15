"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LSF_LAYERS } from "@/lib/lsf-data";

export function WallLayersTabs() {
  return (
    <Tabs defaultValue="layer-4" className="w-full">
      {/* Tab Triggers - Horizontal List */}
      <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-black-5">
        {LSF_LAYERS.map((layer) => (
          <TabsTrigger
            key={layer.id}
            value={`layer-${layer.id}`}
            className="flex flex-col items-center py-3 px-2 text-xs data-[state=active]:bg-white data-[state=active]:shadow-luxury-md transition-all duration-200"
          >
            <span className="font-heading font-bold text-lg mb-1">{layer.id}</span>
            <span className="hidden md:block text-[10px] text-center leading-tight">
              {layer.name.split(' ')[0]}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab Content - Details Card */}
      {LSF_LAYERS.map((layer) => (
        <TabsContent key={layer.id} value={`layer-${layer.id}`}>
          <Card className="mt-6 shadow-luxury-lg border-0">
            <CardHeader className="bg-black text-white rounded-t-lg">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Camada {layer.id}
                  </Badge>
                  <CardTitle className="text-2xl font-heading">
                    {layer.name}
                  </CardTitle>
                  <p className="text-white/80 mt-2">{layer.description}</p>
                </div>
                <Badge className="bg-white text-black hover:bg-white/90">
                  {layer.thickness}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Full Description */}
              <p className="body-lg text-black-70 leading-relaxed">
                {layer.fullDescription}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-black-10">
                <div>
                  <p className="text-sm font-medium text-black-50 mb-1">Espessura</p>
                  <p className="font-medium">{layer.thickness}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black-50 mb-1">Material</p>
                  <p className="font-medium">{layer.material}</p>
                </div>
              </div>

              {/* Function Box */}
              <div className="bg-black-5 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium mb-2">Função principal:</p>
                <p className="text-black-70">{layer.function}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}

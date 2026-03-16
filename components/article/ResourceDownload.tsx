"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { ResourceLibrary } from "@/types/article";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  FileSpreadsheet,
  FileArchive,
  Link as LinkIcon,
  Download,
  Lock,
} from "lucide-react";

interface ResourceDownloadProps {
  resources: ResourceLibrary;
  className?: string;
}

export function ResourceDownload({
  resources,
  className = "",
}: ResourceDownloadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [selectedResource, setSelectedResource] = useState<(typeof resources.resources)[0] | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get icon for file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-6 h-6" />;
      case "xlsx":
      case "docx":
        return <FileSpreadsheet className="w-6 h-6" />;
      case "zip":
        return <FileArchive className="w-6 h-6" />;
      case "link":
        return <LinkIcon className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  // Handle download
  const handleDownload = async (resource: (typeof resources.resources)[0]) => {
    if (resource.requiresEmail) {
      setSelectedResource(resource);
      return;
    }

    // Direct download
    if (resource.downloadUrl) {
      window.open(resource.downloadUrl, "_blank");
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call (replace with actual lead capture logic)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Download file
    if (selectedResource?.downloadUrl) {
      window.open(selectedResource.downloadUrl, "_blank");
    }

    // Reset state
    setIsSubmitting(false);
    setEmail("");
    setSelectedResource(null);

    // TODO: Send email to backend for lead capture
    // await fetch('/api/leads', { method: 'POST', body: JSON.stringify({ email, resource: selectedResource.title }) });
  };

  return (
    <>
      <motion.div
        ref={ref}
        className={`bg-white rounded-lg shadow-luxury-md overflow-hidden ${className}`}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Title */}
        <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-4 border-b border-black-10">
          <h3 className="headline-sm mb-2">{resources.title || "Recursos para Download"}</h3>
          {resources.description && (
            <p className="text-sm text-black-60">{resources.description}</p>
          )}
        </div>

        {/* Resources */}
        <div className="px-4 md:px-6 lg:px-8 py-6">
          {resources.layout === "list" ? (
            <div className="space-y-4">
              {resources.resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center gap-4 p-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-black-5 rounded-lg text-black-70">
                        {getFileIcon(resource.type)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold mb-1 truncate">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-black-60 line-clamp-2 mb-2">
                          {resource.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {resource.fileSize && (
                            <span className="text-xs text-black-50">
                              {resource.fileSize}
                            </span>
                          )}
                          {resource.tags?.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Download Button */}
                      <Button
                        onClick={() => handleDownload(resource)}
                        variant={resource.requiresEmail ? "default" : "outline"}
                        size="sm"
                        className="flex-shrink-0"
                      >
                        {resource.requiresEmail ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Obter Acesso
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            // Grid layout (default)
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
                    {/* Thumbnail */}
                    {resource.thumbnail && (
                      <div className="relative w-full h-40 bg-black-5">
                        <Image
                          src={resource.thumbnail}
                          alt={resource.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black-5 rounded-lg text-black-70">
                          {getFileIcon(resource.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">
                            {resource.title}
                          </CardTitle>
                          {resource.fileSize && (
                            <p className="text-xs text-black-50 mt-1">
                              {resource.fileSize}
                            </p>
                          )}
                        </div>
                      </div>
                      <CardDescription className="line-clamp-3">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="mt-auto">
                      {/* Tags */}
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resource.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Download Button */}
                      <Button
                        onClick={() => handleDownload(resource)}
                        variant={resource.requiresEmail ? "default" : "outline"}
                        className="w-full"
                      >
                        {resource.requiresEmail ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Obter Acesso
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Email Gate Dialog */}
      <Dialog
        open={selectedResource !== null}
        onOpenChange={(open) => !open && setSelectedResource(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acesso ao Recurso</DialogTitle>
            <DialogDescription>
              Insira seu e-mail para receber o download de{" "}
              <strong>{selectedResource?.title}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-black-50">
                Seu e-mail será usado apenas para enviar o material solicitado.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedResource(null)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Enviando..." : "Baixar Agora"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

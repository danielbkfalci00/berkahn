import { Lightbulb } from "lucide-react";

interface AnswerSummaryProps {
  summary: string;
  articleTitle: string;
}

export function AnswerSummary({ summary, articleTitle }: AnswerSummaryProps) {
  return (
    <>
      <div className="bg-neutral-50 border-l-4 border-black rounded-r-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-black mt-0.5 shrink-0" />
          <div>
            <p className="text-xs tracking-widest text-neutral-600 uppercase mb-2">
              Resposta direta
            </p>
            <p className="text-neutral-800 leading-relaxed">{summary}</p>
          </div>
        </div>
      </div>

      {/* Schema for AI citation — acceptedAnswer pattern */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Question",
          name: articleTitle,
          acceptedAnswer: {
            "@type": "Answer",
            text: summary,
          },
        })}
      </script>
    </>
  );
}

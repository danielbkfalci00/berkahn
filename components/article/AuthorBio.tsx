import Image from "next/image";

interface AuthorCredential {
  name: string;
  category: string;
}

interface AuthorData {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  credential?: AuthorCredential;
  alumniOf?: string;
}

const AUTHORS: Record<string, AuthorData> = {
  "Daniel Falci": {
    name: "Daniel Falci",
    role: "Co-Fundador & Engenheiro Civil",
    bio: "Engenheiro civil com sólida experiência em planejamento, gerenciamento e execução de obras residenciais, comerciais e logísticas de alto padrão em São Paulo. Co-fundador da Berkahn.",
    image: "/images/founders/daniel-falci.webp",
    linkedin: "https://www.linkedin.com/in/danielbkfalci/",
    credential: { name: "CREA-SP", category: "Professional License" },
  },
  "Bruno Ribeiro": {
    name: "Bruno Ribeiro",
    role: "Co-Fundador & Engenheiro Civil",
    bio: "Engenheiro civil especialista em Steel Frame e construção industrializada. Experiência em projetos residenciais e comerciais com foco em eficiência e inovação. Co-fundador da Berkahn.",
    image: "/images/founders/bruno-ribeiro.webp",
    linkedin: "https://www.linkedin.com/in/bruno-ribeiro-berkahn/",
    credential: { name: "CREA-SP", category: "Professional License" },
  },
};

interface AuthorBioProps {
  authorName: string;
}

export function AuthorBio({ authorName }: AuthorBioProps) {
  const author = AUTHORS[authorName];
  if (!author) return null;

  return (
    <>
      <div className="border-t border-neutral-200 pt-8 mt-12">
        <p className="text-xs tracking-widest text-neutral-400 uppercase mb-4">Sobre o autor</p>
        <div className="flex items-start gap-4">
          <Image
            src={author.image}
            alt={author.name}
            width={64}
            height={64}
            className="rounded-full object-cover w-16 h-16"
          />
          <div>
            <p className="font-semibold text-neutral-900">{author.name}</p>
            <p className="text-sm text-neutral-500 mb-2">{author.role}</p>
            <p className="text-sm text-neutral-600 leading-relaxed">{author.bio}</p>
            {author.linkedin && (
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                LinkedIn →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Person schema for E-E-A-T + AI citation */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          description: author.bio,
          image: `https://www.berkahn.com.br${author.image}`,
          worksFor: {
            "@id": "https://www.berkahn.com.br/#organization",
          },
          ...(author.credential && {
            hasCredential: {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: author.credential.category,
              name: author.credential.name,
            },
          }),
          ...(author.alumniOf && {
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: author.alumniOf,
            },
          }),
          ...(author.linkedin && { sameAs: [author.linkedin] }),
        })}
      </script>
    </>
  );
}

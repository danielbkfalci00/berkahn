/**
 * Compressão de imagem no cliente, via Canvas.
 *
 * Extraída de components/admin/orcamentos/HeroUpload.tsx, que era a única
 * cópia. Sem ela, uma foto de celular de 8 MB bate no teto do upload e a
 * pessoa lê "a imagem passa de 5 MB" sem entender por quê.
 *
 * Roda só no navegador (usa `Image`, `canvas` e `URL.createObjectURL`).
 */

/** Sempre JPEG: por isso o nome do arquivo enviado precisa terminar em .jpg. */
export const EXTENSAO_COMPRIMIDA = "jpg";

/**
 * Reduz para no máximo `maxDim` no maior lado e devolve JPEG.
 *
 * ⚠️ Pinta o fundo de branco antes de desenhar. JPEG não tem canal alfa, e um
 * PNG transparente achatado direto sai contra o que o navegador escolher —
 * normalmente preto. Importa porque as capas são geradas por IA, e gerador
 * entrega PNG com frequência: sem isto, capa com área transparente ganha
 * tarja preta.
 */
export async function comprimirImagem(file: File, maxDim = 1920): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Não consegui carregar a imagem"));
      i.src = url;
    });

    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      const ratio = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D não disponível neste navegador");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    if (!blob) throw new Error("Falha ao comprimir a imagem");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Nome do arquivo comprimido, preservando o original mas com a extensão certa.
 *
 * Necessário porque quem recebe deriva a extensão do nome: mandar bytes JPEG
 * num `.png` grava o objeto com extensão errada no bucket.
 */
export function nomeComprimido(nomeOriginal: string): string {
  const base = nomeOriginal.replace(/\.[^.]+$/, "") || "imagem";
  return `${base}.${EXTENSAO_COMPRIMIDA}`;
}

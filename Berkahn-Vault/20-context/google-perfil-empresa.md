---
tipo: context
criado: 2026-10-21
atualizado: 2026-10-21
tags:
  - domain/seo
  - project/site
  - status/active
  - source/manual
ai_summary: "Como criar e verificar o Perfil da Empresa no Google (antigo Google Meu Negócio) da Berkahn, o que preparar, as regras de avaliação do Google e como o site e o admin usam o link de avaliação. O perfil só existe depois de criado no Google pelo dono, e as duas variáveis NEXT_PUBLIC_GOOGLE_REVIEW_URL e NEXT_PUBLIC_GOOGLE_BUSINESS_URL ligam o botão do rodapé, o pedido de avaliação no admin (o dado estruturado do site fica para uma segunda etapa)."
status: active
projeto: site
projetos_relacionados:
  - site
  - seo-aeo
---

# Perfil da Empresa no Google

Antes chamado Google Meu Negócio. É o cartão que aparece no Google e no Maps com nome, telefone, site e avaliações. Ajuda a empresa a aparecer em buscas locais, como "construtora steel frame São Paulo", e as avaliações pesam na decisão de quem pesquisa. Ele não é criado por código: só o dono da empresa cria e verifica, em [business.google.com](https://business.google.com).

## Estado em 2026-10-21

Perfil "Construtora Berkahn" criado na conta contato.berkahn@gmail.com, **ainda não verificado nem público**. Categoria Construtora, área de atendimento São Paulo com endereço oculto, aberto 24 horas, serviços e descrição preenchidos (descrição em linguagem de oferta). O Google ofereceu só carta com código, que exige endereço, e a empresa não tem escritório; a verificação (vídeo ou outra via) e o upload de logo e fotos dos sócios ficam para depois. Arquivos prontos em `Docs/google-perfil-upload/`. Fachada e capa ficam fora: o Google exige local físico, e não há foto própria de obra.

## 1. O que preparar antes de abrir

| Item | Valor da Berkahn | Observação |
|---|---|---|
| Nome | Construtora Berkahn | Igual ao site, ao CNPJ e ao LinkedIn. Não colocar palavra-chave no nome, o Google suspende por isso |
| CNPJ | 39.455.932/0001-64 | Já está no dado estruturado do site |
| Telefone | +55 11 96641-5742 | Mesmo do site |
| Site | https://www.berkahn.com.br | |
| Categoria principal | Construtora (Construction company) | Conferir o nome exato na lista do Google. Adicionar "Empreiteiro geral" e "Engenheiro civil" como secundárias, se aparecerem |
| Tipo de negócio | Decidir: tem escritório que recebe clientes? | Se não recebe, criar como negócio com área de atendimento e ocultar o endereço |
| Endereço | a definir | O site hoje só informa "São Paulo". O endereço usado no Google precisa ser o mesmo em site, LinkedIn e cartão CNPJ |
| Área de atendimento | São Paulo e Grande São Paulo | |
| Horário | a definir | |
| Serviços | Construção em Light Steel Frame residencial, comercial e industrial; projeto; reformas e ampliações | Os mesmos três do dado estruturado do site |
| Descrição | até 750 caracteres | Usar a linguagem de oferta: "construtora especializada em Light Steel Frame", sem citar obras entregues |
| Fotos | logo, capa, fotos da equipe | O Google pede fotos reais do negócio. Render ou foto de obra de terceiros não deve ser apresentada como obra da Berkahn |

## 2. Passo a passo

1. Entrar em business.google.com com a conta Google da empresa (de preferência um e-mail da empresa, não pessoal).
2. Clicar em adicionar perfil, digitar "Construtora Berkahn" e escolher a categoria principal.
3. Informar se há local físico que atende clientes. Se não houver, marcar que atende na região dos clientes e escolher a área.
4. Preencher telefone, site, horário, serviços e descrição.
5. Fazer a verificação. O Google oferece ligação, SMS, e-mail ou vídeo, conforme o caso, e pode pedir uma gravação curta mostrando a atividade da empresa. Para negócio sem loja, o vídeo é o caminho comum.
6. Esperar a aprovação, que costuma levar de poucos dias a duas semanas.
7. Depois de aprovado, abrir o perfil e usar "Pedir avaliações". O Google mostra o link curto, no formato `https://g.page/r/XXXX/review`, igual ao da Cicla que você enviou. Esse é o link de avaliação.
8. Copiar também a URL do perfil no Maps (abrir o perfil e copiar o endereço da página).

## 3. Ligar no site e no admin

Com as duas URLs em mãos, definir nas variáveis de ambiente da Vercel (e no `.env.local` para testar):

```
NEXT_PUBLIC_GOOGLE_REVIEW_URL=https://g.page/r/XXXX/review
NEXT_PUBLIC_GOOGLE_BUSINESS_URL=https://www.google.com/maps/place/...   # reservada para o dado estruturado, ainda sem uso
```

Depois do deploy:

- o rodapé do site ganha o link "Avalie a Berkahn no Google";
- no admin, o lead com status "convertido" ganha o botão "Pedir avaliação", que abre o WhatsApp com a mensagem pronta e registra a nota "Pedido de avaliação no Google enviado" na linha do tempo do lead.

Enquanto as variáveis estiverem vazias, nada disso aparece.

## 4. Regras do Google para avaliações

- Só pedir a quem foi cliente de verdade. Avaliação de sócio, funcionário, amigo ou parceiro que não contratou é considerada falsa e pode derrubar o perfil.
- Não oferecer desconto, brinde ou qualquer vantagem em troca de avaliação.
- Pedir a todos os clientes, e não só aos que ficaram satisfeitos. Escolher quem pode avaliar também é proibido.
- Responder a todas as avaliações, inclusive as negativas, com educação e sem expor dados do cliente.
- Não marcar o site com nota média (`aggregateRating`) enquanto não houver avaliações reais e verificáveis. O site não faz isso.

## 5. Como começar a juntar avaliações

A Berkahn não tem obra executada, então as primeiras avaliações só podem vir de quem contratou algum serviço de verdade, como estudo, projeto ou consultoria, e tiver terminado essa etapa. Pedir logo depois da entrega, enquanto a experiência está fresca, e pelo canal em que o cliente já conversa com a equipe. Duas ou três avaliações verdadeiras valem mais do que uma lista rápida que o Google pode filtrar.

Depois do perfil verificado, vale também publicar fotos reais, responder às perguntas do perfil e postar novidades do blog.

Ver também [[seo-aeo-strategy]] e [[berkahn-brand]].

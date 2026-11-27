# Delícias da Lya — site estático mobile-first

Projeto organizado em HTML semântico, CSS e JavaScript nativos, sem frameworks, npm ou processo de build.

## Estrutura
- `index.html`: conteúdo, SEO e referências externas.
- `css/styles.css`: estilos responsivos mobile-first e componentes.
- `js/main.js`: filtros, galerias, sacola e WhatsApp.
- `images/brand/`: logo.
- `images/campaign/`: fotos de campanha.
- `images/products/`: fotos dos produtos em WebP.
- `icons/`: reservado para favicon/ícones.

## Publicar
1. Faça upload **do conteúdo desta pasta**, preservando as subpastas, para o diretório público do serviço de hospedagem (Netlify, Cloudflare Pages, GitHub Pages, hospedagem estática etc.).
2. Abra o endereço HTTPS e verifique imagens, filtros, galeria, sacola e WhatsApp.
3. Confirme no `js/main.js` o número de WhatsApp e no HTML todos os textos, preços, prazo de encomendas e condições de pagamento.
4. Ao definir o domínio, inclua `<link rel="canonical" href="https://SEU-DOMINIO/">` em `<head>` e as propriedades absolutas `og:url` e `og:image`. Crie `sitemap.xml` com a URL real e envie ao Google Search Console.
5. Configure cabeçalhos de segurança no serviço de hospedagem (CSP, X-Content-Type-Options, Referrer-Policy e HSTS). Para CSP, use `script-src 'self'` e `object-src 'none'`, ajustando ao ambiente. *Não* use um CSP rígido sem validar o resultado da publicação.
6. Se incluir novas fotos, exporte em WebP e mantenha texto alternativo descritivo, tamanho real e `width`/`height`. Evite imagens base64.

## SEO e desempenho
- Título, descrição, idioma pt-BR, viewport e Open Graph básicos.
- Imagens externas WebP comprimidas sem esticar; `width`/`height` para evitar mudanças de layout.
- Foto principal carregada com prioridade; outras imagens com `loading=lazy`.
- HTML rastreável, âncoras e cabeçalhos; conteúdo de produtos entregue direto no HTML.
- Layout fluido para celulares, tablets e desktops e suporte a movimento reduzido.

## Notas importantes
- A sacola é **apenas um orçamento no navegador**: preço, quantidade e texto podem ser alterados pelo cliente; **sempre confira pedido, preço e disponibilidade no WhatsApp**. Não processa pagamentos nem envia dados para servidor.
- Os produtos e textos foram preservados da versão original. Prazo promocional deve ser revisado depois do Natal de 2026.
- O site não armazena pedidos: fechar/recarregar a página reinicia a sacola.
- Se desejar converter em e-commerce com pagamentos, estoque ou autenticação, será necessário um backend seguro.

## Deploy Vercel
- Framework Preset: **Other**; Root Directory: pasta com `index.html`; Build Command: vazio; Output Directory: vazio (padrão).
- Pela CLI, execute `npx vercel` na pasta raiz e `npx vercel --prod` depois de conferir o preview.
- Pelo GitHub, envie o conteúdo desta pasta para a raiz do repositório e use Import Project na Vercel.
- O `vercel.json` configura cabeçalhos de segurança e cache de imagens.

## Atualização das fotos e prazo
- Prazo dos pedidos: **18/12/2026**.
- Fotos reais fornecidas pela confeitaria convertidas em WebP (limite 900 × 1125 px), sem cortes ou distorções nos arquivos.
- Galerias de produtos separadas por tipo, com no máximo três miniaturas.
- Imagem da Nutella continua sendo ilustrativa, identificada no site.
- Para publicar, substitua os arquivos no repositório GitHub, faça commit e push da branch de produção.

## Ajuste de contato (26/11/2026)
- WhatsApp fixado na margem direita, com faixa livre no desktop para não cobrir cards.
- Instagram no rodapé apresentado como ícone SVG local e @delicias_dalya.

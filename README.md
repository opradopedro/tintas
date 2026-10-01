# Tintas RC — Ateliê da Cor

Site estático (HTML + CSS + JS puro, sem build). Basta abrir `index.html` ou publicar a pasta em qualquer hospedagem (Netlify, Vercel, GitHub Pages, HostGator…).

## Estrutura
- `index.html`: conteúdo e seções
- `assets/css/style.css`: identidade visual (cores da marca em `:root`)
- `assets/js/main.js`: tinta fluida, rastro do cursor, laboratório de cor, pinturas generativas
- `assets/img/`: logo (`logo.png`, `logo-light.png`, `logo-badge.png`, `favicon.png`)

## Ajustes rápidos
- **WhatsApp**: em `assets/js/main.js`, preencha `CONFIG.whatsapp` (ex.: `"5511999999999"`).
- **Fotos reais no Ateliê**: salve em `assets/img/galeria/` e preencha `data-photo` em cada `<figure class="frame">` do `index.html`. Sem foto, o quadro mostra uma pintura generativa.
- **Cores do simulador**: objeto `MOODS` em `assets/js/main.js`.

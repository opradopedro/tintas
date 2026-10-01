# Tintas RC — Ateliê da Cor

Site estático (HTML + CSS + JS puro, sem build). Basta abrir `index.html` ou publicar a pasta em qualquer hospedagem (Netlify, Vercel, GitHub Pages, HostGator…).

## Estrutura
- `index.html`: conteúdo e seções
- `assets/css/style.css`: identidade visual (cores da marca em `:root`)
- `assets/js/main.js`: tinta fluida, rastro do cursor, laboratório de cor, pinturas generativas
- `assets/img/`: logo (`logo.png`, `logo-light.png`, `logo-badge.png`, `favicon.png`)

## Ajustes rápidos
- **WhatsApp**: número em `CONFIG.whatsapp` (`assets/js/main.js`). Todo link com a classe `js-whats` abre o WhatsApp com a mensagem do `data-msg`.
- **Fotos da loja**: ficam em `assets/img/loja/`. Para trocar, substitua o arquivo ou mude o `data-photo` da `<figure class="frame">` no `index.html`. Sem foto, o quadro mostra uma pintura generativa.
- **Cores do simulador**: objeto `MOODS` em `assets/js/main.js`.

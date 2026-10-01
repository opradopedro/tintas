# Tintas RC — Ateliê da Cor

Site estático (HTML + CSS + JS puro, sem build). Basta abrir `index.html` ou publicar a pasta em qualquer hospedagem (Netlify, Vercel, GitHub Pages, HostGator…).

## Estrutura
- `index.html`: conteúdo e seções
- `assets/css/style.css`: identidade visual (cores da marca em `:root`)
- `assets/js/main.js`: rolos entre as seções, transição do menu, leque de cores, parallax, rastro do cursor e laboratório de cor
- `assets/img/`: logo e fotos da loja (`assets/img/loja/`)
- `assets/fonts/`: fontes hospedadas no próprio site (Bricolage Grotesque e Caveat Brush, licença OFL)

## Ilustrações
Rolo, lata, pincel e respingo ficam como `<symbol>` no topo do `index.html` e são reutilizados com `<use href="#i-roller"/>`.
A cor da tinta muda com a variável `--paint` (e o rótulo da lata com `--label`).

## Transição entre seções
Cada `<div class="roll" style="--from:…;--to:…">` é uma faixa onde o rolo passa pintando da cor da seção anterior (`--from`) para a próxima (`--to`).
Ao trocar a cor de fundo de uma seção, ajuste também as faixas vizinhas.

## Ajustes rápidos
- **WhatsApp**: número em `CONFIG.whatsapp` (`assets/js/main.js`). Todo link com a classe `js-whats` abre o WhatsApp com a mensagem do `data-msg`.
- **Fotos da loja**: ficam em `assets/img/loja/`. Para trocar, substitua o arquivo ou mude o `data-photo` da `<figure class="frame">` no `index.html`. Sem foto, o quadro mostra uma pintura generativa.
- **Cores do simulador**: objeto `MOODS` em `assets/js/main.js`. Cores do leque: `FAN`.

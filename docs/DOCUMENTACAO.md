# Documentação Técnica do Sistema — ForestFlow

*Aplicação web para inventário florestal digital — estatísticas descritivas (GetStats) e estimativa de volume de madeira (QuickVol)*

Documentação de arquitetura e estrutura de código — material de apoio ao Trabalho de Conclusão de Curso.

---

## 1. Introdução

O ForestFlow é uma aplicação web voltada para engenheiros florestais e técnicos que precisam transformar medições de campo (diâmetro à altura do peito, altura total e, opcionalmente, volume) em informações prontas para decisão. O sistema é composto por duas ferramentas principais:

- **GetStats** — recebe uma planilha com as colunas `dap`, `altura` e/ou `vol` e devolve estatísticas descritivas (média, mediana, mínimo, máximo, amplitude, desvio-padrão e coeficiente de variação) de cada variável, no total ou por agregador (talhão/parcela).
- **QuickVol** — recebe `dap` e `altura` de cada árvore, aplica uma equação volumétrica regional (Norte, Nordeste, Centro-Oeste, Sudeste ou Sul) e devolve o volume médio de madeira, no total ou por agregador, com opção de baixar o resultado completo em planilha.

O front-end foi construído em React (Vite), sem back-end: toda a leitura de arquivos (`.xlsx`, `.xls` e `.csv`), os cálculos estatísticos e volumétricos, e a geração dos arquivos de saída acontecem inteiramente no navegador do usuário, usando a biblioteca SheetJS (`xlsx`) para leitura/escrita de planilhas.

---

## 2. Estrutura de Diretórios

A árvore abaixo reflete o estado atual do código-fonte, dentro da pasta `src/` do projeto Vite:

```
src/
├── App.jsx
├── ForestFlow.jsx
├── ForestFlow.css
│
├── components/
│   ├── Nav.jsx
│   ├── Hero.jsx
│   ├── Products.jsx
│   ├── ProductCard.jsx
│   ├── Modal.jsx
│   ├── ErrorModal.jsx
│   ├── HelpModal.jsx
│   ├── ProductPage.jsx
│   ├── StatsResults.jsx
│   ├── VolumeResult.jsx
│   ├── RegionDropdown.jsx
│   ├── ScopeDropdown.jsx
│   ├── Footer.jsx
│   ├── Stat.jsx                      (não utilizado)
│   │
│   └── icons/
│       ├── ForestFlowLogo.jsx
│       ├── TreeIllustration.jsx      (não utilizado)
│       ├── LogsIllustration.jsx      (não utilizado)
│       ├── WoodBoxIllustration.jsx   (não utilizado)
│       └── UploadArrowIllustration.jsx (não utilizado)
│
├── hooks/
│   ├── useInView.js
│   └── useCountUp.js                 (não utilizado)
│
└── utils/
    ├── statistics.js
    ├── toNumber.js
    ├── readWorkbookFromFile.js
    ├── parseGetStatsFile.js
    ├── parseQuickVolFile.js
    ├── aggregateStats.js
    ├── aggregateVolume.js
    ├── volumeEquations.js
    ├── downloadTemplateXlsx.js
    ├── downloadVolumeResultsXlsx.js
    ├── parseSpreadsheet.js           (não utilizado)
    └── parseSpreadsheetRows.js       (não utilizado)
```

A raiz do projeto Vite (fora de `src/`) segue a estrutura padrão gerada por `npm create vite@latest` — `node_modules/`, `index.html`, `package.json`, `vite.config.js` — e não é detalhada aqui por não conter lógica própria do ForestFlow.

---

## 3. Arquitetura e Relação entre os Arquivos

### 3.1 Camadas do sistema

O código está organizado em quatro camadas, cada uma com uma responsabilidade única, o que facilita localizar onde uma mudança precisa ser feita:

- **`components/`** — tudo que é interface visual (React). Cada arquivo é um componente de UI: navegação, seções da página inicial, modais, dropdowns e a página de produto.
- **`components/icons/`** — ícones e ilustrações de marca, isolados como componentes SVG próprios, separados dos ícones genéricos de interface (que vêm da biblioteca `lucide-react`).
- **`hooks/`** — lógica de estado reutilizável entre componentes (ex.: detectar quando um elemento entra na tela).
- **`utils/`** — lógica pura, sem React: leitura de planilhas, conversão de números, cálculo estatístico, cálculo de volume e geração de arquivos para download. Esta camada não sabe nada sobre a interface — poderia ser testada isoladamente ou reaproveitada em outro projeto.

### 3.2 Fluxo de montagem da aplicação

`App.jsx` (gerado pelo Vite) renderiza `<ForestFlow />`. O componente `ForestFlow.jsx` é a raiz de toda a aplicação: ele guarda o estado de qual "página" está visível — `"home"` (padrão), `"getstats"` ou `"quickvol"` — e decide o que renderizar com base nisso. Essa troca de página é feita inteiramente no cliente, via `useState`, sem biblioteca de rotas (react-router) e sem recarregar o navegador.

Quando a página é `"home"`, `ForestFlow.jsx` monta `Nav`, `Hero`, `Products` e `Footer`. Quando é `"getstats"` ou `"quickvol"`, ele renderiza `ProductPage` passando o título do produto — é `ProductPage.jsx` quem concentra toda a lógica de upload, leitura de arquivo, cálculo e exibição de resultado para as duas ferramentas.

### 3.3 Fluxo de dados — GetStats

1. O usuário clica em **"Enviar dados"** em `ProductPage.jsx`, que aciona um `<input type="file">` oculto.
2. `handleFileChange` valida a extensão do arquivo e chama `parseGetStatsFile` (`utils/`), que usa `readWorkbookFromFile` para ler `.xlsx`/`.xls`/`.csv` e `toNumber` para tratar vírgula decimal.
3. O resultado — um array de linhas `{ id, agregador, dap, altura, vol }` — é passado para `computeStatsByScope` (`utils/aggregateStats.js`), que por sua vez usa `computeColumnStats` (`utils/statistics.js`) para calcular as 8 métricas de cada variável, tanto no total quanto por agregador.
4. O resultado é guardado em estado (`statsScopeResults`) e renderizado por `StatsResults.jsx`, uma tabela por variável presente no arquivo.
5. Se houver coluna `agregador`, `ScopeDropdown.jsx` aparece, permitindo trocar entre o total e cada grupo sem reler o arquivo.

### 3.4 Fluxo de dados — QuickVol

1. Mesmo gatilho de upload, mas o parser usado é `parseQuickVolFile`, que exige `dap` e `altura` válidos em cada linha (linhas incompletas são descartadas) e preserva `agregador` se presente.
2. Após a leitura, `RegionDropdown.jsx` é exibido para o usuário escolher a região do Brasil — a escolha é necessária porque cada região tem uma equação volumétrica própria, definida em `utils/volumeEquations.js` (equação de Schumacher e Hall, com coeficientes β0, β1 e β2 distintos por região).
3. `calculateVolume` é aplicada árvore a árvore, e `computeVolumeByScope` (`utils/aggregateVolume.js`) calcula a média total e a média por agregador.
4. O resultado é exibido por `VolumeResult.jsx`, junto com a fórmula e os coeficientes usados. `ScopeDropdown.jsx` reaparece aqui, com o mesmo componente usado no GetStats.
5. `downloadVolumeResultsXlsx` (`utils/`) permite baixar uma planilha com o volume calculado de cada árvore individualmente, nas colunas `id`, `agregador` (se houver), `dap`, `altura` e `volume`.

### 3.5 Componentes compartilhados entre as duas ferramentas

Por trocarem apenas o parser e o cálculo, GetStats e QuickVol compartilham a mesma casca visual: o mesmo `Nav.jsx`, o mesmo `ScopeDropdown.jsx` (seletor Total/agregador), o mesmo `ErrorModal.jsx` e o mesmo `HelpModal.jsx` — este último muda apenas o texto interno de acordo com a prop `title` recebida em `ProductPage`.

---

## 4. Tabela-Resumo de Todos os Arquivos

| Arquivo | Categoria | Responsabilidade resumida |
|---|---|---|
| `App.jsx` | Entrada | Gerado pelo Vite; monta `<ForestFlow />` na página. |
| `ForestFlow.jsx` | Raiz da aplicação | Guarda a página ativa (home/getstats/quickvol) e monta os componentes correspondentes. |
| `ForestFlow.css` | Estilo global | Único arquivo CSS do projeto: variáveis de cor, tipografia, layout e responsividade. |
| `components/Nav.jsx` | UI | Barra de navegação, com dropdown "Produtos" (GetStats/QuickVol). |
| `components/Hero.jsx` | UI | Seção inicial da home, com a árvore animada e os botões de atalho. |
| `components/Products.jsx` | UI | Seção "Produtos" da home; monta os dois `ProductCard`. |
| `components/ProductCard.jsx` | UI | Card de produto na home; abre o `Modal` "Saiba Mais". |
| `components/Modal.jsx` | UI | Modal grande ("Saiba Mais") com botão "Ir para o produto". |
| `components/ErrorModal.jsx` | UI | Modal de erro (formato inválido, colunas ausentes etc.). |
| `components/HelpModal.jsx` | UI | Modal de ajuda, com passo a passo específico por produto. |
| `components/ProductPage.jsx` | UI + orquestração | Página do GetStats/QuickVol: upload, leitura, cálculo e resultado. |
| `components/StatsResults.jsx` | UI | Renderiza as tabelas de estatísticas do GetStats. |
| `components/VolumeResult.jsx` | UI | Renderiza o resultado de volume do QuickVol. |
| `components/RegionDropdown.jsx` | UI | Seletor de região (QuickVol), aparece uma vez após o upload. |
| `components/ScopeDropdown.jsx` | UI | Seletor Total/agregador, reaproveitado por GetStats e QuickVol. |
| `components/Footer.jsx` | UI | Rodapé da home. |
| `components/Stat.jsx` | UI (não usado) | Contador animado; ficou órfão após a remoção da seção "Sobre". |
| `components/icons/ForestFlowLogo.jsx` | Ícone de marca | Logo da árvore usado no Nav. |
| `components/icons/TreeIllustration.jsx` | Ícone (não usado) | Versão isolada da árvore animada da Hero; `Hero.jsx` ainda usa o SVG inline. |
| `components/icons/LogsIllustration.jsx` | Ícone (não usado) | Toras de madeira; removida do resultado do QuickVol a pedido do usuário. |
| `components/icons/WoodBoxIllustration.jsx` | Ícone (não usado) | Caixa aberta; removida da ProductPage a pedido do usuário. |
| `components/icons/UploadArrowIllustration.jsx` | Ícone (não usado) | Seta de upload; removida junto com a caixa. |
| `hooks/useInView.js` | Hook | Detecta quando um elemento entra na viewport (IntersectionObserver). |
| `hooks/useCountUp.js` | Hook (não usado) | Anima a contagem de um número; usado só por `Stat.jsx`, também órfão. |
| `utils/statistics.js` | Lógica pura | Funções estatísticas: média, mediana, min, max, amplitude, desvio-padrão, CV. |
| `utils/toNumber.js` | Lógica pura | Converte texto em número, aceitando vírgula decimal. |
| `utils/readWorkbookFromFile.js` | Lógica pura | Lê `.xlsx`/`.xls`/`.csv` e detecta o separador do CSV. |
| `utils/parseGetStatsFile.js` | Lógica pura | Extrai linhas (dap/altura/vol/agregador) do arquivo do GetStats. |
| `utils/parseQuickVolFile.js` | Lógica pura | Extrai linhas (dap/altura/agregador) do arquivo do QuickVol. |
| `utils/aggregateStats.js` | Lógica pura | Calcula estatísticas por escopo (total/agregador) para o GetStats. |
| `utils/aggregateVolume.js` | Lógica pura | Calcula volume médio por escopo (total/agregador) para o QuickVol. |
| `utils/volumeEquations.js` | Lógica pura | As 5 equações volumétricas regionais e a função de cálculo. |
| `utils/downloadTemplateXlsx.js` | Lógica pura | Gera o arquivo modelo (.xlsx) para download. |
| `utils/downloadVolumeResultsXlsx.js` | Lógica pura | Gera o arquivo de resultado completo do QuickVol. |
| `utils/parseSpreadsheet.js` | Lógica pura (não usado) | Versão anterior do parser do GetStats; substituída por `parseGetStatsFile`. |
| `utils/parseSpreadsheetRows.js` | Lógica pura (não usado) | Versão anterior do parser do QuickVol; substituída por `parseQuickVolFile`. |

---

## 5. Documentação Detalhada dos Arquivos

### 5.1 Raiz (`src/`)

#### `src/App.jsx`
- **Responsabilidade:** Ponto de entrada da aplicação, gerado automaticamente pelo template do Vite. Sua única responsabilidade é renderizar o componente raiz.
- **Exports:** `export default function App()`
- **Depende de:** `ForestFlow.jsx`
- **Utilizado por:** `main.jsx` (arquivo padrão do Vite, não listado por não pertencer ao código do ForestFlow)

#### `src/ForestFlow.jsx`
- **Responsabilidade:** Componente raiz de toda a aplicação. Mantém em estado (`useState`) qual "página" está ativa — `home`, `getstats` ou `quickvol` — e decide, com base nisso, se renderiza a página inicial completa (Nav + Hero + Products + Footer) ou a `ProductPage` do produto escolhido. Centraliza também as funções `goToProduct` (navega para uma ProductPage) e `goHome` (volta para a home), repassadas como props para os componentes filhos que precisam disparar navegação (Nav, ProductPage, e indiretamente ProductCard via Products).
- **Exports:** `export default function ForestFlow()`
- **Depende de:** `components/Nav.jsx`, `components/Hero.jsx`, `components/Products.jsx`, `components/Footer.jsx`, `components/ProductPage.jsx`, `ForestFlow.css`
- **Utilizado por:** `App.jsx`

#### `src/ForestFlow.css`
- **Responsabilidade:** Folha de estilos única do projeto. Define as variáveis de cor (paleta verde-floresta), tipografia (Fraunces, Inter, IBM Plex Mono via Google Fonts), o layout de cada seção/componente (prefixo de classe `ff-`), as animações (entrada da hero, desenho da árvore, abertura de dropdowns e modais) e toda a responsividade (media queries em 720px e 480px). Também contém o reset global de `box-sizing: border-box`, necessário para os modais e dropdowns não estourarem a largura da tela.
- **Depende de:** nenhum arquivo interno
- **Utilizado por:** `ForestFlow.jsx` (único ponto de import do CSS no projeto)
- *Por ser um único arquivo CSS global (sem CSS Modules), todas as classes usam o prefixo `ff-` para evitar colisão de nomes.*

### 5.2 `components/`

#### `src/components/Nav.jsx`
- **Responsabilidade:** Barra de navegação fixa no topo. Mostra o logo/wordmark, os links Início e Sobre (que rolam a página até a seção correspondente quando estão na home, ou voltam para a home quando estão numa ProductPage) e um dropdown "Produtos" com atalhos diretos para GetStats e QuickVol. Também controla o menu hambúrguer em telas pequenas.
- **Props:** `navOpen, setNavOpen, active, scrollTo, topRef, produtosRef, onNavigate, onHome`
- **Depende de:** `lucide-react` (Menu, ChevronDown), `components/icons/ForestFlowLogo.jsx`
- **Utilizado por:** `ForestFlow.jsx`, `components/ProductPage.jsx`

#### `src/components/Hero.jsx`
- **Responsabilidade:** Primeira seção visível da home: título "ForestFlow", subtítulo, os dois botões de atalho (GetStats/QuickVol, que rolam até a seção de produtos) e a árvore SVG animada (efeito de "desenhar" a árvore ao carregar a página).
- **Props:** `topRef, scrollTo, produtosRef`
- **Depende de:** nenhum arquivo interno
- **Utilizado por:** `ForestFlow.jsx`
- *O SVG da árvore está inline neste arquivo — existe uma versão equivalente isolada em `components/icons/TreeIllustration.jsx` que não chegou a ser adotada aqui (ver seção 7).*

#### `src/components/Products.jsx`
- **Responsabilidade:** Seção "Produtos" da home. Define os textos e ícones de cada card (título, descrição curta do card, descrição mais longa do modal) e monta os dois `ProductCard`, repassando a função `onNavigate` que leva à respectiva ProductPage.
- **Props:** `produtosRef, onNavigate`
- **Depende de:** `components/ProductCard.jsx`
- **Utilizado por:** `ForestFlow.jsx`

#### `src/components/ProductCard.jsx`
- **Responsabilidade:** Card individual de produto na home (fundo verde-escuro). Controla a abertura/fechamento do Modal "Saiba Mais" em estado local.
- **Props:** `icon, title, desc, modalTitle, modalDesc, onNavigate`
- **Depende de:** `hooks/useInView.js`, `components/Modal.jsx`
- **Utilizado por:** `components/Products.jsx`

#### `src/components/Modal.jsx`
- **Responsabilidade:** Modal grande exibido ao clicar em "Saiba Mais" num card. Usa a variante de estilo `ff-modal--product` (largura de até 900px, equivalente à largura combinada dos dois cards). Contém o botão "Ir para o produto", que fecha o modal e dispara a navegação para a ProductPage correspondente.
- **Props:** `isOpen, onClose, title, children, onNavigate, linkLabel`
- **Depende de:** nenhum arquivo interno
- **Utilizado por:** `components/ProductCard.jsx`

#### `src/components/ErrorModal.jsx`
- **Responsabilidade:** Modal de erro, reutilizado nos três casos de validação da ProductPage: formato de arquivo inválido, colunas obrigatórias ausentes no QuickVol, e nenhuma coluna reconhecida no GetStats.
- **Props:** `isOpen, onClose, title` (padrão: "Não foi possível continuar"), `message`
- **Depende de:** nenhum arquivo interno
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/components/HelpModal.jsx`
- **Responsabilidade:** Modal de ajuda acionado pelo botão flutuante (?) na ProductPage. O conteúdo (passado via `children`) muda conforme o produto: passo a passo do GetStats ou do QuickVol, decidido em `ProductPage.jsx` com base na prop `title`.
- **Props:** `isOpen, onClose, title, children`
- **Depende de:** nenhum arquivo interno
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/components/StatsResults.jsx`
- **Responsabilidade:** Recebe o objeto de estatísticas já calculado (uma chave por variável: dap, altura, vol) e renderiza uma tabela por variável, lado a lado, com as 8 métricas calculadas em `utils/statistics.js`.
- **Props:** `stats` (objeto `{ [coluna]: { n, mean, median, min, max, amplitude, stdDev, cv } }`)
- **Depende de:** nenhum arquivo interno
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/components/VolumeResult.jsx`
- **Responsabilidade:** Exibe o resultado do QuickVol: o volume médio (m³/ha) do escopo selecionado, seguido da legenda explicando a equação de Schumacher e Hall e os coeficientes (β0, β1, β2) da região escolhida.
- **Props:** `value` (número), `regionKey` (chave da região em `VOLUME_EQUATIONS`)
- **Depende de:** `utils/volumeEquations.js`
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/components/RegionDropdown.jsx`
- **Responsabilidade:** Dropdown exibido uma única vez, logo após o upload do arquivo no QuickVol, para o usuário escolher a região do Brasil. Fecha ao clicar fora ou pressionar Esc.
- **Props:** `onSelect(regionKey), onClose`
- **Depende de:** `utils/volumeEquations.js`
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/components/ScopeDropdown.jsx`
- **Responsabilidade:** Dropdown "Selecione o agregador", reaproveitado pelo GetStats e pelo QuickVol. Lista "Total" mais cada valor único encontrado na coluna `agregador` do arquivo; ao trocar a seleção, o componente pai troca qual recorte do resultado é exibido, sem reprocessar o arquivo.
- **Props:** `aggregatorKeys` (array de strings), `selected, onSelect`
- **Depende de:** nenhum arquivo interno
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/components/Footer.jsx`
- **Responsabilidade:** Rodapé simples da home, com o nome do produto e o slogan.
- **Depende de:** nenhum arquivo interno
- **Utilizado por:** `ForestFlow.jsx`

#### `src/components/Stat.jsx` ⚠ *não utilizado*
- **Responsabilidade:** Componente de estatística com contador animado (número sobe até o valor-alvo quando entra na tela), originalmente usado na seção "Sobre" da home.
- **Props:** `label, target`
- **Depende de:** `hooks/useCountUp.js`, `hooks/useInView.js`
- **Utilizado por:** nenhum (não utilizado)
- *A seção "Sobre" foi removida da home ao longo do desenvolvimento; este componente e o hook `useCountUp.js` ficaram sem nenhum ponto de uso.*

### 5.3 `components/icons/`

Pasta criada para separar ícones e ilustrações de marca (desenhos próprios do ForestFlow) dos ícones genéricos de interface, que passaram a vir da biblioteca `lucide-react` (usada atualmente em `Nav.jsx` — Menu, ChevronDown — e `ProductPage.jsx` — HelpCircle).

#### `src/components/icons/ForestFlowLogo.jsx`
- **Responsabilidade:** Logo da árvore estilizada usada ao lado do nome "ForestFlow" na barra de navegação.
- **Props:** `className, size` (padrão 24)
- **Utilizado por:** `components/Nav.jsx`

#### `src/components/icons/TreeIllustration.jsx` ⚠ *não utilizado*
- **Responsabilidade:** Versão isolada, em componente próprio, da árvore animada usada na Hero. Mantém as classes `ff-tree` e `trunk` exigidas pela animação definida em `ForestFlow.css`.
- **Props:** `className`
- **Utilizado por:** nenhum
- *`components/Hero.jsx` continua com o SVG equivalente escrito inline; este componente foi criado durante a reorganização de ícones mas a substituição em Hero.jsx não chegou a ser aplicada.*

#### `src/components/icons/LogsIllustration.jsx` ⚠ *não utilizado*
- **Responsabilidade:** Ilustração de toras de madeira empilhadas, originalmente exibida junto ao resultado do QuickVol.
- **Props:** `className, width` (padrão 110)
- **Utilizado por:** nenhum
- *Removida de `VolumeResult.jsx` a pedido do usuário ("tirar o svg" do resultado).*

#### `src/components/icons/WoodBoxIllustration.jsx` ⚠ *não utilizado*
- **Responsabilidade:** Ilustração de uma caixa de madeira aberta, originalmente exibida na coluna de botões da ProductPage.
- **Props:** `className, width` (padrão 150)
- **Utilizado por:** nenhum
- *Removida de `ProductPage.jsx` a pedido do usuário ("pode tirar o icone, vai ficar sem imagem").*

#### `src/components/icons/UploadArrowIllustration.jsx` ⚠ *não utilizado*
- **Responsabilidade:** Ilustração de seta de upload com pontos, exibida junto à caixa de madeira na ProductPage.
- **Props:** `className, width` (padrão 90)
- **Utilizado por:** nenhum
- *Removida junto com `WoodBoxIllustration.jsx`.*

### 5.4 `hooks/`

#### `src/hooks/useInView.js`
- **Responsabilidade:** Hook que retorna uma ref e um booleano indicando se o elemento associado já entrou na viewport, usando `IntersectionObserver`. Usado para acionar animações de entrada (fade + translateY) quando o usuário rola a página até o elemento.
- **Exports:** `export function useInView(threshold = 0.2)`
- **Utilizado por:** `components/ProductCard.jsx`, `components/Stat.jsx` (órfão)

#### `src/hooks/useCountUp.js` ⚠ *não utilizado*
- **Responsabilidade:** Hook que anima a contagem de um número de 0 até um valor-alvo, usando `requestAnimationFrame`, disparado quando o parâmetro `active` se torna verdadeiro.
- **Exports:** `export function useCountUp(target, active)`
- **Utilizado por:** nenhum
- *Único consumidor era `components/Stat.jsx`, também órfão.*

### 5.5 `utils/`

Camada de lógica pura (sem JSX, sem hooks de React), responsável por ler arquivos, tratar números, calcular estatísticas/volume e gerar arquivos de download. Cada função é testável isoladamente.

#### `src/utils/statistics.js`
- **Responsabilidade:** Funções estatísticas de baixo nível, usadas para compor o resultado do GetStats: `mean`, `median`, `min`, `max`, `amplitude`, `standardDeviation` (amostral, divisor n-1) e `coefficientOfVariation`. `computeColumnStats` agrupa todas em um único objeto por variável.
- **Exports:** `mean, median, min, max, amplitude, standardDeviation, coefficientOfVariation, computeColumnStats`
- **Utilizado por:** `utils/aggregateStats.js`, `utils/aggregateVolume.js` (apenas `mean`)

#### `src/utils/toNumber.js`
- **Responsabilidade:** Converte um valor lido da planilha/CSV em número, aceitando tanto ponto quanto vírgula como separador decimal (comum em arquivos exportados por versões em português do Excel). Retorna `null` quando a conversão não é possível.
- **Exports:** `export function toNumber(value)`
- **Utilizado por:** `utils/parseGetStatsFile.js`, `utils/parseQuickVolFile.js`

#### `src/utils/readWorkbookFromFile.js`
- **Responsabilidade:** Ponto único de leitura de arquivos no projeto. Detecta a extensão (`.csv` vs `.xlsx`/`.xls`) e escolhe a estratégia de leitura adequada: para CSV, lê como texto e detecta automaticamente se o separador de coluna é vírgula ou ponto-e-vírgula (o Excel em português usa ponto-e-vírgula quando os decimais usam vírgula); para xlsx/xls, lê como binário.
- **Exports:** `export async function readWorkbookFromFile(file)`
- **Depende de:** `xlsx` (biblioteca externa)
- **Utilizado por:** `utils/parseGetStatsFile.js`, `utils/parseQuickVolFile.js`

#### `src/utils/parseGetStatsFile.js`
- **Responsabilidade:** Lê o arquivo enviado no GetStats e devolve um array de linhas `{ id, agregador, dap, altura, vol }`, além de um booleano `hasAgregador` indicando se a coluna `agregador` está presente no arquivo.
- **Exports:** `export async function parseGetStatsFile(file)`
- **Depende de:** `utils/readWorkbookFromFile.js`, `utils/toNumber.js`, `xlsx`
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/utils/parseQuickVolFile.js`
- **Responsabilidade:** Lê o arquivo enviado no QuickVol. Diferente do parser do GetStats, descarta linhas em que `dap` ou `altura` não sejam números válidos, pois o cálculo de volume exige as duas colunas por árvore.
- **Exports:** `export async function parseQuickVolFile(file)`
- **Depende de:** `utils/readWorkbookFromFile.js`, `utils/toNumber.js`, `xlsx`
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/utils/aggregateStats.js`
- **Responsabilidade:** Recebe as linhas já parseadas do GetStats e calcula, via `computeColumnStats`, as estatísticas de cada variável (dap, altura, vol) tanto para o total quanto agrupadas por agregador.
- **Exports:** `export function computeStatsByScope(rows, hasAgregador)`
- **Depende de:** `utils/statistics.js`
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/utils/aggregateVolume.js`
- **Responsabilidade:** Recebe as linhas do QuickVol já com o volume calculado por árvore e retorna a média total e a média por agregador.
- **Exports:** `export function computeVolumeByScope(rows, hasAgregador)`
- **Depende de:** `utils/statistics.js` (apenas `mean`)
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/utils/volumeEquations.js`
- **Responsabilidade:** Define as 5 equações volumétricas regionais (Norte, Nordeste, Centro-Oeste, Sudeste e Sul), no formato `Volume = coef × dap^dapExp × h^hExp` (equação de Schumacher e Hall), e as funções que aplicam a equação a uma árvore ou a um conjunto de árvores.
- **Exports:** `VOLUME_EQUATIONS` (objeto), `calculateVolume(dap, h, regionKey)`, `calculateVolumes(dapValues, hValues, regionKey)`
- **Utilizado por:** `components/RegionDropdown.jsx`, `components/VolumeResult.jsx`, `components/ProductPage.jsx`

#### `src/utils/downloadTemplateXlsx.js`
- **Responsabilidade:** Gera e dispara o download do arquivo modelo (.xlsx) com as colunas `id, agregador, dap, altura` — usado tanto pelo GetStats quanto pelo QuickVol. O nome do arquivo baixado é montado a partir do nome do produto (`modelo_getstats.xlsx` ou `modelo_quickvol.xlsx`).
- **Exports:** `export function downloadTemplateXlsx(productName)`
- **Depende de:** `xlsx`
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/utils/downloadVolumeResultsXlsx.js`
- **Responsabilidade:** Gera e dispara o download da planilha de resultado completo do QuickVol, com o volume calculado de cada árvore individualmente (colunas `id, agregador` se houver, `dap, altura, volume`).
- **Exports:** `export function downloadVolumeResultsXlsx(rows, hasAgregador, filename)`
- **Depende de:** `xlsx`
- **Utilizado por:** `components/ProductPage.jsx`

#### `src/utils/parseSpreadsheet.js` ⚠ *não utilizado*
- **Responsabilidade:** Primeira versão do parser do GetStats: lia cada coluna de forma independente (sem manter o vínculo entre colunas de uma mesma linha).
- **Exports:** `export async function parseSpreadsheetColumns(file, columns)`
- **Depende de:** `utils/readWorkbookFromFile.js`, `xlsx`
- **Utilizado por:** nenhum
- *Substituído por `parseGetStatsFile.js` quando o recurso de agregador foi adicionado ao GetStats, pois agrupar por agregador exige preservar o vínculo entre as colunas de cada linha.*

#### `src/utils/parseSpreadsheetRows.js` ⚠ *não utilizado*
- **Responsabilidade:** Primeira versão do parser do QuickVol, com leitura alinhada por linha (dap + ht), mas sem suporte a agregador, sem `toNumber` (vírgula decimal) e sem detecção de CSV.
- **Exports:** `export async function parseSpreadsheetRows(file, requiredColumns)`
- **Depende de:** `xlsx`
- **Utilizado por:** nenhum
- *Substituído por `parseQuickVolFile.js`.*

---

## 6. Bibliotecas Externas

| Biblioteca | Categoria | Papel no projeto |
|---|---|---|
| `react` / `react-dom` | Framework | Base da interface, componentes funcionais com hooks (useState, useEffect, useRef). |
| `vite` / `@vitejs/plugin-react` | Build tool | Servidor de desenvolvimento e empacotamento do projeto. |
| `xlsx` (SheetJS) | Leitura/escrita de planilhas | Lê `.xlsx`/`.xls`/`.csv` enviados pelo usuário e gera os arquivos `.xlsx` de modelo e de resultado, inteiramente no navegador. |
| `lucide-react` | Ícones | Ícones genéricos de interface (menu hambúrguer, seta de dropdown, botão de ajuda) — substituíram SVGs escritos manualmente. |

**Observação de segurança:** a versão do pacote `xlsx` publicada no npm possui uma vulnerabilidade conhecida (Prototype Pollution / ReDoS), explorável apenas na leitura de arquivos maliciosos. Como o ForestFlow usa a biblioteca tanto para ler arquivos enviados pelo próprio usuário quanto para gerar arquivos, o risco prático é baixo; ainda assim, para produção recomenda-se apontar a dependência para a versão corrigida distribuída pelo CDN oficial do SheetJS, via campo `overrides` no `package.json`.

---

## 7. Arquivos Não Utilizados (Débito Técnico)

Ao longo do desenvolvimento iterativo, algumas mudanças de direção deixaram arquivos sem nenhum ponto de importação no restante do código. Eles não afetam o funcionamento da aplicação (o bundler simplesmente não os inclui no build final), mas ficam listados aqui por transparência e para orientar uma eventual limpeza:

| Arquivo | Status | Motivo |
|---|---|---|
| `components/Stat.jsx` | Não usado | Órfão desde a remoção da seção "Sobre" da home. |
| `hooks/useCountUp.js` | Não usado | Único consumidor era `Stat.jsx`. |
| `components/icons/TreeIllustration.jsx` | Não usado | Criado na reorganização de ícones; `Hero.jsx` não foi migrado para usá-lo. |
| `components/icons/LogsIllustration.jsx` | Não usado | Removido do resultado do QuickVol a pedido do usuário. |
| `components/icons/WoodBoxIllustration.jsx` | Não usado | Removido da ProductPage a pedido do usuário. |
| `components/icons/UploadArrowIllustration.jsx` | Não usado | Removido junto com a caixa de madeira. |
| `utils/parseSpreadsheet.js` | Não usado | Substituído por `parseGetStatsFile.js`. |
| `utils/parseSpreadsheetRows.js` | Não usado | Substituído por `parseQuickVolFile.js`. |

Recomenda-se remover esses 8 arquivos antes da entrega final do sistema, ou documentá-los explicitamente como "protótipos descartados" caso o TCC opte por discutir a evolução iterativa do desenvolvimento como parte da metodologia.

---

## 8. Considerações Finais

A separação em camadas (`components`, `components/icons`, `hooks`, `utils`) mantém a lógica de cálculo (estatística e volumetria) desacoplada da interface, o que facilita tanto a manutenção quanto uma eventual escrita de testes automatizados para a camada `utils/`, já que suas funções são puras e não dependem do DOM ou do React. A navegação entre home e as duas ferramentas foi implementada por troca de estado local em vez de uma biblioteca de rotas, opção adequada para o escopo atual (três "páginas"), mas que deve ser reavaliada caso o sistema cresça para incluir URLs compartilháveis ou mais seções.

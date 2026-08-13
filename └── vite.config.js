
## Arquitetura

O sistema é composto por dois principais componentes:

1. **ForestFlow**: Componente principal que coordena a navegação e os diferentes modos de cálculo.
2. **QuickVol** e **GetStats**: Modos de cálculo específicos.

## Jornada do Usuário

O usuário pode acessar o sistema através da página inicial (`/`). A partir daí, ele pode:

1. Navegar entre as seções "Top", "Sobre" e "Produtos".
2. Realizar cálculos de volume utilizando os modos QuickVol e GetStats.
3. Carregar arquivos CSV para entrada de dados.
4. Ver resultados dos cálculos.

## Funcionalidades

### QuickVol

O modo QuickVol permite ao usuário calcular volumes de árvores em uma região específica, utilizando dados fornecidos pelo usuário.

### GetStats

O modo GetStats permite ao usuário obter estatísticas sobre os volumes de árvores em diferentes regiões.

## Entrada e Processamento dos Dados

Os dados são carregados através de arquivos CSV. O sistema suporta dois tipos de arquivos:

- **dados_exfm19.csv**
- **dados_exfm21.csv**

O processamento dos dados envolve a leitura do arquivo, validação dos dados e cálculo dos volumes.

## Validações

As validações são realizadas nos seguintes pontos:

1. Verificação da extensão do arquivo (CSV).
2. Leitura e parsing do conteúdo do arquivo.
3. Validação dos dados carregados.

## Cálculos e Equações

Os cálculos de volume são realizados utilizando as equações definidas no arquivo `volumeEquations.js`. As equações suportam diferentes regiões.

## Componentes

O projeto contém vários componentes React, incluindo:

- **ErrorModal**: Modal para exibir mensagens de erro.
  - **Props**:
    - `isOpen`: Booleano que indica se o modal está aberto ou fechado.
    - `onClose`: Função chamada quando o usuário fecha o modal.
    - `title`: Título do modal.
    - `children`: Conteúdo do modal.

- **Footer**: Componente de rodapé da aplicação.
  - **Props**:
    - `className`: Classe CSS adicional para estilização.

- **HelpModal**: Modal para exibir informações de ajuda.
  - **Props**:
    - `isOpen`: Booleano que indica se o modal está aberto ou fechado.
    - `onClose`: Função chamada quando o usuário fecha o modal.
    - `title`: Título do modal.
    - `children`: Conteúdo do modal.

- **Hero**: Componente de destaque na página inicial.
  - **Props**:
    - `className`: Classe CSS adicional para estilização.

- **Modal**: Componente genérico para modais.
  - **Props**:
    - `isOpen`: Booleano que indica se o modal está aberto ou fechado.
    - `onClose`: Função chamada quando o usuário fecha o modal.
    - `title`: Título do modal.
    - `children`: Conteúdo do modal.

- **Nav**: Navegador principal da aplicação.
  - **Props**:
    - `className`: Classe CSS adicional para estilização.

- **ProductCard**: Cartão de produto.
  - **Props**:
    - `product`: Objeto representando o produto.
    - `onClick`: Função chamada quando o usuário clica no cartão.

- **ProductPage**: Página de produtos.
  - **Props**:
    - `products`: Array de objetos representando os produtos.

- **Products**: Lista de produtos.
  - **Props**:
    - `products`: Array de objetos representando os produtos.

- **RegionDropdown**: Dropdown para seleção de regiões.
  - **Props**:
    - `regions`: Array de strings representando as regiões.
    - `onChange`: Função chamada quando o usuário altera a região selecionada.

- **ScopeDropdown**: Dropdown para seleção de escopos.
  - **Props**:
    - `scopes`: Array de strings representando os escopos.
    - `onChange`: Função chamada quando o usuário altera o escopo selecionado.

- **Stat**: Componente para exibição de estatísticas.
  - **Props**:
    - `label`: Rótulo da estatística.
    - `value`: Valor da estatística.

- **StatsResults**: Resultados dos cálculos.
  - **Props**:
    - `results`: Objeto contendo os resultados dos cálculos.

## Utilitários

O projeto contém vários utilitários JavaScript, incluindo:

- **aggregateStats.js**: Funções para agregação de estatísticas.
  - **Funções**:
    - `aggregateByRegion(data)`: Agrupa dados por região.
    - `aggregateByScope(data)`: Agrupa dados por escopo.

- **aggregateVolume.js**: Funções para agregação de volumes.
  - **Funções**:
    - `calculateTotalVolume(data)`: Calcula o volume total dos dados.
    - `calculateAverageVolume(data)`: Calcula a média de volume dos dados.

- **downloadTemplateXlsx.js**: Função para download de templates de arquivos Excel.
  - **Parâmetros**:
    - `filename`: Nome do arquivo a ser baixado.
    - `data`: Dados a serem exportados.

- **downloadVolumeResultsXlsx.js**: Função para download de resultados de volume em formato Excel.
  - **Parâmetros**:
    - `filename`: Nome do arquivo a ser baixado.
    - `data`: Dados a serem exportados.

- **parseGetStatsFile.js**: Função para parsing de arquivos CSV do modo GetStats.
  - **Parâmetros**:
    - `file`: Arquivo CSV a ser parseado.
  - **Retorno**:
    - Objeto contendo os dados parseados.

- **parseQuickVolFile.js**: Função para parsing de arquivos CSV do modo QuickVol.
  - **Parâmetros**:
    - `file`: Arquivo CSV a ser parseado.
  - **Retorno**:
    - Objeto contendo os dados parseados.

- **readWorkbookFromFile.js**: Função para leitura de arquivos de trabalho (workbooks) em formato Excel.
  - **Parâmetros**:
    - `file`: Arquivo a ser lido.
  - **Retorno**:
    - Workbook do arquivo.

- **statistics.js**: Funções estatísticas básicas.
  - **Funções**:
    - `sum(data)`: Calcula a soma dos valores em um array.
    - `mean(data)`: Calcula a média dos valores em um array.

- **toNumber.js**: Função para conversão de valores para números.
  - **Parâmetros**:
    - `value`: Valor a ser convertido.
  - **Retorno**:
    - Valor convertido para número.

## Exportação de Resultados

Os resultados dos cálculos podem ser exportados em formato CSV utilizando as funções `downloadVolumeResultsXlsx.js` e `downloadTemplateXlsx.js`.

## Validação/Testes

O projeto não contém um sistema de testes explícito. As validações são realizadas durante o processamento dos dados.

## Como Executar o Projeto

Para executar o projeto, siga os seguintes passos:

1. Instale as dependências: `npm install`
2. Inicie o servidor de desenvolvimento: `npm run dev`

## Limitações

- O sistema suporta apenas arquivos CSV.
- As equações de volume são específicas para diferentes regiões.
- Não há um sistema de autenticação ou controle de acesso.


import { useRef, useState } from "react";
import { HelpCircle } from "lucide-react";
import { Nav } from "./Nav";
import { StatsResults } from "./StatsResults";
import { RegionDropdown } from "./RegionDropdown";
import { ScopeDropdown } from "./ScopeDropdown";
import { VolumeResult } from "./VolumeResult";
import { ErrorModal } from "./ErrorModal";
import { HelpModal } from "./HelpModal";
import { downloadTemplateXlsx } from "../utils/downloadTemplateXlsx";
import { parseGetStatsFile } from "../utils/parseGetStatsFile";
import { computeStatsByScope } from "../utils/aggregateStats";
import { parseQuickVolFile } from "../utils/parseQuickVolFile";
import { calculateVolume } from "../utils/volumeEquations";
import { computeVolumeByScope } from "../utils/aggregateVolume";
import { downloadVolumeResultsXlsx } from "../utils/downloadVolumeResultsXlsx";

const VALID_EXTENSIONS = [".csv", ".xlsx", ".xls"];

export function ProductPage({ title, onBack, onNavigate }) {
  const isQuickVol = title === "QuickVol";
  const fileInputRef = useRef(null);

  const [error, setError] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Compartilhado entre GetStats e QuickVol
  const [hasAgregador, setHasAgregador] = useState(false);
  const [selectedScope, setSelectedScope] = useState("total");

  // ---- GetStats ----
  const [statsScopeResults, setStatsScopeResults] = useState(null); // { total, byAggregator }

  // ---- QuickVol ----
  const [quickVolRows, setQuickVolRows] = useState(null); // com volume já calculado
  const [region, setRegion] = useState(null);
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [volumeScopeResults, setVolumeScopeResults] = useState(null); // { total, byAggregator }

  // Guardamos as linhas cruas do QuickVol (antes de escolher a região) até o cálculo acontecer
  const rawRowsRef = useRef(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const showError = (message) => {
    setError(message);
    setErrorModalOpen(true);
  };

  const resetResults = () => {
    setError(null);
    setErrorModalOpen(false);
    setStatsScopeResults(null);
    setQuickVolRows(null);
    setVolumeScopeResults(null);
    setSelectedScope("total");
    setHasAgregador(false);
    setRegion(null);
    setRegionMenuOpen(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    resetResults();

    const isValidFormat = VALID_EXTENSIONS.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!isValidFormat) {
      showError("Formato de arquivo inválido. Apenas .csv ou .xlsx são aceitos. Para mais informações, acesse o arquivo modelo e a sessão de ajuda.");
      e.target.value = "";
      return;
    }

    setLoading(true);

    try {
      if (isQuickVol) {
        const { rows, hasAgregador: hasAgg } = await parseQuickVolFile(file);
        if (rows.length === 0) {
          showError("O arquivo precisa conter valores válidos nas colunas DAP e altura. Para mais informações, acesse o arquivo modelo e a sessão de ajuda.");
        } else {
          rawRowsRef.current = rows;
          setHasAgregador(hasAgg);
          setRegionMenuOpen(true); // pede a região logo após o upload
        }
      } else {
        const { rows, hasAgregador: hasAgg } = await parseGetStatsFile(file);
        const anyValue = rows.some((r) => r.dap !== null || r.altura !== null || r.vol !== null);
        if (!anyValue) {
          showError("O arquivo precisa conter ao menos uma das colunas: DAP, altura ou volume. Para mais informações, acesse o arquivo modelo e a sessão de ajuda.");
        } else {
          setHasAgregador(hasAgg);
          setStatsScopeResults(computeStatsByScope(rows, hasAgg));
        }
      }
    } catch (err) {
      console.error(err);
      showError(err.message || "Não foi possível ler o arquivo. Verifique se ele não está corrompido. Para mais informações, acesse o arquivo modelo e a sessão de ajuda.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleSelectRegion = (key) => {
    const rows = rawRowsRef.current;
    if (!rows) return;

    const rowsWithVolume = rows.map((r) => ({
      ...r,
      volume: calculateVolume(r.dap, r.altura, key),
    }));

    setRegion(key);
    setRegionMenuOpen(false);
    setQuickVolRows(rowsWithVolume);
    setSelectedScope("total");
    setVolumeScopeResults(computeVolumeByScope(rowsWithVolume, hasAgregador));
  };

  const currentCountVol = 
  volumeScopeResults &&
    (selectedScope === "total" ? volumeScopeResults.count : volumeScopeResults.byAggregator[selectedScope]);

  const currentSumVol =
    volumeScopeResults &&
    (selectedScope === "total" ? volumeScopeResults.sum : volumeScopeResults.byAggregator[selectedScope]);

  const currentAverageVol =
    volumeScopeResults &&
    (selectedScope === "total" ? volumeScopeResults.average : volumeScopeResults.byAggregator[selectedScope]);

  const currentStats =
    statsScopeResults &&
    (selectedScope === "total" ? statsScopeResults.total : statsScopeResults.byAggregator[selectedScope]);

  return (
    <div className="ff">
      <Nav
        navOpen={false}
        setNavOpen={() => {}}
        active="produtos"
        onNavigate={onNavigate}
        onHome={onBack}
      />

      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="Ops, algo deu errado"
        message={error}
      />

      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title={isQuickVol ? "Como usar o QuickVol" : "Como usar o GetStats"}
      >
        {isQuickVol ? (
          <>
            <p style={{textAlign: 'justify' }}>
              1. Baixe o <strong>Arquivo Modelo</strong> e preencha com os dados
              das árvores: <strong>dap</strong> e <strong>altura</strong> são
              obrigatórios. <strong>id</strong> e <strong>agregador</strong> são
              opcionais.
            </p>  v
            <p style={{textAlign: 'justify' }}>
              2. Clique em <strong>Enviar dados</strong> e escolha o arquivo
              preenchido (.csv ou .xlsx).
            </p> <br></br>
            <p style={{textAlign: 'justify' }}>
              3. Selecione a <strong>região</strong> do Brasil — o volume é
              calculado com a equação volumétrica dessa região.
            </p> <br></br>
            <p style={{textAlign: 'justify' }}>
              4. Se o arquivo tiver a coluna <strong>agregador</strong>, use o
              seletor pra ver o volume médio total ou de cada agregador.
            </p> <br></br>
            <p style={{textAlign: 'justify' }}>
              5. Baixe o <strong>resultado completo</strong>, com o volume
              calculado de cada árvore.
            </p>
          </>
        ) : (
          <>
            <p style={{textAlign: 'justify' }}>
              1. Baixe o <strong>Arquivo Modelo</strong> e preencha com seus
              dados: <strong>dap</strong>, <strong>altura</strong> e/ou{" "}
              <strong>vol</strong>. Pelo menos uma dessas colunas precisa estar
              preenchida. <strong>id</strong> e <strong>agregador</strong> são
              opcionais.
            </p> <br></br>
            <p style={{textAlign: 'justify' }}>
              2. Clique em <strong>Enviar dados</strong> e escolha o arquivo
              preenchido (.csv ou .xlsx).
            </p> <br></br>
            <p style={{textAlign: 'justify' }}>
              3. As estatísticas (média, mediana, mínimo, máximo, amplitude,
              desvio-padrão e coeficiente de variação) aparecem na hora, uma
              tabela para cada variável enviada.
            </p> <br></br>
            <p style={{textAlign: 'justify' }}>
              4. Se o arquivo tiver a coluna <strong>agregador</strong>, use o
              seletor pra ver o total ou as estatísticas de um agregador
              específico.
            </p>
          </>
        )}
      </HelpModal>

      <section className="ff-page-body">
        <div className="ff-page-main">
          <h1>{title}</h1>

          {loading && <p>Calculando...</p>}

          {/* ---- Resultado GetStats ---- */}
          {!loading && !error && !isQuickVol && statsScopeResults && (
            <>
              {hasAgregador && (
                <ScopeDropdown
                  aggregatorKeys={Object.keys(statsScopeResults.byAggregator)}
                  selected={selectedScope}
                  onSelect={setSelectedScope}
                />
              )}
              <StatsResults stats={currentStats} />
            </>
          )}

          {/* ---- Resultado QuickVol ---- */}
          {!loading && !error && isQuickVol && volumeScopeResults && (
            <>
              {hasAgregador && (
                <ScopeDropdown
                  aggregatorKeys={Object.keys(volumeScopeResults.byAggregator)}
                  selected={selectedScope}
                  onSelect={setSelectedScope}
                />
              )}
              <VolumeResult value={currentAverageVol} count={currentCountVol} sum={currentSumVol} regionKey={region} />
              <button
                type="button"
                className="ff-page-btn ff-page-download"
                onClick={() => downloadVolumeResultsXlsx(quickVolRows, hasAgregador)}
              >
                Baixar resultado completo
              </button>
            </>
          )}

          {!loading && !statsScopeResults && !volumeScopeResults && (
            <p className="ff-page-placeholder">
              Assim que novas informações forem enviadas, os resultados aparecerão aqui.
            </p>
          )}
        </div>

        <div className="ff-page-side">
          <div className="ff-page-side__actions">
            <button
              type="button"
              className="ff-page-btn"
              onClick={() => downloadTemplateXlsx(title)}
            >
              Arquivo Modelo
            </button>

            <div className="ff-page-upload-wrap">
              <button type="button" className="ff-page-btn" onClick={handleUploadClick}>
                Enviar dados
              </button>
              {regionMenuOpen && (
                <RegionDropdown
                  onSelect={handleSelectRegion}
                  onClose={() => setRegionMenuOpen(false)}
                />
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <button
            type="button"
            className="ff-help-fab"
            onClick={() => setHelpModalOpen(true)}
            aria-label="Ajuda"
          >
            <HelpCircle size={22} strokeWidth={2} />
          </button>
        </div>
      </section>
    </div>
  );
}

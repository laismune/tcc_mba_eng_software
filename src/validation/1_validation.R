rm(list = ls())

# Leitura dos dados originais
library(forestmangr)
library(data.table)
library(dplyr)

data("exfm19")
data("exfm21")

fwrite(exfm19, "dados_exfm19.csv", sep = ";", bom = TRUE)
fwrite(exfm21, "dados_exfm21.csv", sep = ";", bom = TRUE)

# -----------------------------
# Dados originais - EXFM19
# -----------------------------

exfm19 <- exfm19 %>%
  select(STRATA, TREE, DBH, TH, VWB) %>%
  rename(
    agregador = STRATA,
    id = TREE,
    dap = DBH,
    altura = TH,
    volume = VWB
  ) %>%
  mutate(
    altura = round(as.numeric(altura), 2),
    dap = round(as.numeric(dap), 2),
    volume = round(as.numeric(volume), 4)
  ) %>%
  rename(vol_or = volume)

# -----------------------------
# Dados originais - EXFM21
# -----------------------------

exfm21 <- exfm21 %>%
  select(STRATA, DBH, TH, VWB) %>%
  rename(
    agregador = STRATA,
    dap = DBH,
    altura = TH,
    volume = VWB
  ) %>%
  filter(!is.na(altura)) %>%
  mutate(
    altura = round(as.numeric(altura), 2),
    dap = round(as.numeric(dap), 2),
    volume = round(as.numeric(volume), 4)
  ) %>%
  rename(vol_or = volume)

# -----------------------------
# Leitura dos resultados
# -----------------------------

exfm19_resultado <- read.csv(
  "resultado_quickvol_exfm19.csv",
  sep = ","
)

exfm21_resultado <- read.csv(
  "resultado_quickvol_exfm21.csv",
  sep = ","
)

# -----------------------------
# Resultados QuickVol - EXFM19
# -----------------------------

exfm19_resultado <- exfm19_resultado %>%
  mutate(
    altura = round(as.numeric(altura), 2),
    dap = round(as.numeric(dap), 2),
    volume = round(as.numeric(volume), 4)
  ) %>%
  rename(vol_res = volume)

# -----------------------------
# Resultados QuickVol - EXFM21
# -----------------------------

exfm21_resultado <- exfm21_resultado %>%
  mutate(
    altura = round(as.numeric(altura), 2),
    dap = round(as.numeric(dap), 2),
    volume = round(as.numeric(volume), 4)
  ) %>%
  rename(vol_res = volume)

# -----------------------------
# Comparação EXFM19
# -----------------------------

exfm19_total <- merge(
  exfm19,
  exfm19_resultado,
  by = c("id", "dap", "agregador", "altura")
)

# -----------------------------
# Comparação EXFM21
# -----------------------------

exfm21_total <- merge(
  exfm21,
  exfm21_resultado,
  by = c("agregador", "dap", "altura")
) 

exfm21_total <- exfm21_total %>% distinct()









library(ggplot2)
library(ggplot2)
library(dplyr)

# ============================================================
# 1. CALCULAR R²
# ============================================================

modelo19 <- lm(vol_res ~ vol_or, data = exfm19_total)
modelo21 <- lm(vol_res ~ vol_or, data = exfm21_total)

r2_19 <- summary(modelo19)$r.squared
r2_21 <- summary(modelo21)$r.squared


# ============================================================
# 2. CALCULAR RMSE
# ============================================================

rmse_19 <- sqrt(
  mean(
    (exfm19_total$vol_res - exfm19_total$vol_or)^2,
    na.rm = TRUE
  )
)

rmse_21 <- sqrt(
  mean(
    (exfm21_total$vol_res - exfm21_total$vol_or)^2,
    na.rm = TRUE
  )
)


# ============================================================
# 3. JUNTAR SOMENTE AS VARIÁVEIS NECESSÁRIAS
# ============================================================

dados_validacao <- bind_rows(
  exfm19_total %>%
    select(vol_or, vol_res) %>%
    mutate(ex = "EX19"),
  
  exfm21_total %>%
    select(vol_or, vol_res) %>%
    mutate(ex = "EX21")
)


# ============================================================
# 4. TABELA COM R² E RMSE
# ============================================================

resultados <- data.frame(
  ex = c("EX19", "EX21"),
  r2 = c(r2_19, r2_21),
  rmse = c(rmse_19, rmse_21)
)

resultados$label <- paste0(
  "R² = ", round(resultados$r2, 3),
  "\nRMSE = ", round(resultados$rmse, 2)
)


# ============================================================
# 5. GRÁFICO 1:1
# ============================================================
ggplot(
  dados_validacao,
  aes(x = vol_or, y = vol_res)
) +
  
  geom_point(
    color = "#2C7FB8",
    alpha = 0.65,
    size = 2.5
  ) +
  
  geom_abline(
    slope = 1,
    intercept = 0,
    linetype = "dashed",
    color = "coral",
    linewidth = 1
  ) +
  
  geom_text(
    data = resultados,
    aes(
      x = Inf,
      y = -Inf,
      label = label
    ),
    hjust = 1.1,
    vjust = -0.5,
    size = 4.5
  ) +
  
  facet_wrap(~ex, nrow = 1) +
  
  labs(
    title = "Validação Predito vs. Observado",
    x = "Volume Observado (m³)",
    y = "Volume Predito (m³)"
  ) +
  
  coord_equal() +
  
  theme_classic(base_size = 14) +
  
  theme(
    plot.title = element_text(
      face = "bold",
      size = 18,
      hjust = 0.5
    ),
    
    # Subtítulos EX19 e EX21 sem caixa
    strip.background = element_blank(),
    
    strip.text = element_text(
      face = "bold",
      size = 14
    ),
    
    axis.title = element_text(
      face = "bold",
      size = 13
    ),
    
    axis.text = element_text(
      color = "black"
    )
  )


t.test(
  exfm19_total$vol_res,
  exfm19_total$vol_or,
  paired = TRUE
)

t.test(
  exfm21_total$vol_res,
  exfm21_total$vol_or,
  paired = TRUE
)


library(ggplot2)

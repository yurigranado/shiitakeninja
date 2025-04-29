/**
 * Publica o Index.html como Web App.
 */
function doGet(e) {
  return HtmlService
    .createTemplateFromFile('index')  // vira template
    .evaluate()
    .setTitle('Sushi Ninja – Shiitake')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// função de include para puxar o conteúdo de outros HTMLs
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
                    .getContent();
}

/**
 * Salva ou atualiza a pontuação deste deviceId.
 */
function salvarPontuacao(nome, pontos, deviceId) {
  const SS_ID = "1xEyaB9owW7u1SI-7MQ3xkqjy9THurcMVpPdFmyHCy9I"; // seu ID da planilha
  const SHEET = "Ranking"; // nome da aba
  const ss = SpreadsheetApp.openById(SS_ID);
  const sh = ss.getSheetByName(SHEET);
  const data = sh.getDataRange().getValues();

  let found = false;
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === deviceId) {
      // atualiza nome e pontos
      sh.getRange(i + 1, 1).setValue(nome);
      sh.getRange(i + 1, 2).setValue(pontos);
      found = true;
      break;
    }
  }
  if (!found) {
    sh.appendRow([nome, pontos, deviceId]);
  }
}

/**
 * Retorna o ranking, ordenado por pontos decrescente.
 */
function getRanking(currentDeviceId) {
  const SS_ID = "1xEyaB9owW7u1SI-7MQ3xkqjy9THurcMVpPdFmyHCy9I";
  const SHEET = "Ranking";
  const ss = SpreadsheetApp.openById(SS_ID);
  const sh = ss.getSheetByName(SHEET);
  const last = sh.getLastRow();
  if (last < 2) return [];

  const data = sh.getRange("A2:C" + last).getValues();

  // Ordena por pontuação decrescente
  const ordenado = data
    .filter(r => typeof r[1] === 'number')
    .sort((a, b) => b[1] - a[1]);

  const primeiroDeviceId = ordenado[0][2];

  return ordenado
    .slice(0, 100)
    .map((r, i) => {
      const pos = `${i + 1}°`;
      const isTop1 = r[2] === primeiroDeviceId;
      const nomeFormatado = isTop1
        ? `<span class="firstPlace">${r[0]}</span> ⭐`
        : r[0];
      return `${pos} — ${nomeFormatado} — ${r[1]} pts`;
    });
}

/**
 * Retorna a pontuação mais alta já salva para este deviceId.
 */
function getMyRecord(deviceId) {
  const SS_ID = "1xEyaB9owW7u1SI-7MQ3xkqjy9THurcMVpPdFmyHCy9I";
  const SHEET = "Ranking";
  const ss = SpreadsheetApp.openById(SS_ID);
  const sh = ss.getSheetByName(SHEET);
  const data = sh.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === deviceId) {
      return data[i][1]; // retorna pontuação salva
    }
  }
  return 0;
}

// 1) Exibe o diálogo de recuperar pontos
function showRecoverDialog() {
  const html = HtmlService
    .createHtmlOutputFromFile('recover')
    .setWidth(300)
    .setHeight(220);
  SpreadsheetApp.getUi()
    .showModalDialog(html, 'Recuperar Pontos');
}


// função de include para puxar o conteúdo de outros HTMLs
function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}

// 2) Processa no servidor: salva telefone, copia pontuação e zera
function recuperarPontos(deviceId, telefoneFormatado) {
  const SS_ID = '1xEyaB9owW7u1SI-7MQ3xkqjy9THurcMVpPdFmyHCy9I';      // <— ajuste aqui
  const SHEET = 'Ranking';                 // <— ajuste aqui
  const ss = SpreadsheetApp.openById(SS_ID);
  const sh = ss.getSheetByName(SHEET);
  const data = sh.getDataRange().getValues();

  // encontra a linha cujo deviceId está na coluna C
  const idx = data.findIndex((row,i) => i>0 && row[2] === deviceId);
  if (idx < 1) throw new Error('Device não encontrado');
  const row = idx + 1;                     // planilha é 1-based
  const pontosAtuais = sh.getRange(row,2).getValue();

  // escreve telefone na Coluna D, copia pontos na E e zera pontos em B
  sh.getRange(row,4).setValue(telefoneFormatado);
  sh.getRange(row,5).setValue(pontosAtuais);
  sh.getRange(row,2).setValue(0);
}

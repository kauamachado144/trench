// =====================================================================
// TRENCH BROTHERS - sprites.js
// =====================================================================
// Aqui ficam os desenhos em PIXEL ART do jogo.
//
// Cada sprite é uma lista de textos: cada letra é uma cor (veja a "paleta")
// e o ponto "." é transparente. O script.js transforma isso em imagem.
// Pra editar um desenho, é só trocar as letras/cores aqui.
// (Este arquivo precisa ser carregado ANTES do script.js, veja o index.html)
// =====================================================================

// Soldado (Fuzileiro) (30x32 pixels) - olhando para a direita
var SPRITE_SOLDADO = {
  mapa: [
    "................A.............",
    ".............BBBCBBA..........",
    "...........BBDDDEDDCBA........",
    "..........BDDEEEEEEEDCA.......",
    ".........BDEEEEEFEEEEECA......",
    ".........BDEEEEFFFEEEECA......",
    "........GGDECECECECECECGH.....",
    ".......GEEEEEEEEEEEEEEEEIH....",
    ".......HIIIIIIIIIIIIIIIIIH....",
    "........HHHJKLLLLLLMNOPHH.....",
    "...........JKLLLLLLLQPQP......",
    "...........PQQLQLQLQQPP.......",
    "..........RRRQQQQQQST.........",
    ".........RUUUUVVQVUUWT........",
    "........RUXXYYYYYYYYYWT.......",
    "........RUYYXYYYYYUWYWT.......",
    "........RUYYYXYYYYWYUWT.......",
    "........RUYYYYXYYYYWYYWPZZZZa.",
    "........RUYYYYYXXYbbWWKQccccda",
    "........RUYYYYYYYXbeeeQQWdddda",
    "........RUYYYYYYYYfffcdWWTaaa.",
    "........RUYWYWYWYWggYcdaT.....",
    "........hiiiiiijjiiiidda......",
    ".........TWWWWWWWWWWWTa.......",
    ".........klmmmnklmmmno........",
    ".........klmmmnklmmmno........",
    ".........klmmmnklmmmno........",
    ".........plnmnnplnmnnpq.......",
    "........prrrrrrrrrrrrrsq......",
    "........prtttttrttttttsq......",
    "........qssssssssssssssq......",
    ".........qqqqqqqqqqqqqq......."
  ],
  paleta: { "A": "#121709", "B": "#272f12", "C": "#3f5320", "D": "#8aa83f", "E": "#5f7a2e", "F": "#e9c84a", "G": "#1b220d", "H": "#0c1006", "I": "#2c3a16", "J": "#453b31", "K": "#f6d3ae", "L": "#e8b98a", "M": "#ffffff", "N": "#1a1812", "O": "#070705", "P": "#36281d", "Q": "#c08f66", "R": "#222811", "S": "#8a5a44", "T": "#101409", "U": "#7a8f3d", "V": "#9a7252", "W": "#3a4720", "X": "#b79d6a", "Y": "#56662b", "Z": "#1e1e1e", "a": "#0a0a0a", "b": "#b07a4c", "c": "#6a6a6a", "d": "#222222", "e": "#8a5a34", "f": "#5a3a20", "g": "#8c7549", "h": "#19110a", "i": "#5a3b22", "j": "#d9b84a", "k": "#191d0c", "l": "#59692c", "m": "#3f4c20", "n": "#2b3516", "o": "#0c0f06", "p": "#1e150d", "q": "#0d0804", "r": "#6b4a30", "s": "#2e1c10", "t": "#4a3020" }
};

// Torre de apoio (30x32 pixels) - atirador em cima de uma plataforma de madeira,
// com sacos de areia na base. Fica ATRÁS do soldado, olhando para a direita.
var SPRITE_TORRE = {
  mapa: [
    "..............................",
    "..............................",
    ".....hhhhH....................",
    ".wXXXHHHHHH...................",
    ".wXXXHHHHHH...................",
    ".wXXXKKKN.....................",
    ".w..GKKKK.....................",
    ".w..GGGGG.................FFFF",
    ".w..GGGGGFFFFFFFFFFFFFFFFFFFFZ",
    "TwTTGGGGGRRRRRRRRRR...........",
    "SwSSggggg.....................",
    "WWWWWWWWWWWWW.................",
    "vvvvvvvvvvvvv.................",
    "sssssssssssss.................",
    ".vwv....vvw...................",
    ".vw.v..v.vw...................",
    ".vw.v..v.vw...................",
    ".vw..vv..vw...................",
    ".vw..vv..vw...................",
    ".vw..vv..vw...................",
    ".vw.v..v.vw...................",
    ".vw.v..v.vw...................",
    ".vwv....vvw...................",
    ".vw......vw...................",
    "ssssssssssssssssssssssssssssss",
    "sTTTTTsTTTTTsTTTTTsTTTTTssssss",
    "sSSSSSsSSSSSsSSSSSsSSSSSssssss",
    "sSSuSSsSSuSSsSSuSSsSSuSSssssss",
    "ssssTTTTTsTTTTTsTTTTTsTTTTTsss",
    "ssssSSSSSsSSSSSsSSSSSsSSSSSsss",
    "ssssSSuSSsSSuSSsSSuSSsSSuSSsss",
    "ssssssssssssssssssssssssssssss"
  ],
  paleta: { "s": "#1e150d", "S": "#b79d6a", "T": "#d9c48a", "u": "#8c7549", "w": "#5a3a20", "v": "#8a5a34", "W": "#a8723f", "G": "#5f7a2e", "g": "#3f5320", "H": "#3f5320", "h": "#8aa83f", "K": "#e8b98a", "N": "#1a1812", "F": "#222222", "R": "#5a3a20", "Z": "#6a6a6a", "X": "#c0392b" }
};

// Torre de vigia do batalhão, VAZIA (30x32 pixels). Fica fixa no cenário, uma por pista.
var SPRITE_TORRE_VIGIA = {
  mapa: [
    "..............................",
    ".RRRRRRRRRRRRRRRRRRRRRRRRRRRR.",
    "RRrRRRrRRRrRRRrRRRrRRRrRRRrRRR",
    "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
    "ssssssssssssssssssssssssssssss",
    "...w......................w...",
    "...w......................w...",
    "...w......................w...",
    "...w......................w...",
    "...w...........TTTTTTTTTTTT...",
    "...w...........SSSSSSSSSSSS...",
    "..WWWWWWWWWWWWWWWWWWWWWWWWWW..",
    "..vvvvvvvvvvvvvvvvvvvvvvvvvv..",
    "..ssssssssssssssssssssssssss..",
    "....vwv................vvw....",
    "....vw.v..w..w........v.vw....",
    "....vw..v.wwww.......v..vw....",
    "....vw...vw..w......v...vw....",
    "....vw....wv.w....v.....vw....",
    "....vw....wwww...v......vw....",
    "....vw....w..w..v.......vw....",
    "....vw....w..wvv........vw....",
    "....vw....wwww..v.......vw....",
    "....vw....w.vw...v......vw....",
    "....vw....wv.w....v.....vw....",
    "....vw...vwwww......v...vw....",
    "....vw..v.w..w.......v..vw....",
    "....vw.v..w..w........v.vw....",
    "sTTTTTsTTTTTsTTTTTsTTTTTssssss",
    "sSSSSSsSSSSSsSSSSSsSSSSSssssss",
    "ssssTTTTTsTTTTTsTTTTTsTTTTTsss",
    "ssssssssssssssssssssssssssssss"
  ],
  paleta: { "s": "#1e150d", "S": "#b79d6a", "T": "#d9c48a", "w": "#5a3a20", "v": "#8a5a34", "W": "#a8723f", "R": "#6b2a22", "r": "#8f3a2e", "G": "#4a5a2a", "g": "#323d1b", "H": "#5a6e33", "h": "#8aa83f", "K": "#e8b98a", "N": "#1a1812", "F": "#222222", "Z": "#6a6a6a" }
};

// Mesma torre de vigia, agora com o SNIPER em cima (30x32 pixels) - olhando para a direita.
var SPRITE_TORRE_SNIPER = {
  mapa: [
    "..............................",
    ".RRRRRRRRRRRRRRRRRRRRRRRRRRRR.",
    "RRrRRRrRRRrRRRrRRRrRRRrRRRrRRR",
    "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
    "ssssssssHhHHhsssssssssssssssss",
    "...w...HHHHHHH............w...",
    "...w...HHHKKNH....ZFFZ....w...",
    "...w...hGGKKKG....FFFF....w...",
    "...w....GGGFFFFFFFFFFFFFFFFFZZ",
    "...w....GRRRRRRRTTTTTTTTTTT...",
    "...w....gggggg.SSSSSSSSSSSS...",
    "..WWWWWWWhWWhWWWWWWWWWWWWWWW..",
    "..vvvvvvvvvvvvvvvvvvvvvvvvvv..",
    "..ssssssssssssssssssssssssss..",
    "....vwv................vvw....",
    "....vw.v..w..w........v.vw....",
    "....vw..v.wwww.......v..vw....",
    "....vw...vw..w......v...vw....",
    "....vw....wv.w....v.....vw....",
    "....vw....wwww...v......vw....",
    "....vw....w..w..v.......vw....",
    "....vw....w..wvv........vw....",
    "....vw....wwww..v.......vw....",
    "....vw....w.vw...v......vw....",
    "....vw....wv.w....v.....vw....",
    "....vw...vwwww......v...vw....",
    "....vw..v.w..w.......v..vw....",
    "....vw.v..w..w........v.vw....",
    "sTTTTTsTTTTTsTTTTTsTTTTTssssss",
    "sSSSSSsSSSSSsSSSSSsSSSSSssssss",
    "ssssTTTTTsTTTTTsTTTTTsTTTTTsss",
    "ssssssssssssssssssssssssssssss"
  ],
  paleta: { "s": "#1e150d", "S": "#b79d6a", "T": "#d9c48a", "w": "#5a3a20", "v": "#8a5a34", "W": "#a8723f", "R": "#6b2a22", "r": "#8f3a2e", "G": "#4a5a2a", "g": "#323d1b", "H": "#5a6e33", "h": "#8aa83f", "K": "#e8b98a", "N": "#1a1812", "F": "#222222", "Z": "#6a6a6a" }
};


// Soldado inimigo (30x32 pixels) - olhando para a direita (o jogo espelha ele)
// Cabo: mesmo desenho do soldado, mas com capacete marrom (pra diferenciar)
var paletaDoCabo = {};
for (var letra in SPRITE_SOLDADO.paleta) {
  paletaDoCabo[letra] = SPRITE_SOLDADO.paleta[letra];
}
paletaDoCabo["C"] = "#5a3016";
paletaDoCabo["D"] = "#c98a4b";
paletaDoCabo["E"] = "#8a4f26";

var SPRITE_CABO = { mapa: SPRITE_SOLDADO.mapa, paleta: paletaDoCabo };
var SPRITE_ICONE_CABO = recortarSprite(SPRITE_CABO, 0, 13, 6, 26);

// Mina terrestre (14x5 pixels)
var SPRITE_MINA = {
  mapa: [
    "....AAAAAA....",
    "..AABBBBBBAA..",
    ".ABBCBBBBBBBA.",
    "AABBBBBDDBBBAA",
    ".AAAAAAAAAAAA."
  ],
  paleta: { "A": "#14120c", "B": "#5b6068", "C": "#9aa0a8", "D": "#c0392b" }
};

var SPRITE_INIMIGO = {
  mapa: [
    "................A.............",
    ".............BBBCBBA..........",
    "...........BBDDDEDDCBA........",
    "..........BDDEEEEEEEDCA.......",
    ".........BDEEEEEEEEEEECA......",
    ".........BDEEEEEEEEEEECA......",
    "........FFDECECECECECECFG.....",
    ".......BEEEEEEEEEEEEEEEEHG....",
    "......BDHHHHHHHHHHHHHHHHHG....",
    "......BDECAIJKKKKKKLMNOGG.....",
    "......BDECAIJKKKKKKKPOPO......",
    "......ACCCAOPPKPKPKPPOO.......",
    ".......AAAQQQPPPPPPRS.........",
    ".........QTTTTUUPUTTVS........",
    "........QTWWXXXXXXXXXVS.......",
    "........QTYYWXXXXXTVXVS.......",
    "........QTYYXWXXXXVXTVS.......",
    "........QTYYXXWXXXXVXXVOZZZZa.",
    "........QTXXXXXWWXbbVVJPccccda",
    "........QTXXXXXXXWbeeePPVdddda",
    "........QTXXXXXXXXfffcdVVSaaa.",
    "........QTXVXVXVXVggXcdaS.....",
    "........hiiiiiijjiiiidda......",
    ".........SVVVVVVVVVVVSa.......",
    ".........klmmmnklmmmno........",
    ".........klmmmnklmmmno........",
    ".........klmmmnklmmmno........",
    ".........plnmnnplnmnnpq.......",
    "........prrrrrrrrrrrrrsq......",
    "........prtttttrttttttsq......",
    "........qssssssssssssssq......",
    ".........qqqqqqqqqqqqqq......."
  ],
  paleta: { "A": "#131516", "B": "#2b2e30", "C": "#454a4f", "D": "#9aa3ab", "E": "#6b7075", "F": "#1e1f21", "G": "#0d0f0f", "H": "#303437", "I": "#453b31", "J": "#f6d3ae", "K": "#e8b98a", "L": "#ffffff", "M": "#1a1812", "N": "#070705", "O": "#36281d", "P": "#c08f66", "Q": "#272420", "R": "#8a5a44", "S": "#151411", "T": "#8b8273", "U": "#9a7252", "V": "#4c463d", "W": "#b79d6a", "X": "#6e665a", "Y": "#c0392b", "Z": "#1e1e1e", "a": "#0a0a0a", "b": "#b07a4c", "c": "#6a6a6a", "d": "#222222", "e": "#8a5a34", "f": "#5a3a20", "g": "#8c7549", "h": "#19110a", "i": "#5a3b22", "j": "#d9b84a", "k": "#1d1b18", "l": "#686156", "m": "#4f4a41", "n": "#37332c", "o": "#0f0e0c", "p": "#1e150d", "q": "#0d0804", "r": "#6b4a30", "s": "#2e1c10", "t": "#4a3020" }
};

// NOVO US4: Cabo inimigo = mesmo desenho do soldado inimigo, só com o capacete vermelho
var paletaDoCaboInimigo = {};
for (var letra in SPRITE_INIMIGO.paleta) {
  paletaDoCaboInimigo[letra] = SPRITE_INIMIGO.paleta[letra];
}
paletaDoCaboInimigo["C"] = "#7a2f1f";
paletaDoCaboInimigo["D"] = "#d98a6a";
paletaDoCaboInimigo["E"] = "#b0553a";
var SPRITE_INIMIGO_CABO = { mapa: SPRITE_INIMIGO.mapa, paleta: paletaDoCaboInimigo };

// Bomba do Bombardeio (11x20 pixels) - apontada para baixo
var SPRITE_BOMBA = {
  mapa: [
    "..AAAAAB...",
    ".ACCCCCDB..",
    ".ACEEEEDB..",
    "ACEEEEEEDB.",
    "BDDDDDDDDB.",
    ".BBFGGHIB..",
    "..JGKKKHL..",
    ".JMMMMMMNL.",
    ".LNNNNNNNL.",
    ".FGKKKKKHI.",
    ".FGKKKKKHI.",
    ".FGKKKKKHI.",
    ".FGKKKKKHI.",
    ".FGKKKKKHI.",
    ".IHKHKHKHI.",
    "..FGKHKHI..",
    "..OPQPHHI..",
    "...OPHHI...",
    "....OII....",
    "..........."
  ],
  paleta: { "A": "#3b1816", "B": "#1e0707", "C": "#d4554f", "D": "#6a1a1a", "E": "#a02b2b", "F": "#27282b", "G": "#8a909a", "H": "#33373d", "I": "#0e0f11", "J": "#453c1b", "K": "#5b6068", "L": "#2d2204", "M": "#f6d760", "N": "#a07a10", "O": "#060607", "P": "#15171a", "Q": "#4a4f57" }
};


// =====================================================================
// Transforma um sprite (mapa de letras) em uma IMAGEM pronta pra desenhar.
//   escala:         quanto cada pixel do sprite é ampliado na tela
//   espelhar:       true = vira o desenho pro outro lado
//   ficarBranco:    true = pinta tudo de branco (efeito de "levou dano")
// A imagem é criada UMA vez só, e depois o jogo só "cola" ela na tela.
// =====================================================================
function criarImagemDoSprite(sprite, escala, espelhar, ficarBranco) {
  var largura = sprite.mapa[0].length;
  var altura = sprite.mapa.length;

  var tela = document.createElement("canvas");
  tela.width = largura * escala;
  tela.height = altura * escala;
  var ctx = tela.getContext("2d");

  for (var linha = 0; linha < altura; linha++) {
    for (var coluna = 0; coluna < largura; coluna++) {
      var letra = sprite.mapa[linha].charAt(coluna);
      if (letra === ".") {
        continue; // transparente
      }

      var cor = ficarBranco ? "#ffffff" : sprite.paleta[letra];
      var colunaFinal = espelhar ? (largura - 1 - coluna) : coluna;

      ctx.fillStyle = cor;
      ctx.fillRect(colunaFinal * escala, linha * escala, escala, escala);
    }
  }
  return tela;
}

// =====================================================================
// Cria os QUADROS da animação de explosão (também em pixel art).
// Retorna uma lista de imagens: do clarão inicial até a fumaça sumindo.
// =====================================================================
function criarQuadrosDaExplosao(escala) {
  var TAMANHO = 32;     // cada quadro tem 32x32 pixels
  var QUANTIDADE = 8;   // 8 quadros de animação
  var quadros = [];

  for (var q = 0; q < QUANTIDADE; q++) {
    var tela = document.createElement("canvas");
    tela.width = TAMANHO * escala;
    tela.height = TAMANHO * escala;
    var ctx = tela.getContext("2d");

    var t = q / (QUANTIDADE - 1);                                  // 0 (começo) até 1 (fim)
    var raioDoFogo = 14 * Math.min(1, (q + 1) / 3) * (1 - t * 0.55);
    var raioDaFumaca = 8 + 9 * t;

    for (var y = 0; y < TAMANHO; y++) {
      for (var x = 0; x < TAMANHO; x++) {
        var dx = x - 15.5;
        var dy = y - 15.5;
        var angulo = Math.atan2(dy, dx);
        // O "ruído" deixa a borda da explosão irregular, em vez de um círculo perfeito
        var ruido = 1 + 0.16 * Math.sin(3 * angulo + q) + 0.10 * Math.sin(7 * angulo + 2 * q);
        var distancia = Math.sqrt(dx * dx + dy * dy) / ruido;

        var cor = null;
        if (distancia < raioDoFogo * 0.35)      { cor = "#fff4c2"; }
        else if (distancia < raioDoFogo * 0.62) { cor = "#ffc83a"; }
        else if (distancia < raioDoFogo * 0.85) { cor = "#e8641a"; }
        else if (distancia < raioDoFogo)        { cor = "#a8321a"; }
        else if (distancia < raioDaFumaca && (x + y) % 2 === 0) { cor = "#4a4540"; } // fumaça "tracejada"

        // No final da animação, vão sumindo pixels aos poucos
        if (cor !== null && t > 0.6 && ((x * 7 + y * 13 + q * 5) % 10) < (t - 0.6) * 25) {
          cor = null;
        }

        if (cor !== null) {
          ctx.fillStyle = cor;
          ctx.fillRect(x * escala, y * escala, escala, escala);
        }
      }
    }

    // Faíscas amarelas saindo da explosão
    ctx.fillStyle = "#ffd54f";
    for (var f = 0; f < 9; f++) {
      var a = f * 0.7 + q * 0.3;
      var r = 5 + q * 2 + (f % 3) * 2;
      if (r < 15 && t < 0.85) {
        ctx.fillRect(Math.round(15 + Math.cos(a) * r) * escala, Math.round(15 + Math.sin(a) * r) * escala, escala, escala);
      }
    }

    quadros.push(tela);
  }
  return quadros;
}

// =====================================================================
// ÍCONES PEQUENOS (usados no HUD e nas cartas)
// =====================================================================

// Medalha/estrela dourada (9x9) - suprimentos
var SPRITE_ESTRELA = {
  mapa: [
    "....K....",
    "...KYK...",
    "...KYK...",
    "KKKKYKKKK",
    ".KYYWYYK.",
    "..KYYYK..",
    "..KYKYK..",
    ".KYK.KYK.",
    ".KK...KK."
  ],
  paleta: { "K": "#7a4b00", "Y": "#ffc107", "W": "#fff3b0" }
};

// Coração (9x8) - vida do batalhão
var SPRITE_CORACAO = {
  mapa: [
    ".KKK.KKK.",
    "KRRRKRRRK",
    "KRWRRRRRK",
    "KRRRRRRRK",
    ".KRRRRRK.",
    "..KRRRK..",
    "...KRK...",
    "....K...."
  ],
  paleta: { "K": "#5a0f10", "R": "#e53935", "W": "#ff8a80" }
};

// Divisa (patente) dupla (9x9) - XP
var SPRITE_PATENTE = {
  mapa: [
    "....Y....",
    "...YYY...",
    "..YY.YY..",
    ".YY...YY.",
    "YY.....YY",
    "....Y....",
    "...YYY...",
    "..YY.YY..",
    ".YY...YY."
  ],
  paleta: { "Y": "#ffd54f" }
};

// Recorta um pedaço de um sprite (usado pra fazer o ícone só da cabeça)
function recortarSprite(sprite, linhaInicial, linhaFinal, colunaInicial, colunaFinal) {
  var mapa = [];
  for (var linha = linhaInicial; linha <= linhaFinal; linha++) {
    mapa.push(sprite.mapa[linha].substring(colunaInicial, colunaFinal + 1));
  }
  return { mapa: mapa, paleta: sprite.paleta };
}

var SPRITE_ICONE_SOLDADO = recortarSprite(SPRITE_SOLDADO, 0, 13, 6, 26);
var SPRITE_ICONE_INIMIGO = recortarSprite(SPRITE_INIMIGO, 0, 13, 6, 26);
var SPRITE_ICONE_TORRE = recortarSprite(SPRITE_TORRE, 1, 13, 0, 14);
var SPRITE_ICONE_SNIPER = recortarSprite(SPRITE_TORRE_SNIPER, 3, 11, 6, 22);


// =====================================================================
// CENÁRIO: o campo de batalha em pixel art
// =====================================================================
// O cenário é desenhado UMA vez só (quando o jogo abre) numa imagem
// grande, e depois o jogo só "cola" ela na tela a cada frame.
//
// Primeiro desenhamos tudo numa imagem PEQUENA (300x160 pixels) e depois
// ampliamos 3x. É isso que deixa os pixels grandes e com cara de pixel art.
//
// Os valores recebidos (em pixels da tela) vêm do script.js.
// =====================================================================
function criarImagemDoCenario(escala, larguraTela, alturaTela, trincheiraTela, alturaPistaTela, numeroDePistas, larguraColunaTela) {
  // Medidas em "pixels de pixel art" (tela dividida pela escala)
  var W = Math.round(larguraTela / escala);        // largura total
  var H = Math.round(alturaTela / escala);         // altura total
  var T = Math.round(trincheiraTela / escala);     // largura da trincheira
  var LP = Math.round(alturaPistaTela / escala);   // altura de uma pista

  var pequena = document.createElement("canvas");
  pequena.width = W;
  pequena.height = H;
  var c = pequena.getContext("2d");

  // Desenha um retângulo de pixels
  function pixel(x, y, cor, largura, altura) {
    c.fillStyle = cor;
    c.fillRect(Math.round(x), Math.round(y), largura || 1, altura || 1);
  }

  // Gerador de números aleatórios com "semente": gera sempre o MESMO cenário
  var semente = 12345;
  function aleatorio() {
    semente = (semente * 1664525 + 1013904223) % 4294967296;
    return semente / 4294967296;
  }

  // Tabela usada pra "tramar" (dither): mistura dois tons em padrão de pixels
  var BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  function limiar(x, y) {
    return (BAYER[y % 4][x % 4] + 0.5) / 16;
  }

  // Ruído suave: manchas grandes de terra mais clara e mais escura
  function criarRuido(tamanhoDoBloco) {
    var gw = Math.ceil(W / tamanhoDoBloco) + 2;
    var gh = Math.ceil(H / tamanhoDoBloco) + 2;
    var grade = [];
    for (var i = 0; i < gw * gh; i++) {
      grade.push(aleatorio());
    }
    return function (x, y) {
      var fx = x / tamanhoDoBloco;
      var fy = y / tamanhoDoBloco;
      var ix = Math.floor(fx);
      var iy = Math.floor(fy);
      var tx = fx - ix;
      var ty = fy - iy;
      tx = tx * tx * (3 - 2 * tx);
      ty = ty * ty * (3 - 2 * ty);
      var a = grade[iy * gw + ix];
      var b = grade[iy * gw + ix + 1];
      var cc = grade[(iy + 1) * gw + ix];
      var d = grade[(iy + 1) * gw + ix + 1];
      return (a * (1 - tx) + b * tx) * (1 - ty) + (cc * (1 - tx) + d * tx) * ty;
    };
  }

  // ---------- 1) A LAMA (fundo do campo) ----------
  var TONS_DA_LAMA = ["#4d3f2b", "#5a4a33", "#675638", "#746242", "#83714d"];
  var ruidoGrande = criarRuido(9);
  var ruidoFino = criarRuido(4);

  for (var y = 0; y < H; y++) {
    for (var x = 0; x < W; x++) {
      var v = ruidoGrande(x, y) * 0.65 + ruidoFino(x, y) * 0.35;
      v = 0.15 + v * 0.7;
      // arredonda pro tom mais próximo; a "trama" só mexe um pouquinho nas bordas das manchas
      var indice = Math.round(v * (TONS_DA_LAMA.length - 1) + (limiar(x, y) - 0.5) * 0.55);
      indice = Math.max(0, Math.min(TONS_DA_LAMA.length - 1, indice));
      pixel(x, y, TONS_DA_LAMA[indice]);

      // Pontinhos de terra mais escura e mais clara
      var sorteio = aleatorio();
      if (sorteio < 0.02) {
        pixel(x, y, "#3f3322");
      } else if (sorteio < 0.035) {
        pixel(x, y, "#8f7b55");
      }
    }
  }

  // Linhas pontilhadas separando as pistas
  for (var p = 1; p < numeroDePistas; p++) {
    for (var lx = T; lx < W; lx += 2) {
      pixel(lx, p * LP, "#3a2f20");
    }
  }

  // ---------- 2) DECORAÇÃO ----------
  function poca(cx, cy, rx, ry) {
    for (var py = -ry - 1; py <= ry + 1; py++) {
      for (var px = -rx - 1; px <= rx + 1; px++) {
        var d = (px * px) / (rx * rx) + (py * py) / (ry * ry);
        if (d <= 1) {
          pixel(cx + px, cy + py, "#4d5a63");
        } else if (d <= 1.4) {
          pixel(cx + px, cy + py, "#3f4a52");
        }
      }
    }
    pixel(cx - rx * 0.4, cy - ry * 0.4, "#9bb3bf", 2, 1);   // reflexo
    pixel(cx + 1, cy, "#6c8290");
  }

  function cratera(cx, cy, rx, ry) {
    for (var py = -ry - 1; py <= ry + 1; py++) {
      for (var px = -rx - 1; px <= rx + 1; px++) {
        var d = (px * px) / (rx * rx) + (py * py) / (ry * ry);
        if (d <= 1) {
          var escuro = (d < 0.45 && (px + py) % 2 === 0) ? "#241c12" : (py < 0 ? "#2e2518" : "#3b2f1f");
          pixel(cx + px, cy + py, escuro);
        } else if (d <= 1.45) {
          pixel(cx + px, cy + py, py < 0 ? "#8a7650" : "#4a3b26");   // borda: luz em cima, sombra embaixo
        }
      }
    }
  }

  function capim(x, y) {
    pixel(x, y, "#6a7a3a", 1, 3);
    pixel(x - 1, y + 1, "#7d8f45", 1, 2);
    pixel(x + 1, y + 1, "#55632d", 1, 2);
  }

  function pedra(x, y) {
    pixel(x, y, "#8a8a85", 2, 1);
    pixel(x, y + 1, "#5f5f5a", 2, 1);
    pixel(x, y, "#b5b5ae");
  }

  function tabua(x, y) {
    for (var i = 0; i < 7; i++) {
      pixel(x + i, y + (i >> 2), "#6b4a30");
      pixel(x + i, y + (i >> 2) + 1, "#3e2a1c");
    }
    pixel(x + 1, y, "#b5b5ae");
  }

  poca(118, 21, 6, 2);
  poca(172, 146, 5, 2);
  poca(60, 85, 4, 1);
  poca(240, 62, 6, 2);
  poca(88, 124, 5, 2);

  cratera(104, 115, 7, 3);
  cratera(193, 21, 6, 2);
  cratera(137, 84, 5, 2);
  cratera(262, 100, 7, 3);
  cratera(225, 146, 6, 2);

  for (var g = 0; g < 26; g++) {
    capim(20 + Math.floor(aleatorio() * 270), 4 + Math.floor(aleatorio() * 150));
  }
  for (var r = 0; r < 24; r++) {
    pedra(20 + Math.floor(aleatorio() * 270), 3 + Math.floor(aleatorio() * 152));
  }
  for (var b = 0; b < 6; b++) {
    tabua(30 + Math.floor(aleatorio() * 250), 6 + Math.floor(aleatorio() * 145));
  }
  for (var k = 0; k < 14; k++) {          // cartuchos de bala no chão (perto da trincheira)
    var kx = 18 + Math.floor(aleatorio() * 100);
    var ky = 4 + Math.floor(aleatorio() * 152);
    pixel(kx, ky, "#c9a227");
    pixel(kx + 1, ky, "#8a6d12");
  }

  // ---------- 3) TRINCHEIRA ----------
  function saco(x, y, w, h) {
    pixel(x + 1, y, "#1a1812", w - 2, 1);
    pixel(x, y + 1, "#1a1812", w, h - 2);
    pixel(x + 1, y + h - 1, "#1a1812", w - 2, 1);
    pixel(x + 1, y + 1, "#b79d6a", w - 2, h - 2);
    pixel(x + 2, y + 1, "#d3bb8a", w - 4, 1);
    pixel(x + 1, y + h - 2, "#8c7549", w - 2, 1);
    pixel(x + 3, y + 2, "#8c7549", 3, 1);
  }

  // Fundo da trincheira com tábuas de madeira
  pixel(0, 0, "#2b2218", T, H);
  for (var tx = 0; tx < 6; tx++) {
    for (var ty = 0; ty < H; ty++) {
      var corTabua = (Math.floor(tx / 2) % 2 === 0) ? "#4a3624" : "#3d2d1e";
      if ((tx * 7 + ty * 3) % 11 === 0) {
        corTabua = "#2f2318";   // veio da madeira
      }
      pixel(tx, ty, corTabua);
    }
  }
  // Vigas horizontais na divisão de cada pista
  for (var vp = 0; vp <= numeroDePistas; vp++) {
    pixel(0, Math.min(H - 2, vp * LP - 1), "#6b4a30", 6, 1);
    pixel(0, Math.min(H - 1, vp * LP), "#2a1c10", 6, 1);
  }
  // Sacos de areia empilhados (5 por pista)
  for (var sp = 0; sp < numeroDePistas; sp++) {
    for (var si = 0; si < 5; si++) {
      saco(5 + (si % 2), sp * LP + 1 + si * 6, 10, 6);
    }
  }

  // ---------- 4) ARAME FARPADO (lado inimigo) ----------
  for (var ap = 0; ap < numeroDePistas; ap++) {
    var topo = ap * LP;
    pixel(W - 6, topo + 4, "#2a241c", 1, 24);        // poste
    pixel(W - 1, topo + 4, "#2a241c", 1, 24);        // poste
    for (var fio = 0; fio < 2; fio++) {
      var fy = topo + 9 + fio * 13;
      for (var fx = W - 10; fx < W; fx++) {
        pixel(fx, fy + (fx % 2), "#b5b5b5");
        if (fx % 3 === 0) {
          pixel(fx, fy - 1 + (fx % 2) * 3, "#777777");   // farpa
        }
      }
    }
  }

  // ---------- 5) ESCURECER AS BORDAS + NÉVOA NO TOPO ----------
  var imagem = c.getImageData(0, 0, W, H);
  var dados = imagem.data;
  for (var vy = 0; vy < H; vy++) {
    for (var vx = 0; vx < W; vx++) {
      var i = (vy * W + vx) * 4;
      var dx = (vx - W / 2) / (W / 2);
      var dy = (vy - H / 2) / (H / 2);
      var distancia = Math.sqrt(dx * dx * 0.9 + dy * dy * 1.1);
      var escurecer = Math.max(0, distancia - 0.62) * 1.4;
      var corte = limiar(vx, vy);
      var fator = 1;
      if (corte < escurecer) { fator = 0.84; }
      if (corte < escurecer - 0.35) { fator = 0.7; }
      dados[i] = dados[i] * fator;
      dados[i + 1] = dados[i + 1] * fator;
      dados[i + 2] = dados[i + 2] * fator;

      // Névoa clara no topo
      if (vy < 14) {
        var nevoa = (1 - vy / 14) * 0.35;
        if (corte < nevoa) {
          dados[i] = dados[i] * 0.7 + 185 * 0.3;
          dados[i + 1] = dados[i + 1] * 0.7 + 179 * 0.3;
          dados[i + 2] = dados[i + 2] * 0.7 + 162 * 0.3;
        }
      }
    }
  }
  c.putImageData(imagem, 0, 0);

  // ---------- 6) AMPLIA (sem suavizar!) ----------
  var grande = document.createElement("canvas");
  grande.width = W * escala;
  grande.height = H * escala;
  var g2 = grande.getContext("2d");
  g2.imageSmoothingEnabled = false;
  g2.drawImage(pequena, 0, 0, W * escala, H * escala);
  return grande;
}


// =====================================================================
// CENÁRIO DO BATALHÃO: a área atrás da trincheira, com as torres de vigia
// =====================================================================
// Desenha (UMA vez só) o acampamento do batalhão: chão de terra batida,
// barracas, caixas, barris, a bandeira do Brasil e uma torre de vigia vazia por pista.
// É nessas torres que o jogador posiciona os snipers.
//   xDaTorreTela: onde (em pixels da tela) fica a esquerda de cada torre
// =====================================================================
function criarImagemDoBatalhao(escala, larguraTela, alturaTela, alturaPistaTela, numeroDePistas, xDaTorreTela) {
  var W = Math.round(larguraTela / escala);
  var H = Math.round(alturaTela / escala);
  var LP = Math.round(alturaPistaTela / escala);
  var XT = Math.round(xDaTorreTela / escala);

  var pequena = document.createElement("canvas");
  pequena.width = W;
  pequena.height = H;
  var c = pequena.getContext("2d");

  function pixel(x, y, cor, largura, altura) {
    c.fillStyle = cor;
    c.fillRect(Math.round(x), Math.round(y), largura || 1, altura || 1);
  }

  var semente = 777;
  function aleatorio() {
    semente = (semente * 1664525 + 1013904223) % 4294967296;
    return semente / 4294967296;
  }

  // ---------- 1) CHÃO DE TERRA BATIDA (mais claro e seco que a lama do campo) ----------
  var TONS_DO_CHAO = ["#6b5a3c", "#76643f", "#80704a", "#8b7a52"];
  for (var y = 0; y < H; y++) {
    for (var x = 0; x < W; x++) {
      var t = Math.floor(aleatorio() * 3);                 // tons de 0 a 2, bem misturados
      if (((x >> 1) + (y >> 1)) % 5 === 0) { t = t + 1; }  // manchas mais claras em padrão
      pixel(x, y, TONS_DO_CHAO[Math.min(3, t)]);
      var sorteio = aleatorio();
      if (sorteio < 0.02) { pixel(x, y, "#4a3c27"); }
      else if (sorteio < 0.035) { pixel(x, y, "#9a8860"); }
    }
  }

  // Linhas pontilhadas separando as pistas
  for (var p = 1; p < numeroDePistas; p++) {
    for (var lx = 0; lx < W; lx += 2) {
      pixel(lx, p * LP, "#4a3c27");
    }
  }

  // ---------- 2) DECORAÇÃO DO ACAMPAMENTO ----------
  function caixa(x, y) {
    pixel(x, y, "#1a1812", 9, 8);
    pixel(x + 1, y + 1, "#8a5a34", 7, 6);
    pixel(x + 1, y + 1, "#a8723f", 7, 1);
    pixel(x + 1, y + 6, "#5a3a20", 7, 1);
    for (var i = 0; i < 5; i++) {
      pixel(x + 2 + i, y + 2 + i, "#5a3a20");             // tábua em X
      pixel(x + 6 - i, y + 2 + i, "#5a3a20");
    }
  }

  function barril(x, y) {
    pixel(x + 1, y, "#1a1812", 6, 1);
    pixel(x, y + 1, "#1a1812", 8, 8);
    pixel(x + 1, y + 9, "#1a1812", 6, 1);
    pixel(x + 1, y + 1, "#6b6f4a", 6, 8);
    pixel(x + 1, y + 1, "#8a8f63", 2, 8);                 // luz
    pixel(x + 1, y + 3, "#3a3d27", 6, 1);                 // aros
    pixel(x + 1, y + 6, "#3a3d27", 6, 1);
  }

  function barraca(x, y) {                                // barraca de lona (14x10)
    for (var i = 0; i < 7; i++) {
      pixel(x + 6 - i, y + 9 - i * 1.2, "#3f5320", 2 + i * 2, 1);
    }
    for (var l = 0; l < 10; l++) {
      var meio = 7;
      var meia = Math.min(7, 1 + Math.floor(l * 0.75) + 0);
      pixel(x + meio - meia, y + l, "#1a2110", 1, 1);
      pixel(x + meio + meia - 1, y + l, "#1a2110", 1, 1);
      pixel(x + meio - meia + 1, y + l, l < 3 ? "#8aa83f" : "#5f7a2e", meia * 2 - 2, 1);
    }
    pixel(x + 5, y + 6, "#1a1812", 4, 4);                 // porta
  }

  // Bandeira do Brasil (9x7 pixels) no mastro: verde, losango amarelo e círculo azul
  function bandeiraDoBrasil(x, y) {
    var mapaDaBandeira = [
      "GGGGYGGGG",
      "GGGYYYGGG",
      "GGYYBYYGG",
      "GYYBWBYYG",
      "GGYYBYYGG",
      "GGGYYYGGG",
      "GGGGYGGGG"
    ];
    var coresDaBandeira = { "G": "#009c3b", "Y": "#ffdf00", "B": "#002776", "W": "#ffffff" };

    pixel(x, y, "#2a1c10", 1, 22);                          // mastro
    pixel(x + 1, y + 1, "#1a1812", 11, 1);                  // contorno de cima
    pixel(x + 1, y + 9, "#1a1812", 11, 1);                  // contorno de baixo
    pixel(x + 10, y + 2, "#1a1812", 1, 7);                  // contorno da ponta
    for (var linha = 0; linha < mapaDaBandeira.length; linha++) {
      for (var coluna = 0; coluna < mapaDaBandeira[linha].length; coluna++) {
        pixel(x + 1 + coluna, y + 2 + linha, coresDaBandeira[mapaDaBandeira[linha].charAt(coluna)]);
      }
    }
  }

  var DY = LP - 12;     // altura "do chão" dentro de cada pista (as coisas ficam em pé nela)
  bandeiraDoBrasil(5, 6);                                  // pista 0 (a de cima)
  barril(46, 0 * LP + DY);
  caixa(2, 1 * LP + DY);                                   // pista 1
  barril(46, 1 * LP + DY);
  barraca(0, 2 * LP + LP - 12);                            // pista 2
  caixa(46, 2 * LP + DY);
  barril(3, 3 * LP + DY);                                  // pista 3
  caixa(46, 3 * LP + DY);
  caixa(2, 4 * LP + DY);                                   // pista 4
  barril(46, 4 * LP + DY);

  // ---------- 3) AS TORRES DE VIGIA (uma por pista) ----------
  var imagemDaTorre = criarImagemDoSprite(SPRITE_TORRE_VIGIA, 1, false, false);
  for (var pt = 0; pt < numeroDePistas; pt++) {
    c.drawImage(imagemDaTorre, XT, pt * LP);
  }

  // ---------- 4) BORDAS: cerca de madeira à esquerda e sombra perto da trincheira ----------
  for (var cy = 0; cy < H; cy++) {
    pixel(0, cy, "#2a1c10");
    pixel(1, cy, (cy % 4 < 2) ? "#6b4a30" : "#4a3020");
    pixel(W - 1, cy, "#2b2218");
    pixel(W - 2, cy, "#4a3c27");
  }

  // ---------- 5) AMPLIA (sem suavizar!) ----------
  var grande = document.createElement("canvas");
  grande.width = W * escala;
  grande.height = H * escala;
  var g2 = grande.getContext("2d");
  g2.imageSmoothingEnabled = false;
  g2.drawImage(pequena, 0, 0, W * escala, H * escala);
  return grande;
}

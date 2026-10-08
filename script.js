// =====================================================================
// TRENCH BROTHERS - script.js
// =====================================================================
// Este arquivo tem TODA a lógica do jogo.
//
// User story 1: iniciar partida, cenário, inimigos aparecendo, recursos.
// Inimigos ATACAM a trincheira (batalhão tem vida).
// User story 2: posicionar soldados no campo (agora com 5 pistas).


// =====================================================================
// 1) Aqui puxamos os elementos do HTML
// =====================================================================
var telaMenu       = document.getElementById("telaMenu");
var telaJogo       = document.getElementById("telaJogo");
var botaoIniciar   = document.getElementById("botaoIniciar");
var botaoMenu      = document.getElementById("botaoMenu");
var canvas         = document.getElementById("canvasJogo");
var contexto       = canvas.getContext("2d"); // é com o "contexto" que a gente desenha no canvas
var textoRecursos  = document.getElementById("valorRecursos");
var textoInimigos  = document.getElementById("valorInimigos");
var textoVida      = document.getElementById("valorVida");
var barraDeSoldados = document.getElementById("barraDeSoldados");


// =====================================================================
// 2) VARIÁVEIS DO JOGO
// =====================================================================

// Quantos "recursos" (suprimentos) o jogador tem no início da partida.
// (500 = dá pra posicionar 5 Fuzileiros de cara. Mude à vontade.)
var RECURSOS_INICIAIS = 500;
var recursos = RECURSOS_INICIAIS;

// Lista com todos os inimigos que estão na tela agora
var listaDeInimigos = [];

// O campo de batalha é dividido em "pistas" (igual Plants vs Zombies),
// os inimigos andam da direita pra esquerda em uma dessas pistas.
var NUMERO_DE_PISTAS = 5;
var ALTURA_DA_PISTA = canvas.height / NUMERO_DE_PISTAS;

// Posição (no eixo X) onde fica a trincheira do jogador
var POSICAO_DA_TRINCHEIRA = 50;

// ----- CONFIGURAÇÕES DOS SOLDADOS (User story 2) -----

// O campo onde dá pra posicionar soldados é uma grade:
// NUMERO_DE_PISTAS linhas x NUMERO_DE_COLUNAS colunas, começando na trincheira.
var NUMERO_DE_COLUNAS = 4;
var LARGURA_DA_COLUNA = 85;

// O campo inteiro (soldados + terra de ninguém) usa casas do mesmo tamanho.
// 850 / 85 = 10 colunas certinhas.
var NUMERO_DE_COLUNAS_DO_CAMPO = Math.floor((canvas.width - POSICAO_DA_TRINCHEIRA) / LARGURA_DA_COLUNA);

// Tipos de soldado que dá pra escolher na barra (valores da tabela do Trello).
// Pra adicionar um soldado novo, é só colocar mais um item aqui.
var TIPOS_DE_SOLDADO = [
  { id: "fuzileiro", nome: "Fuzileiro", custo: 100, vida: 300 }
];

// Soldado que o jogador escolheu na barra (null = nenhum escolhido)
var tipoSelecionado = null;

// Guarda cada carta da barra (o botão do HTML + o tipo de soldado dela)
var cartasDeSoldados = [];

// Lista com todos os soldados posicionados no campo
var listaDeSoldados = [];

// Onde o mouse está (em coordenadas do canvas). -1 = fora do canvas.
var mouseX = -1;
var mouseY = -1;

// Mensagem de aviso que aparece no topo do campo (ex: "sem suprimentos")
var textoDoAviso = "";
var ticksDoAviso = 0;

// ----- CONFIGURAÇÕES DO ATAQUE (mexa nesses números pra balancear) -----

// Vida do batalhão. Chegou em 0 = fim de jogo.
var VIDA_INICIAL_DO_BATALHAO = 10;
var vidaDoBatalhao = VIDA_INICIAL_DO_BATALHAO;

// O inimigo para de andar a essa distância da trincheira (em pixels).
// Calculado pra ele parar logo depois da última coluna de soldados.
var DISTANCIA_DE_PARADA = (NUMERO_DE_COLUNAS * LARGURA_DA_COLUNA) + 20;

// Alcance do tiro: só atira se estiver a essa distância (ou menos) da trincheira.
// Quanto maior, mais cedo os inimigos começam a atacar (eles atiram andando).
var ALCANCE_DO_TIRO = 420;

// Quantos ticks depois de entrar no alcance o inimigo dá o PRIMEIRO tiro
// (os próximos seguem o TICKS_ENTRE_TIROS). 15 ticks = ~0,45 segundo.
var TICKS_ATE_O_PRIMEIRO_TIRO = 15;

// Distância mínima (em pixels) entre dois inimigos da mesma pista.
// Precisa ser maior que a largura (34) + o tamanho da arma (14)
var ESPACO_ENTRE_INIMIGOS = 60;

// Quanto de vida cada tiro tira do batalhão
var DANO_POR_TIRO = 1;

// Tempo entre um tiro e outro. O loop roda a cada 30ms,
// então 60 "ticks" = 1,8 segundos.
var TICKS_ENTRE_TIROS = 60;

// Por quantos ticks a animação do tiro (a linha amarela) fica na tela
var TICKS_DA_ANIMACAO_DO_TIRO = 6;

// Quantos ticks a trincheira fica piscando em vermelho depois de levar um tiro
var ticksDePiscadaDaTrincheira = 0;

// Quando vira true, o jogo acabou (batalhão sem vida)
var jogoAcabou = false;

// Guardam os "timers" do jogo, pra gente conseguir parar eles depois
var timerDeSpawnDeInimigos = null;
var timerDoLoopDoJogo = null;


// =====================================================================
// 3) FUNÇÃO PRINCIPAL: INICIAR A PARTIDA
// =====================================================================
function iniciarPartida() {
  telaMenu.style.display = "none";
  telaJogo.style.display = "block";

  // Começa tudo do zero (importante pra quando jogar uma segunda vez)
  recursos = RECURSOS_INICIAIS;
  vidaDoBatalhao = VIDA_INICIAL_DO_BATALHAO;
  jogoAcabou = false;
  ticksDePiscadaDaTrincheira = 0;
  listaDeInimigos = [];
  listaDeSoldados = [];
  ticksDoAviso = 0;
  tipoSelecionado = null;

  // Garante que não sobrou timer de uma partida anterior rodando
  clearInterval(timerDeSpawnDeInimigos);
  clearInterval(timerDoLoopDoJogo);

  desenharCenario();
  atualizarHUD();

  // A cada 2 segundos (2000 milissegundos), criamos um novo inimigo.
  timerDeSpawnDeInimigos = setInterval(criarInimigo, 2000);

  // Esse é o "loop do jogo": roda várias vezes por segundo
  timerDoLoopDoJogo = setInterval(atualizarJogo, 30);
}

botaoIniciar.addEventListener("click", iniciarPartida);


// =====================================================================
// 4) FUNÇÃO: VOLTAR PRO MENU (para os timers e mostra o menu de novo)
// =====================================================================
function voltarParaMenu() {
  clearInterval(timerDeSpawnDeInimigos);
  clearInterval(timerDoLoopDoJogo);
  telaJogo.style.display = "none";
  telaMenu.style.display = "block";
}

botaoMenu.addEventListener("click", voltarParaMenu);


// =====================================================================
// 5) FUNÇÃO: CRIAR UM INIMIGO NOVO
// =====================================================================
function criarInimigo() {
  var pistaSorteada = Math.floor(Math.random() * NUMERO_DE_PISTAS);

  var inimigo = {
    x: canvas.width,                // começa do lado direito da tela
    pista: pistaSorteada,
    velocidade: 1 + Math.random(),  // cada inimigo anda um pouco diferente
    largura: 34,
    altura: 34,

    // --- campos novos, usados no ataque ---
    ticksParaProximoTiro: TICKS_ATE_O_PRIMEIRO_TIRO + Math.floor(Math.random() * 15), // um pouco diferente pra cada um
    ticksDaAnimacaoDoTiro: 0        // > 0 significa "acabou de atirar"
  };

  listaDeInimigos.push(inimigo);
}


// =====================================================================
// 6) FUNÇÃO: ATUALIZAR O JOGO (chamada várias vezes por segundo)
// =====================================================================
function atualizarJogo() {
  moverInimigos();
  inimigosAtacam();

  atualizarAviso();

  desenharCenario();
  desenharGradeDoCampo();
  desenharSoldados();
  desenharTiros();
  desenharInimigos();
  desenharAviso();
  atualizarHUD();

  // Se a vida zerou durante esse frame, encerra a partida
  if (vidaDoBatalhao <= 0) {
    fimDeJogo();
  }
}


// =====================================================================
// 6.1) MOVER OS INIMIGOS
// =====================================================================
// Cada inimigo anda para a esquerda até chegar na distância de parada,
// ou até chegar perto do inimigo da frente (na mesma pista).
// Assim eles formam uma fila, e ninguém passa do da frente,
// mesmo sendo mais rápido.
function moverInimigos() {
  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];
    var frente = inimigoDaFrente(inimigo);

    var chegouNaParada = inimigo.x <= POSICAO_DA_TRINCHEIRA + DISTANCIA_DE_PARADA;
    var bloqueado = frente !== null && (inimigo.x - frente.x) <= ESPACO_ENTRE_INIMIGOS;

    if (!chegouNaParada && !bloqueado) {
      inimigo.x = inimigo.x - inimigo.velocidade;
    }

    // Trava de segurança: nunca deixa chegar mais perto que o espaço mínimo
    if (frente !== null && (inimigo.x - frente.x) < ESPACO_ENTRE_INIMIGOS) {
      inimigo.x = frente.x + ESPACO_ENTRE_INIMIGOS;
    }
  }
}

// Retorna o inimigo mais próximo à frente (mesma pista, mais perto da
// trincheira). Se não tem ninguém na frente, retorna null.
function inimigoDaFrente(inimigo) {
  var maisProximo = null;

  for (var j = 0; j < listaDeInimigos.length; j++) {
    var outro = listaDeInimigos[j];

    if (outro !== inimigo && outro.pista === inimigo.pista && outro.x < inimigo.x) {
      if (maisProximo === null || outro.x > maisProximo.x) {
        maisProximo = outro;
      }
    }
  }
  return maisProximo;
}


// =====================================================================
// 6.2) OS INIMIGOS ATACAM
// =====================================================================
// Todo inimigo que está dentro do alcance vai contando os ticks.
// Quando a contagem chega em zero, ele atira: o batalhão perde vida.
function inimigosAtacam() {
  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];

    // A animação do tiro vai apagando aos poucos
    if (inimigo.ticksDaAnimacaoDoTiro > 0) {
      inimigo.ticksDaAnimacaoDoTiro--;
    }

    var estaNoAlcance = inimigo.x <= POSICAO_DA_TRINCHEIRA + ALCANCE_DO_TIRO;
    if (!estaNoAlcance) {
      continue; // ainda longe demais, não atira
    }

    inimigo.ticksParaProximoTiro--;

    if (inimigo.ticksParaProximoTiro <= 0) {
      // PIM! Atirou.
      vidaDoBatalhao = vidaDoBatalhao - DANO_POR_TIRO;
      inimigo.ticksParaProximoTiro = TICKS_ENTRE_TIROS;
      inimigo.ticksDaAnimacaoDoTiro = TICKS_DA_ANIMACAO_DO_TIRO;
      ticksDePiscadaDaTrincheira = TICKS_DA_ANIMACAO_DO_TIRO;
    }
  }

  if (ticksDePiscadaDaTrincheira > 0) {
    ticksDePiscadaDaTrincheira--;
  }
}


// =====================================================================
// 6.3) FIM DE JOGO
// =====================================================================
function fimDeJogo() {
  jogoAcabou = true;

  // Para o spawn e o loop. O botão "Voltar ao menu" continua funcionando.
  clearInterval(timerDeSpawnDeInimigos);
  clearInterval(timerDoLoopDoJogo);

  // Tela escurecida por cima do campo
  contexto.fillStyle = "rgba(0, 0, 0, 0.75)";
  contexto.fillRect(0, 0, canvas.width, canvas.height);

  contexto.textAlign = "center";
  contexto.fillStyle = "#e74c3c";
  contexto.font = "bold 44px Verdana";
  contexto.fillText("O INIMIGO TOMOU SUA TRINCHEIRA!", canvas.width / 2, canvas.height / 2 - 10);

  contexto.fillStyle = "#ffffff";
  contexto.font = "20px Verdana";
  contexto.fillText("Clique em \"Voltar ao menu\" para tentar de novo", canvas.width / 2, canvas.height / 2 + 30);
  contexto.textAlign = "start";
}


// =====================================================================
// 7) FUNÇÃO: DESENHAR O CENÁRIO DE BATALHA
// =====================================================================
function desenharCenario() {
  // Chão / campo de batalha
  contexto.fillStyle = "#6b5b3a";
  contexto.fillRect(0, 0, canvas.width, canvas.height);

  // Linhas dividindo as pistas
  contexto.strokeStyle = "rgba(0,0,0,0.25)";
  for (var p = 1; p < NUMERO_DE_PISTAS; p++) {
    contexto.beginPath();
    contexto.moveTo(0, p * ALTURA_DA_PISTA);
    contexto.lineTo(canvas.width, p * ALTURA_DA_PISTA);
    contexto.stroke();
  }

  // Trincheira do jogador (faixa escura do lado esquerdo).
  // Quando leva um tiro, pisca em vermelho.
  if (ticksDePiscadaDaTrincheira > 0) {
    contexto.fillStyle = "#a93226";
  } else {
    contexto.fillStyle = "#3d3223";
  }
  contexto.fillRect(0, 0, POSICAO_DA_TRINCHEIRA, canvas.height);
}


// =====================================================================
// 8) FUNÇÃO: DESENHAR OS INIMIGOS NA TELA
// =====================================================================
function posicaoYDoInimigo(inimigo) {
  return (inimigo.pista * ALTURA_DA_PISTA) + (ALTURA_DA_PISTA / 2) - (inimigo.altura / 2);
}

function desenharInimigos() {
  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];
    var posicaoY = posicaoYDoInimigo(inimigo);

    // Corpo do inimigo
    contexto.fillStyle = "#c0392b";
    contexto.fillRect(inimigo.x, posicaoY, inimigo.largura, inimigo.altura);

    // Arma apontada para a trincheira (lado esquerdo)
    contexto.fillStyle = "#2c2c2c";
    contexto.fillRect(inimigo.x - 14, posicaoY + inimigo.altura / 2 - 3, 16, 6);

    // Clarão na boca da arma quando acabou de atirar
    if (inimigo.ticksDaAnimacaoDoTiro > 0) {
      contexto.fillStyle = "#ffeb3b";
      contexto.beginPath();
      contexto.arc(inimigo.x - 16, posicaoY + inimigo.altura / 2, 6, 0, Math.PI * 2);
      contexto.fill();
    }
  }
}

// Desenha a linha do tiro indo do inimigo até a trincheira
function desenharTiros() {
  contexto.strokeStyle = "#ffd54f";
  contexto.lineWidth = 2;

  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];

    if (inimigo.ticksDaAnimacaoDoTiro > 0) {
      var y = posicaoYDoInimigo(inimigo) + inimigo.altura / 2;
      contexto.beginPath();
      contexto.moveTo(inimigo.x - 16, y);
      contexto.lineTo(POSICAO_DA_TRINCHEIRA, y);
      contexto.stroke();
    }
  }

  contexto.lineWidth = 1;
}


// =====================================================================
// 10) USER STORY 2: POSICIONAR SOLDADOS
// =====================================================================

// Converte a posição do mouse na tela para a posição dentro do canvas.
// (o canvas pode aparecer menor que 900px, por causa do CSS)
function posicaoDoMouseNoCanvas(evento) {
  var caixa = canvas.getBoundingClientRect();
  return {
    x: (evento.clientX - caixa.left) * (canvas.width / caixa.width),
    y: (evento.clientY - caixa.top) * (canvas.height / caixa.height)
  };
}

// Descobre em qual casa da grade (pista + coluna) uma posição cai.
// Retorna null se estiver fora do campo dos soldados.
function celulaNaPosicao(x, y) {
  if (x < POSICAO_DA_TRINCHEIRA) {
    return null;
  }

  var coluna = Math.floor((x - POSICAO_DA_TRINCHEIRA) / LARGURA_DA_COLUNA);
  var pista = Math.floor(y / ALTURA_DA_PISTA);

  if (coluna >= NUMERO_DE_COLUNAS || pista < 0 || pista >= NUMERO_DE_PISTAS) {
    return null;
  }
  return { pista: pista, coluna: coluna };
}

// Retorna o soldado que está naquela casa, ou null se estiver vazia
function soldadoNaCelula(pista, coluna) {
  for (var i = 0; i < listaDeSoldados.length; i++) {
    if (listaDeSoldados[i].pista === pista && listaDeSoldados[i].coluna === coluna) {
      return listaDeSoldados[i];
    }
  }
  return null;
}

// Tenta posicionar o soldado selecionado na casa clicada
function posicionarSoldado(pista, coluna) {
  if (tipoSelecionado === null) {
    mostrarAviso("Selecione um soldado primeiro!");
    return;
  }

  if (soldadoNaCelula(pista, coluna) !== null) {
    mostrarAviso("Essa posição já está ocupada!");
    return;
  }

  if (recursos < tipoSelecionado.custo) {
    mostrarAviso("Suprimentos insuficientes!");
    return;
  }

  // Deu tudo certo: cobra o custo e coloca o soldado no campo.
  // (o soldado continua selecionado, pra dar pra posicionar vários seguidos)
  recursos = recursos - tipoSelecionado.custo;
  listaDeSoldados.push({
    tipo: tipoSelecionado.nome,
    pista: pista,
    coluna: coluna,
    vida: tipoSelecionado.vida
  });
  atualizarHUD();
}

// Clique no campo = tenta posicionar um soldado ali
canvas.addEventListener("click", function (evento) {
  if (jogoAcabou) {
    return;
  }
  var posicao = posicaoDoMouseNoCanvas(evento);
  var celula = celulaNaPosicao(posicao.x, posicao.y);

  if (celula !== null) {
    posicionarSoldado(celula.pista, celula.coluna);
  }
});

// Guarda onde o mouse está, pra destacar a casa embaixo dele
canvas.addEventListener("mousemove", function (evento) {
  var posicao = posicaoDoMouseNoCanvas(evento);
  mouseX = posicao.x;
  mouseY = posicao.y;
});

canvas.addEventListener("mouseleave", function () {
  mouseX = -1;
  mouseY = -1;
});

// ----- barra de seleção de soldados -----

// Cria uma carta (botão) na barra para cada tipo de soldado
function criarCartasDeSoldados() {
  for (var i = 0; i < TIPOS_DE_SOLDADO.length; i++) {
    var tipo = TIPOS_DE_SOLDADO[i];

    var botao = document.createElement("button");
    botao.className = "carta";
    botao.innerHTML = tipo.nome + "<small>Custo: " + tipo.custo + "</small>";

    // O "tipo" precisa ser guardado numa função própria, senão todos
    // os botões ficariam com o último tipo do for.
    botao.addEventListener("click", criarAcaoDeSelecionar(tipo));

    barraDeSoldados.appendChild(botao);
    cartasDeSoldados.push({ tipo: tipo, botao: botao });
  }
}

function criarAcaoDeSelecionar(tipo) {
  return function () {
    selecionarSoldado(tipo);
  };
}

// Clicar na carta seleciona. Clicar de novo na mesma carta desmarca.
function selecionarSoldado(tipo) {
  if (tipoSelecionado === tipo) {
    tipoSelecionado = null;
  } else {
    tipoSelecionado = tipo;
  }
  atualizarCartas();
}

// Marca a carta selecionada e deixa apagada a que o jogador não consegue pagar
function atualizarCartas() {
  for (var i = 0; i < cartasDeSoldados.length; i++) {
    var carta = cartasDeSoldados[i];
    carta.botao.classList.toggle("selecionado", tipoSelecionado === carta.tipo);
    carta.botao.classList.toggle("semSuprimento", recursos < carta.tipo.custo);
  }
}

// ESC ou botão direito do mouse: cancela a seleção
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    tipoSelecionado = null;
    atualizarCartas();
  }
});

canvas.addEventListener("contextmenu", function (evento) {
  evento.preventDefault();
  tipoSelecionado = null;
  atualizarCartas();
});

// ----- avisos na tela -----
function mostrarAviso(texto) {
  textoDoAviso = texto;
  ticksDoAviso = 60; // ~1,8 segundo
}

function atualizarAviso() {
  if (ticksDoAviso > 0) {
    ticksDoAviso--;
  }
}

function desenharAviso() {
  if (ticksDoAviso <= 0) {
    return;
  }
  contexto.fillStyle = "rgba(0, 0, 0, 0.75)";
  contexto.fillRect(canvas.width / 2 - 190, 10, 380, 40);

  contexto.fillStyle = "#ffd54f";
  contexto.font = "bold 20px Verdana";
  contexto.textAlign = "center";
  contexto.fillText(textoDoAviso, canvas.width / 2, 37);
  contexto.textAlign = "start";
}

// ----- desenho da grade e dos soldados -----

// Desenha a grade do campo INTEIRO com o mesmo padrão (casas em tom
// alternado), pra ficar tudo igual. Uma linha tracejada marca até onde
// dá pra posicionar soldados.
function desenharGradeDoCampo() {
  for (var p = 0; p < NUMERO_DE_PISTAS; p++) {
    for (var c = 0; c < NUMERO_DE_COLUNAS_DO_CAMPO; c++) {
      var x = POSICAO_DA_TRINCHEIRA + (c * LARGURA_DA_COLUNA);
      var y = p * ALTURA_DA_PISTA;

      if ((p + c) % 2 === 0) {
        contexto.fillStyle = "rgba(255, 255, 255, 0.06)";
      } else {
        contexto.fillStyle = "rgba(0, 0, 0, 0.10)";
      }
      contexto.fillRect(x, y, LARGURA_DA_COLUNA, ALTURA_DA_PISTA);
    }
  }

  // Limite da zona dos soldados
  var limiteX = POSICAO_DA_TRINCHEIRA + (NUMERO_DE_COLUNAS * LARGURA_DA_COLUNA);
  contexto.setLineDash([8, 6]);
  contexto.strokeStyle = "rgba(255, 255, 255, 0.35)";
  contexto.lineWidth = 2;
  contexto.beginPath();
  contexto.moveTo(limiteX, 0);
  contexto.lineTo(limiteX, canvas.height);
  contexto.stroke();
  contexto.setLineDash([]);
  contexto.lineWidth = 1;

  // Só mostra o destaque e a prévia se tem um soldado selecionado
  if (tipoSelecionado === null || jogoAcabou) {
    return;
  }

  var celula = celulaNaPosicao(mouseX, mouseY);
  if (celula === null) {
    return;
  }

  var casaLivre = soldadoNaCelula(celula.pista, celula.coluna) === null;
  var temSuprimento = recursos >= tipoSelecionado.custo;
  var casaX = POSICAO_DA_TRINCHEIRA + (celula.coluna * LARGURA_DA_COLUNA);
  var casaY = celula.pista * ALTURA_DA_PISTA;

  // Verde = pode posicionar, vermelho = não pode
  if (casaLivre && temSuprimento) {
    contexto.fillStyle = "rgba(46, 204, 113, 0.35)";
  } else {
    contexto.fillStyle = "rgba(231, 76, 60, 0.35)";
  }
  contexto.fillRect(casaX, casaY, LARGURA_DA_COLUNA, ALTURA_DA_PISTA);

  // Prévia (soldado "fantasma") mostrando como vai ficar
  if (casaLivre && temSuprimento) {
    contexto.globalAlpha = 0.55;
    desenharFuzileiro(casaX + (LARGURA_DA_COLUNA / 2), casaY + (ALTURA_DA_PISTA / 2));
    contexto.globalAlpha = 1;
  }
}

function desenharSoldados() {
  for (var i = 0; i < listaDeSoldados.length; i++) {
    var soldado = listaDeSoldados[i];
    // Centro da casa onde o soldado está
    var centroX = POSICAO_DA_TRINCHEIRA + (soldado.coluna * LARGURA_DA_COLUNA) + (LARGURA_DA_COLUNA / 2);
    var centroY = (soldado.pista * ALTURA_DA_PISTA) + (ALTURA_DA_PISTA / 2);
    desenharFuzileiro(centroX, centroY);
  }
}

// Desenha um Fuzileiro (capacete, corpo e fuzil apontando pra direita)
function desenharFuzileiro(cx, cy) {
  // Sombra
  contexto.fillStyle = "rgba(0, 0, 0, 0.25)";
  contexto.beginPath();
  contexto.ellipse(cx, cy + 28, 20, 6, 0, 0, Math.PI * 2);
  contexto.fill();

  // Pernas
  contexto.fillStyle = "#33691e";
  contexto.fillRect(cx - 11, cy + 14, 9, 14);
  contexto.fillRect(cx + 2, cy + 14, 9, 14);

  // Corpo (uniforme verde-oliva)
  contexto.fillStyle = "#4b5320";
  contexto.fillRect(cx - 13, cy - 6, 26, 24);

  // Fuzil
  contexto.fillStyle = "#3e2723";
  contexto.fillRect(cx + 6, cy + 2, 30, 6);
  contexto.fillStyle = "#212121";
  contexto.fillRect(cx + 32, cy, 6, 10);

  // Rosto
  contexto.fillStyle = "#d7b899";
  contexto.beginPath();
  contexto.arc(cx, cy - 14, 11, 0, Math.PI * 2);
  contexto.fill();

  // Capacete
  contexto.fillStyle = "#556b2f";
  contexto.beginPath();
  contexto.arc(cx, cy - 16, 12, Math.PI, 0);
  contexto.fill();
  contexto.fillRect(cx - 14, cy - 17, 28, 4);
}


// =====================================================================
// 9) FUNÇÃO: ATUALIZAR O HUD (as informações que aparecem em texto)
// =====================================================================
function atualizarHUD() {
  textoRecursos.textContent = recursos;
  textoInimigos.textContent = listaDeInimigos.length;
  textoVida.textContent = Math.max(0, vidaDoBatalhao);
  atualizarCartas();
}

// Cria as cartas da barra assim que o script carrega
criarCartasDeSoldados();

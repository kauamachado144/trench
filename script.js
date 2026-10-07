// =====================================================================
// TRENCH BROTHERS - script.js
// =====================================================================
// Este arquivo tem TODA a lógica do jogo. Ele cobre a primeira
// 
// Abaixo temos o que foi feito para se encaixar na user storie 1 somente


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


// =====================================================================
// 2) VARIÁVEIS DO JOGO
// =====================================================================

// Quantos "recursos" (suprimentos) o jogador tem no início da partida.
// Isso atende ao critério: "o jogador deve iniciar com os recursos
// definidos para aquela partida".
var RECURSOS_INICIAIS = 100;
var recursos = RECURSOS_INICIAIS;

// Lista com todos os inimigos que estão na tela agora
var listaDeInimigos = [];

// O campo de batalha é dividido em "pistas" (igual Plants vs Zombies),
// os inimigos andam da direita pra esquerda em uma dessas pistas.
var NUMERO_DE_PISTAS = 3;
var ALTURA_DA_PISTA = canvas.height / NUMERO_DE_PISTAS;

// Posição (no eixo X) onde fica a trincheira do jogador
var POSICAO_DA_TRINCHEIRA = 50;

// Guardam os "timers" do jogo, pra gente conseguir parar eles depois
// (por exemplo quando o jogador aperta "Voltar ao menu")
var timerDeSpawnDeInimigos = null;
var timerDoLoopDoJogo = null;


// =====================================================================
// 3) FUNÇÃO PRINCIPAL: INICIAR A PARTIDA
// =====================================================================
function iniciarPartida() {
  // Critério 1: permite iniciar uma nova partida.
  // Escondemos o menu e mostramos a tela do jogo.
  telaMenu.style.display = "none";
  telaJogo.style.display = "block";

  // Critério 4: o jogador começa com os recursos definidos.
  recursos = RECURSOS_INICIAIS;

  // Zera a lista de inimigos (caso seja uma nova partida depois de outra)
  listaDeInimigos = [];

  // Critério 2: mostra o cenário de batalha assim que a partida começa.
  desenharCenario();
  atualizarHUD();

  // Critério 3: os inimigos começam a aparecer depois do início da partida.
  // A cada 2 segundos (2000 milissegundos), criamos um novo inimigo.
  timerDeSpawnDeInimigos = setInterval(criarInimigo, 2000);

  // Esse é o "loop do jogo": ele roda várias vezes por segundo pra
  // mover os inimigos e redesenhar a tela.
  timerDoLoopDoJogo = setInterval(atualizarJogo, 30);
}

// Quando clicar no botão "Iniciar Partida", chama a função acima
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
  // Escolhe em qual pista (0, 1 ou 2) o inimigo vai andar
  var pistaSorteada = Math.floor(Math.random() * NUMERO_DE_PISTAS);

  // Um inimigo é só um "objeto" simples guardando as informações dele
  var inimigo = {
    x: canvas.width,                // começa do lado direito da tela
    pista: pistaSorteada,
    velocidade: 1 + Math.random(),  // cada inimigo anda um pouco diferente
    largura: 34,
    altura: 34
  };

  listaDeInimigos.push(inimigo);
}


// =====================================================================
// 6) FUNÇÃO: ATUALIZAR O JOGO (chamada várias vezes por segundo)
// =====================================================================
function atualizarJogo() {
  moverInimigos();
  desenharCenario();
  desenharInimigos();
  atualizarHUD();
}

// Move cada inimigo um pouquinho para a esquerda
function moverInimigos() {
  for (var i = 0; i < listaDeInimigos.length; i++) {
    listaDeInimigos[i].x = listaDeInimigos[i].x - listaDeInimigos[i].velocidade;
  }

  // Remove da lista os inimigos que já chegaram na trincheira.
  // (o combate/dano vai ser feito em outra user story, por enquanto
  // eles só somem quando chegam perto do jogador)
  listaDeInimigos = listaDeInimigos.filter(function (inimigo) {
    return inimigo.x > POSICAO_DA_TRINCHEIRA;
  });
}


// =====================================================================
// 7) FUNÇÃO: DESENHAR O CENÁRIO DE BATALHA
// =====================================================================
function desenharCenario() {
  // Chão / campo de batalha
  contexto.fillStyle = "#6b5b3a";
  contexto.fillRect(0, 0, canvas.width, canvas.height);

  // Linhas dividindo as pistas, só pra ficar mais fácil de visualizar
  contexto.strokeStyle = "rgba(0,0,0,0.25)";
  for (var p = 1; p < NUMERO_DE_PISTAS; p++) {
    contexto.beginPath();
    contexto.moveTo(0, p * ALTURA_DA_PISTA);
    contexto.lineTo(canvas.width, p * ALTURA_DA_PISTA);
    contexto.stroke();
  }

  // Trincheira do jogador (faixa escura do lado esquerdo)
  contexto.fillStyle = "#3d3223";
  contexto.fillRect(0, 0, POSICAO_DA_TRINCHEIRA, canvas.height);
}


// =====================================================================
// 8) FUNÇÃO: DESENHAR OS INIMIGOS NA TELA
// =====================================================================
function desenharInimigos() {
  contexto.fillStyle = "#c0392b";
  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];
    var posicaoY = (inimigo.pista * ALTURA_DA_PISTA) + (ALTURA_DA_PISTA / 2) - (inimigo.altura / 2);
    contexto.fillRect(inimigo.x, posicaoY, inimigo.largura, inimigo.altura);
  }
}


// =====================================================================
// 9) FUNÇÃO: ATUALIZAR O HUD (as informações que aparecem em texto)
// =====================================================================
function atualizarHUD() {
  textoRecursos.textContent = recursos;
  textoInimigos.textContent = listaDeInimigos.length;
}

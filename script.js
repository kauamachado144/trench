// =====================================================================
// TRENCH BROTHERS - script.js
// =====================================================================
// Este arquivo tem TODA a lógica do jogo.
//
// User story 1: iniciar partida, cenário, inimigos aparecendo, recursos.
// Inimigos ATACAM a trincheira (batalhão tem vida).
// User story 2: posicionar soldados no campo (agora com 5 pistas).
// User stories 3 e 4: soldados atiram, inimigos morrem e dão XP.
// Poder especial: o BOMBARDEIO, que carrega com o XP.
// Os desenhos (pixel art) ficam no arquivo sprites.js.


// =====================================================================
// 1) Aqui puxamos os elementos do HTML
// =====================================================================
var telaMenu       = document.getElementById("telaMenu");
var telaJogo       = document.getElementById("telaJogo");
var botaoIniciar   = document.getElementById("botaoIniciar");
var botaoMenu      = document.getElementById("botaoMenu");
var botaoReiniciar = document.getElementById("botaoReiniciar");
var botaoReiniciar = document.getElementById("botaoReiniciar");
var canvas         = document.getElementById("canvasJogo");
// ----- BATALHÃO: a área atrás da trincheira, onde ficam as torres de vigia -----
// O canvas ganha essa largura a mais, do lado esquerdo (168 = 56 pixels de pixel art).
var ZONA_DO_BATALHAO = 168;
canvas.width = canvas.width + ZONA_DO_BATALHAO;

var contexto       = canvas.getContext("2d"); // é com o "contexto" que a gente desenha no canvas
contexto.imageSmoothingEnabled = false;           // pixel art: nada de imagem borrada
var textoRecursos  = document.getElementById("valorRecursos");
var textoInimigos  = document.getElementById("valorInimigos");
var textoVida      = document.getElementById("valorVida");
var barraDeSoldados = document.getElementById("barraDeSoldados");
var textoXP         = document.getElementById("valorXP");
var botaoBombardeio = document.getElementById("botaoBombardeio");
var textoDoPoder    = document.getElementById("textoDoPoder");
var botaoMina       = document.getElementById("botaoMina");
var textoDaMina     = document.getElementById("textoDaMina");
var barraDeMelhorias = document.getElementById("barraDeMelhorias");   // NOVO US4


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
// (48 e 84 são múltiplos de 3, a escala da pixel art: assim a grade encaixa certinho nos pixels)
var POSICAO_DA_TRINCHEIRA = ZONA_DO_BATALHAO + 48;   // o batalhão fica antes (à esquerda) da trincheira

// ----- CONFIGURAÇÕES DOS SOLDADOS (User story 2) -----

// O campo onde dá pra posicionar soldados é uma grade:
// NUMERO_DE_PISTAS linhas x NUMERO_DE_COLUNAS colunas, começando na trincheira.
var NUMERO_DE_COLUNAS = 4;
var LARGURA_DA_COLUNA = 84;

// O campo inteiro (soldados + terra de ninguém) usa casas do mesmo tamanho.
// (900 - 48) / 84 = 10 colunas (sobram 12 pixels, que ficam atrás do arame farpado).
var NUMERO_DE_COLUNAS_DO_CAMPO = Math.floor((canvas.width - POSICAO_DA_TRINCHEIRA) / LARGURA_DA_COLUNA);

// Tipos de soldado que dá pra escolher na barra (valores da tabela do Trello).
// Pra adicionar um soldado novo, é só colocar mais um item aqui.
// dano = quanto de vida o tiro tira do inimigo (inimigo tem 100 de vida)
// ticksEntreTiros = tempo entre um tiro e outro (30 ticks = ~1 segundo)
// camada = "frente" (atiradores) ou "atras" (torres de apoio). Cada casa do campo
// aceita UM de cada camada: um soldado na frente e uma torre atrás dele.
// velocidade = velocidade da bala (se não tiver, usa VELOCIDADE_DO_PROJETIL)
// vida = RESISTÊNCIA do soldado. Os inimigos atiram nos soldados da pista ANTES
// de acertar a trincheira. Fuzileiro (150) é médio, Cabo (250) é mais blindado,
// Torre de apoio (400) é a mais resistente (sacos de areia) e o Sniper (80) é frágil.
var TIPOS_DE_SOLDADO = [
  { id: "fuzileiro", nome: "Fuzileiro", custo: 100, vida: 150, icone: SPRITE_ICONE_SOLDADO,
    dano: 25, ticksEntreTiros: 36, camada: "frente" },
  { id: "cabo", nome: "Cabo", custo: 150, vida: 250, icone: SPRITE_ICONE_CABO,
    dano: 30, ticksEntreTiros: 36, camada: "frente" },
  { id: "torre", nome: "Torre", custo: 75, vida: 400, icone: SPRITE_ICONE_TORRE,
    dano: 8, ticksEntreTiros: 48, camada: "atras" },  // dano baixo, só para apoiar os atiradores
  // Sniper: fica nas TORRES DE VIGIA do batalhão (atrás da trincheira), uma por pista.
  // Atira devagar, mas forte e com a bala bem rápida. (local: "vigia" = só pode ir nas torres)
  { id: "sniper", nome: "Sniper", custo: 150, vida: 80, icone: SPRITE_ICONE_SNIPER,
    dano: 60, ticksEntreTiros: 90, velocidade: 16, camada: "vigia", local: "vigia" }
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
// (o sprite do inimigo tem 90 de largura, mas o corpo dele é bem mais estreito)
var ESPACO_ENTRE_INIMIGOS = 70;

// Quanto de vida cada tiro tira do batalhão
var DANO_POR_TIRO = 1;

// Tempo entre um tiro e outro. O loop roda a cada 30ms,
// então 60 "ticks" = 1,8 segundos.
var TICKS_ENTRE_TIROS = 60;

// Por quantos ticks a animação do tiro (a linha amarela) fica na tela
var TICKS_DA_ANIMACAO_DO_TIRO = 6;

// Quantos ticks a trincheira fica piscando em vermelho depois de levar um tiro
var ticksDePiscadaDaTrincheira = 0;

// ----- PIXEL ART -----

// Cada pixel dos sprites (sprites.js) vira um quadrado 3x3 na tela
var ESCALA_DO_PIXEL = 3;

// Imagens prontas (criadas UMA vez, aqui, e só coladas na tela depois)
var imagemSoldado        = criarImagemDoSprite(SPRITE_SOLDADO, ESCALA_DO_PIXEL, false, false);
var imagemCabo           = criarImagemDoSprite(SPRITE_CABO, ESCALA_DO_PIXEL, false, false);
var imagemMina           = criarImagemDoSprite(SPRITE_MINA, ESCALA_DO_PIXEL, false, false);
var imagemTorre          = criarImagemDoSprite(SPRITE_TORRE, ESCALA_DO_PIXEL, false, false);
var imagemSniper         = criarImagemDoSprite(SPRITE_TORRE_SNIPER, ESCALA_DO_PIXEL, false, false);
var imagemInimigo        = criarImagemDoSprite(SPRITE_INIMIGO, ESCALA_DO_PIXEL, true, false);   // espelhado: olha pra esquerda
var imagemInimigoDano    = criarImagemDoSprite(SPRITE_INIMIGO, ESCALA_DO_PIXEL, true, true);    // versão branca (levou tiro)
var imagemInimigoCabo    = criarImagemDoSprite(SPRITE_INIMIGO_CABO, ESCALA_DO_PIXEL, true, false);   // NOVO US4: capacete vermelho
var imagemBomba          = criarImagemDoSprite(SPRITE_BOMBA, ESCALA_DO_PIXEL, false, false);
var quadrosExplosaoGrande  = criarQuadrosDaExplosao(6);  // bombardeio
var quadrosExplosaoPequena = criarQuadrosDaExplosao(2);  // inimigo morrendo

// O campo de batalha (lama, trincheira, arame farpado...) é desenhado UMA vez só
var imagemDoCenario = criarImagemDoCenario(ESCALA_DO_PIXEL, canvas.width - ZONA_DO_BATALHAO, canvas.height,
                                           POSICAO_DA_TRINCHEIRA - ZONA_DO_BATALHAO, ALTURA_DA_PISTA,
                                           NUMERO_DE_PISTAS, LARGURA_DA_COLUNA);

// A área do batalhão (acampamento + uma torre de vigia por pista), também desenhada UMA vez só
var X_DA_TORRE_DO_BATALHAO = (ZONA_DO_BATALHAO - (30 * ESCALA_DO_PIXEL)) / 2;   // centraliza a torre
var imagemDoBatalhao = criarImagemDoBatalhao(ESCALA_DO_PIXEL, ZONA_DO_BATALHAO, canvas.height,
                                             ALTURA_DA_PISTA, NUMERO_DE_PISTAS, X_DA_TORRE_DO_BATALHAO);

// Coloca um ícone de pixel art dentro de um elemento do HTML
function colocarIcone(idDoElemento, sprite, escala, espelhar) {
  var elemento = document.getElementById(idDoElemento);
  elemento.appendChild(criarImagemDoSprite(sprite, escala, espelhar, false));
}
colocarIcone("iconeSuprimentos", SPRITE_ESTRELA, 2, false);
colocarIcone("iconeVida", SPRITE_CORACAO, 2, false);
colocarIcone("iconeXP", SPRITE_PATENTE, 2, false);
colocarIcone("iconeInimigos", SPRITE_ICONE_INIMIGO, 1, true);
colocarIcone("iconeDoPoder", SPRITE_BOMBA, 2, false);
colocarIcone("iconeDaMina", SPRITE_MINA, 2, false);

// Medidas do sprite e pontos importantes dele (em pixels da tela)
var LARGURA_DO_SPRITE = 30 * ESCALA_DO_PIXEL;
var DESLOCAMENTO_DO_SPRITE_X = Math.round((LARGURA_DA_COLUNA - LARGURA_DO_SPRITE) / 2);   // centraliza o sprite na casa
var BOCA_DA_ARMA_X = 29 * ESCALA_DO_PIXEL;         // onde sai o tiro do soldado (a partir da esquerda do sprite)
var BOCA_DA_ARMA_Y = 19 * ESCALA_DO_PIXEL;         // altura da arma (a partir do topo do sprite)
var DESLOCAMENTO_DA_TORRE_X = -2 * ESCALA_DO_PIXEL;   // a torre fica um pouco pra esquerda do soldado
var BOCA_DA_TORRE_X = (29 * ESCALA_DO_PIXEL) + DESLOCAMENTO_DA_TORRE_X;
var BOCA_DA_TORRE_Y = 8 * ESCALA_DO_PIXEL;         // a arma da torre fica mais alta (atirador na plataforma)
var BOCA_DO_SNIPER_X = 29 * ESCALA_DO_PIXEL;       // o sniper atira da torre de vigia do batalhão
var BOCA_DO_SNIPER_Y = 8 * ESCALA_DO_PIXEL;
var BOCA_DO_INIMIGO_X = 1 * ESCALA_DO_PIXEL;       // o inimigo é espelhado, então a arma fica à esquerda
var HITBOX_ESQUERDA_DO_INIMIGO = 21;               // parte do sprite que leva tiro (o corpo)
var HITBOX_DIREITA_DO_INIMIGO = 66;

// ----- COMBATE (user stories 3 e 4) -----

var VIDA_DO_INIMIGO = 100;
var VELOCIDADE_DO_PROJETIL = 9;         // pixels por tick
var XP_POR_INIMIGO = 10;                // XP ganho por inimigo derrotado

// NOVO US4: tipos de inimigo. Cada um dá um XP diferente quando morre.
// O soldado usa os valores de cima. chance = chance de aparecer (as chances somam 1).
var TIPOS_DE_INIMIGO = [
  { id: "soldado", vida: VIDA_DO_INIMIGO,     xp: XP_POR_INIMIGO, chance: 0.75, danoNoSoldado: 25 },
  { id: "cabo",    vida: VIDA_DO_INIMIGO * 2, xp: 25,             chance: 0.25, danoNoSoldado: 40 }   // aguenta o dobro e paga mais XP
];

// NOVO US4: MELHORIAS. O jogador gasta o XP aqui.
// custo = XP do 1º nível (cada nível seguinte custa custo x o nível que vai comprar)
var MELHORIAS = [
  { id: "municao",  nome: "Munição",  descricao: "+5 de dano",     custo: 40, maximo: 3, nivel: 0 },
  { id: "cadencia", nome: "Cadência", descricao: "tiro mais rápido", custo: 40, maximo: 3, nivel: 0 },
  { id: "reforco",  nome: "Reforço",  descricao: "+2 de vida",     custo: 50, maximo: 3, nivel: 0 }
];
var BONUS_DE_DANO_POR_NIVEL = 5;   // dano que a Munição soma por nível
var TICKS_A_MENOS_POR_NIVEL = 4;   // quanto a Cadência diminui o tempo entre tiros, por nível
var VIDA_DO_REFORCO = 2;           // vida que o Reforço devolve pro batalhão na hora
var cartasDeMelhorias = [];        // os botões das melhorias

// ----- PODER ESPECIAL: BOMBARDEIO -----

var CARGAS_INICIAIS = 0;                // quantas cargas o jogador já começa tendo
var MAXIMO_DE_CARGAS = 3;
var XP_POR_CARGA = 50;                  // a cada 50 XP o jogador ganha 1 carga
var DANO_DO_BOMBARDEIO = 300;
var RAIO_DA_EXPLOSAO = 90;              // pixels em volta de onde a bomba cai

var xp = 0;
var cargasDoBombardeio = CARGAS_INICIAIS;
var progressoDaCarga = 0;               // XP acumulado rumo à próxima carga

// ----- PODER ESPECIAL: MINA (desbloqueado ao posicionar um Cabo) -----
var XP_POR_CARGA_DA_MINA = 40;
var MAXIMO_DE_CARGAS_DA_MINA = 3;
var CARGAS_INICIAIS_DA_MINA = 0;
var TICKS_PARA_ARMAR_MINA = 30;
var DANO_DA_MINA = 200;
var RAIO_DA_MINA = 80;
var MAXIMO_DE_MINAS = 6;
var COLUNA_MINIMA_DA_MINA = NUMERO_DE_COLUNAS + 1;
var COLUNA_MAXIMA_DA_MINA = NUMERO_DE_COLUNAS_DO_CAMPO - 2;
var cargasDaMina = CARGAS_INICIAIS_DA_MINA;
var progressoDaCargaDaMina = 0;
var modoMina = false;
var listaDeMinas = [];

// Conversão de XP em suprimentos: a cada 10 XP recebidos, ganhe 25 suprimentos.
var XP_PARA_DINHEIRO = 10;
var DINHEIRO_POR_CONVERSAO = 25;
var progressoDaConversao = 0;

// Listas de coisas que estão acontecendo na tela agora
var listaDeProjeteis = [];     // tiros dos soldados
var listaDeBombas = [];        // bombas caindo
var listaDeExplosoes = [];     // explosões animadas
var listaDeTextosFlutuantes = [];  // "+10 XP" subindo
var ticksDeFlash = 0;          // clarão branco na tela quando a bomba explode

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
  xp = 0;
  cargasDoBombardeio = CARGAS_INICIAIS;
  progressoDaCarga = 0;
  cargasDaMina = CARGAS_INICIAIS_DA_MINA;
  progressoDaCargaDaMina = 0;
  modoMina = false;
  listaDeMinas = [];
  progressoDaConversao = 0;
  listaDeProjeteis = [];
  listaDeBombas = [];
  listaDeExplosoes = [];
  listaDeTextosFlutuantes = [];
  ticksDeFlash = 0;

  // NOVO US4: melhorias voltam pro nível 0
  for (var m = 0; m < MELHORIAS.length; m++) {
    MELHORIAS[m].nivel = 0;
  }

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

// Reiniciar: recomeça a partida do zero sem passar pelo menu
// (iniciarPartida já zera tudo e para os timers da partida anterior)
botaoReiniciar.addEventListener("click", iniciarPartida);


// =====================================================================
// 5) FUNÇÃO: CRIAR UM INIMIGO NOVO
// =====================================================================
// NOVO US4: sorteia o tipo do inimigo olhando a chance de cada um
function sortearTipoDeInimigo() {
  var sorteio = Math.random();
  var soma = 0;
  for (var i = 0; i < TIPOS_DE_INIMIGO.length; i++) {
    soma = soma + TIPOS_DE_INIMIGO[i].chance;
    if (sorteio < soma) {
      return TIPOS_DE_INIMIGO[i];
    }
  }
  return TIPOS_DE_INIMIGO[0];
}

function criarInimigo() {
  var pistaSorteada = Math.floor(Math.random() * NUMERO_DE_PISTAS);
  var tipo = sortearTipoDeInimigo();   // NOVO US4

  var inimigo = {
    tipo: tipo.id,                  // NOVO US4
    xp: tipo.xp,                    // NOVO US4: XP que ele dá quando morre
    x: canvas.width,                // começa do lado direito da tela
    pista: pistaSorteada,
    velocidade: 1 + Math.random(),  // cada inimigo anda um pouco diferente
    largura: LARGURA_DO_SPRITE,     // 90 (o tamanho do desenho)
    altura: ALTURA_DA_PISTA,        // o sprite ocupa a pista inteira
    vida: tipo.vida,
    danoNoSoldado: tipo.danoNoSoldado,   // dano que o tiro dele causa num soldado
    xDoAlvo: POSICAO_DA_TRINCHEIRA,      // até onde o tiro vai (pro desenho)
    ticksDeImpacto: 0,              // > 0 = acabou de levar um tiro (pisca branco)
    andando: true,

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
  soldadosAtacam();
  moverProjeteis();
  atualizarMinas();
  atualizarBombas();
  removerInimigosMortos();
  atualizarEfeitos();

  atualizarAviso();

  desenharCenario();
  desenharGradeDoCampo();
  desenharMinas();
  desenharSoldados();
  desenharProjeteis();
  desenharTiros();
  desenharInimigos();
  desenharBombas();
  desenharExplosoes();
  desenharTextosFlutuantes();
  desenharFlash();
  desenharPreviaDaMina();
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

    inimigo.andando = (!chegouNaParada && !bloqueado);
    if (inimigo.andando) {
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
      // PIM! Atirou. Primeiro acerta o soldado mais próximo na pista;
      // só se a pista estiver vazia é que a trincheira leva o dano.
      var alvo = soldadoAlvoDoInimigo(inimigo);
      if (alvo !== null) {
        alvo.vida = alvo.vida - inimigo.danoNoSoldado;
        alvo.ticksDeImpacto = TICKS_DA_ANIMACAO_DO_TIRO;
        inimigo.xDoAlvo = xDoSprite(alvo) + LARGURA_DO_SPRITE / 2;
      } else {
        vidaDoBatalhao = vidaDoBatalhao - DANO_POR_TIRO;
        inimigo.xDoAlvo = POSICAO_DA_TRINCHEIRA;
        ticksDePiscadaDaTrincheira = TICKS_DA_ANIMACAO_DO_TIRO;
      }
      inimigo.ticksParaProximoTiro = TICKS_ENTRE_TIROS;
      inimigo.ticksDaAnimacaoDoTiro = TICKS_DA_ANIMACAO_DO_TIRO;
    }
  }

  removerSoldadosMortos();

  if (ticksDePiscadaDaTrincheira > 0) {
    ticksDePiscadaDaTrincheira--;
  }
}


// Escolhe qual soldado o inimigo acerta: o mais perto dele na mesma pista.
// Na mesma casa, o atirador (frente) protege a torre (atrás).
// O sniper do batalhão é o último a levar tiro.
function soldadoAlvoDoInimigo(inimigo) {
  var ordemDaCamada = { frente: 2, atras: 1, vigia: 0 };
  var melhor = null;
  for (var i = 0; i < listaDeSoldados.length; i++) {
    var s = listaDeSoldados[i];
    if (s.pista !== inimigo.pista || s.vida <= 0) { continue; }
    if (melhor === null || s.coluna > melhor.coluna ||
        (s.coluna === melhor.coluna && ordemDaCamada[s.camada] > ordemDaCamada[melhor.camada])) {
      melhor = s;
    }
  }
  return melhor;
}

// Tira do campo os soldados que ficaram sem vida
function removerSoldadosMortos() {
  for (var i = listaDeSoldados.length - 1; i >= 0; i--) {
    var s = listaDeSoldados[i];
    if (s.ticksDeImpacto > 0) { s.ticksDeImpacto--; }
    if (s.vida <= 0) {
      listaDeExplosoes.push({ x: xDoSprite(s) + LARGURA_DO_SPRITE / 2,
                              y: yDaPista(s.pista) + ALTURA_DA_PISTA / 2, ticks: 0, grande: false });
      mostrarAviso(s.tipo + " caiu em combate!");
      listaDeSoldados.splice(i, 1);
    }
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
  // O campo de batalha em pixel art (já desenhado lá no começo)
  contexto.drawImage(imagemDoBatalhao, 0, 0);
  contexto.drawImage(imagemDoCenario, ZONA_DO_BATALHAO, 0);

  // Quando a trincheira leva um tiro, ela pisca em vermelho
  if (ticksDePiscadaDaTrincheira > 0) {
    contexto.fillStyle = "rgba(200, 40, 30, 0.55)";
    contexto.fillRect(ZONA_DO_BATALHAO, 0, POSICAO_DA_TRINCHEIRA - ZONA_DO_BATALHAO, canvas.height);
  }
}


// =====================================================================
// 8) FUNÇÃO: DESENHAR OS INIMIGOS NA TELA
// =====================================================================
function posicaoYDoInimigo(inimigo) {
  // Se o inimigo está andando, ele "balança" 3px pra cima de tempos em tempos (passinhos)
  var balanco = 0;
  if (inimigo.andando && Math.floor(inimigo.x / 8) % 2 === 0) {
    balanco = -ESCALA_DO_PIXEL;
  }
  return (inimigo.pista * ALTURA_DA_PISTA) + balanco;
}

// Onde sai o tiro do inimigo
function bocaDoInimigoX(inimigo) { return inimigo.x + BOCA_DO_INIMIGO_X; }
function bocaDoInimigoY(inimigo) { return (inimigo.pista * ALTURA_DA_PISTA) + BOCA_DA_ARMA_Y; }

// NOVO US4: cada tipo de inimigo tem o seu desenho
function imagemDoInimigo(inimigo) {
  if (inimigo.tipo === "cabo") { return imagemInimigoCabo; }
  return imagemInimigo;
}

function desenharInimigos() {
  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];
    var posicaoY = posicaoYDoInimigo(inimigo);

    // Sombrinha no chão
    contexto.fillStyle = "rgba(0, 0, 0, 0.28)";
    contexto.fillRect(inimigo.x + 24, (inimigo.pista * ALTURA_DA_PISTA) + ALTURA_DA_PISTA - 6, 42, 6);

    // Sprite (fica branco por um instante quando leva um tiro)
    if (inimigo.ticksDeImpacto > 0) {
      contexto.drawImage(imagemInimigoDano, inimigo.x, posicaoY);
    } else {
      contexto.drawImage(imagemDoInimigo(inimigo), inimigo.x, posicaoY);
    }

    // Clarão na boca da arma quando acabou de atirar
    if (inimigo.ticksDaAnimacaoDoTiro > 0) {
      var bx = bocaDoInimigoX(inimigo);
      var by = bocaDoInimigoY(inimigo);
      contexto.fillStyle = "#fff3b0";
      contexto.fillRect(bx - 12, by - 6, 12, 12);
      contexto.fillStyle = "#ffc107";
      contexto.fillRect(bx - 18, by - 3, 6, 6);
      contexto.fillRect(bx - 9, by - 12, 3, 6);
      contexto.fillRect(bx - 9, by + 6, 3, 6);
    }
  }
}

// Desenha o tiro do inimigo indo até a trincheira (tracinhos amarelos)
function desenharTiros() {
  contexto.fillStyle = "#ffd54f";

  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];

    if (inimigo.ticksDaAnimacaoDoTiro > 0) {
      var y = bocaDoInimigoY(inimigo);
      for (var x = bocaDoInimigoX(inimigo) - 24; x > inimigo.xDoAlvo; x -= 15) {
        contexto.fillRect(x, y - 1, 6, 3);
      }
    }
  }
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
function soldadoNaCelula(pista, coluna, camada) {
  for (var i = 0; i < listaDeSoldados.length; i++) {
    if (listaDeSoldados[i].pista === pista && listaDeSoldados[i].coluna === coluna &&
        listaDeSoldados[i].camada === camada) {
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

  if (tipoSelecionado.local === "vigia") {
    mostrarAviso("O sniper só fica nas torres do batalhão!");
    return;
  }

  if (soldadoNaCelula(pista, coluna, tipoSelecionado.camada) !== null) {
    mostrarAviso("Essa posição já está ocupada!");
    return;
  }

  if (recursos < tipoSelecionado.custo) {
    mostrarAviso("Suprimentos insuficientes!");
    return;
  }

  // Deu tudo certo: cobra o custo e coloca o soldado no campo.
  // (o soldado continua selecionado, pra dar pra posicionar vários seguidos)
  criarSoldadoNoCampo(tipoSelecionado, pista, coluna);
}

// Cobra o custo e coloca o soldado na lista (coluna -1 = torre de vigia do batalhão)
function criarSoldadoNoCampo(tipo, pista, coluna) {
  recursos = recursos - tipo.custo;
  listaDeSoldados.push({
    tipo: tipo.nome,
    id: tipo.id,
    camada: tipo.camada,
    pista: pista,
    coluna: coluna,
    vida: tipo.vida,
    vidaMaxima: tipo.vida,
    ticksDeImpacto: 0,         // > 0 = acabou de levar tiro (pisca vermelho)
    dano: tipo.dano,
    ticksEntreTiros: tipo.ticksEntreTiros,
    velocidade: tipo.velocidade || VELOCIDADE_DO_PROJETIL,
    ticksParaProximoTiro: 0,   // 0 = pronto pra atirar assim que aparecer um inimigo
    ticksDeRecuo: 0            // > 0 = acabou de atirar (dá um tranco pra trás)
  });
  mostrarAviso(tipo.nome + " comprado! -" + tipo.custo);   // NOVO US5: avisa que a compra foi feita e o custo
  atualizarHUD();
}

// Tenta posicionar um sniper na torre de vigia do batalhão (uma por pista)
function posicionarNaTorreDeVigia(pista) {
  if (tipoSelecionado === null) {
    mostrarAviso("Selecione um soldado primeiro!");
    return;
  }

  if (tipoSelecionado.local !== "vigia") {
    mostrarAviso("As torres do batalhão são só pra snipers!");
    return;
  }

  if (soldadoNaCelula(pista, -1, "vigia") !== null) {
    mostrarAviso("Essa torre já tem um sniper!");
    return;
  }

  if (recursos < tipoSelecionado.custo) {
    mostrarAviso("Suprimentos insuficientes!");
    return;
  }

  criarSoldadoNoCampo(tipoSelecionado, pista, -1);
}

// Clique no campo = tenta posicionar um soldado ali
canvas.addEventListener("click", function (evento) {
  if (jogoAcabou) {
    return;
  }
  var posicao = posicaoDoMouseNoCanvas(evento);

  // No modo mina, o clique tenta plantar no campo inimigo.
  if (modoMina) {
    var celulaMina = celulaDoCampoNaPosicao(posicao.x, posicao.y);
    if (celulaMina !== null) {
      plantarMinaNaCasa(celulaMina.pista, celulaMina.coluna);
    } else {
      mostrarAviso("Plante a mina no campo inimigo!");
    }
    return;
  }

  // Clique na área do batalhão = tenta colocar um sniper na torre dessa pista
  if (posicao.x < ZONA_DO_BATALHAO) {
    var pistaDaTorre = Math.floor(posicao.y / ALTURA_DA_PISTA);
    if (pistaDaTorre >= 0 && pistaDaTorre < NUMERO_DE_PISTAS) {
      posicionarNaTorreDeVigia(pistaDaTorre);
    }
    return;
  }

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

    var icone = criarImagemDoSprite(tipo.icone, 2, false, false);
    var texto = document.createElement("span");
    texto.className = "textoDaCarta";
    texto.innerHTML = tipo.nome + "<small>Custo: " + tipo.custo + " · Vida: " + tipo.vida + "</small>";
    botao.appendChild(icone);
    botao.appendChild(texto);

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
    modoMina = false;
    atualizarBotaoDaMina();
    atualizarCartas();
  }
  if (evento.key === "b" || evento.key === "B") {
    acionarBombardeio();
  }
  if (evento.key === "m" || evento.key === "M") {
    acionarMina();
  }
});

botaoBombardeio.addEventListener("click", acionarBombardeio);
botaoMina.addEventListener("click", acionarMina);

canvas.addEventListener("contextmenu", function (evento) {
  evento.preventDefault();
  tipoSelecionado = null;
  modoMina = false;
  atualizarBotaoDaMina();
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

// Imagem, posição da arma e deslocamento de cada tipo (torre e sniper têm desenho e arma próprios)
function imagemDoTipo(id) {
  if (id === "cabo") { return imagemCabo; }
  if (id === "torre") { return imagemTorre; }
  if (id === "sniper") { return imagemSniper; }
  return imagemSoldado;
}
function deslocamentoXDoTipo(id) {
  if (id === "torre") { return DESLOCAMENTO_DO_SPRITE_X + DESLOCAMENTO_DA_TORRE_X; }
  if (id === "sniper") { return 0; }
  return DESLOCAMENTO_DO_SPRITE_X;
}
// Onde (em X) começa o desenho do soldado: o sniper fica na torre do batalhão, os outros na grade
function xDoSprite(soldado) {
  if (soldado.id === "sniper") { return X_DA_TORRE_DO_BATALHAO; }
  return xDaCasa(soldado.coluna) + deslocamentoXDoTipo(soldado.id);
}
function bocaXDoSoldado(soldado) {
  if (soldado.id === "sniper") { return X_DA_TORRE_DO_BATALHAO + BOCA_DO_SNIPER_X; }
  return xDaCasa(soldado.coluna) + (soldado.id === "torre" ? BOCA_DA_TORRE_X : BOCA_DA_ARMA_X);
}
function bocaYDoSoldado(soldado) {
  if (soldado.id === "sniper") { return yDaPista(soldado.pista) + BOCA_DO_SNIPER_Y; }
  return yDaPista(soldado.pista) + (soldado.id === "torre" ? BOCA_DA_TORRE_Y : BOCA_DA_ARMA_Y);
}

// Desenha a grade do campo INTEIRO com o mesmo padrão (casas em tom
// alternado), pra ficar tudo igual. Uma linha tracejada marca até onde
// dá pra posicionar soldados.
function desenharGradeDoCampo() {
  for (var p = 0; p < NUMERO_DE_PISTAS; p++) {
    for (var c = 0; c < NUMERO_DE_COLUNAS_DO_CAMPO; c++) {
      var x = POSICAO_DA_TRINCHEIRA + (c * LARGURA_DA_COLUNA);
      var y = p * ALTURA_DA_PISTA;

      if ((p + c) % 2 === 0) {
        contexto.fillStyle = "rgba(255, 255, 255, 0.04)";
      } else {
        contexto.fillStyle = "rgba(0, 0, 0, 0.07)";
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

  var ehSniper = tipoSelecionado.local === "vigia";

  // Mouse em cima da área do batalhão: destaca a torre de vigia dessa pista
  if (mouseX >= 0 && mouseX < ZONA_DO_BATALHAO) {
    var pistaDaTorre = Math.floor(mouseY / ALTURA_DA_PISTA);
    if (pistaDaTorre < 0 || pistaDaTorre >= NUMERO_DE_PISTAS) {
      return;
    }
    var torreLivre = ehSniper && soldadoNaCelula(pistaDaTorre, -1, "vigia") === null;
    if (torreLivre && recursos >= tipoSelecionado.custo) {
      contexto.fillStyle = "rgba(46, 204, 113, 0.35)";
    } else {
      contexto.fillStyle = "rgba(231, 76, 60, 0.35)";
    }
    contexto.fillRect(0, pistaDaTorre * ALTURA_DA_PISTA, ZONA_DO_BATALHAO, ALTURA_DA_PISTA);
    return;
  }

  var celula = celulaNaPosicao(mouseX, mouseY);
  if (celula === null) {
    return;
  }

  var casaLivre = !ehSniper && soldadoNaCelula(celula.pista, celula.coluna, tipoSelecionado.camada) === null;
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
    contexto.drawImage(imagemDoTipo(tipoSelecionado.id), casaX + deslocamentoXDoTipo(tipoSelecionado.id), casaY);
    contexto.globalAlpha = 1;
  }
}

function desenharSoldados() {
  // Três passadas: snipers nas torres do batalhão, torres de apoio (atrás) e atiradores (na frente)
  var camadas = ["vigia", "atras", "frente"];

  for (var c = 0; c < camadas.length; c++) {
    for (var i = 0; i < listaDeSoldados.length; i++) {
      var soldado = listaDeSoldados[i];
      if (soldado.camada !== camadas[c]) {
        continue;
      }

      var x = xDoSprite(soldado);
      var y = yDaPista(soldado.pista);

      // Sombrinha no chão (só a dos atiradores; a torre já tem os sacos de areia)
      if (soldado.camada === "frente") {
        contexto.fillStyle = "rgba(0, 0, 0, 0.28)";
        contexto.fillRect(x + 24, y + ALTURA_DA_PISTA - 6, 42, 6);
      }

      // Ao atirar, o soldado dá um tranco pra trás
      var recuo = 0;
      if (soldado.ticksDeRecuo > 0) {
        recuo = ESCALA_DO_PIXEL;
      }
      contexto.drawImage(imagemDoTipo(soldado.id), x - recuo, y);

      // Levou tiro: pisca vermelho
      if (soldado.ticksDeImpacto > 0) {
        contexto.fillStyle = "rgba(220, 40, 30, 0.45)";
        contexto.fillRect(x + 18, y + 6, LARGURA_DO_SPRITE - 36, ALTURA_DA_PISTA - 12);
      }

      // Barra de vida (resistência) do soldado
      var fracao = Math.max(0, soldado.vida / soldado.vidaMaxima);
      var barraY = y + (soldado.camada === "atras" ? 10 : 2);
      contexto.fillStyle = "rgba(0, 0, 0, 0.6)";
      contexto.fillRect(x + 21, barraY, 48, 6);
      contexto.fillStyle = fracao > 0.5 ? "#6fcf4a" : (fracao > 0.25 ? "#f2c037" : "#e74c3c");
      contexto.fillRect(x + 22, barraY + 1, Math.round(46 * fracao), 4);

      // Clarão na boca da arma
      if (soldado.ticksDeRecuo > 2) {
        var bx = bocaXDoSoldado(soldado);
        var by = bocaYDoSoldado(soldado);
        contexto.fillStyle = "#fff3b0";
        contexto.fillRect(bx, by - 6, 12, 12);
        contexto.fillStyle = "#ffc107";
        contexto.fillRect(bx + 12, by - 3, 6, 6);
      }
    }
  }
}


// =====================================================================
// 11) USER STORIES 3 e 4: SOLDADOS ATACAM, INIMIGOS MORREM, GANHAM XP
// =====================================================================

// Posição (no eixo X) do começo de uma coluna e (no eixo Y) do topo de uma pista
function xDaCasa(coluna) {
  return POSICAO_DA_TRINCHEIRA + (coluna * LARGURA_DA_COLUNA);
}
function yDaPista(pista) {
  return pista * ALTURA_DA_PISTA;
}

// O soldado só atira se existe algum inimigo na frente dele, na mesma pista
function temInimigoNaFrenteDoSoldado(soldado) {
  var bocaX = bocaXDoSoldado(soldado);

  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];
    var estaNaTela = inimigo.x < canvas.width;
    var estaNaFrente = inimigo.x + HITBOX_DIREITA_DO_INIMIGO > bocaX;

    if (inimigo.pista === soldado.pista && inimigo.vida > 0 && estaNaTela && estaNaFrente) {
      return true;
    }
  }
  return false;
}

function soldadosAtacam() {
  for (var i = 0; i < listaDeSoldados.length; i++) {
    var soldado = listaDeSoldados[i];

    if (soldado.ticksDeRecuo > 0) {
      soldado.ticksDeRecuo--;
    }
    if (soldado.ticksParaProximoTiro > 0) {
      soldado.ticksParaProximoTiro--;
    }

    if (soldado.ticksParaProximoTiro <= 0 && temInimigoNaFrenteDoSoldado(soldado)) {
      // PIM! Cria o projétil saindo da arma do soldado
      listaDeProjeteis.push({
        x: bocaXDoSoldado(soldado),
        y: bocaYDoSoldado(soldado),
        pista: soldado.pista,
        dano: soldado.dano + (nivelDaMelhoria("municao") * BONUS_DE_DANO_POR_NIVEL),   // NOVO US4
        velocidade: soldado.velocidade
      });
      soldado.ticksParaProximoTiro = ticksEntreTirosDoSoldado(soldado);   // NOVO US4
      soldado.ticksDeRecuo = 4;
    }
  }
}

// Tira vida do inimigo e faz ele piscar branco
function causarDano(inimigo, dano) {
  inimigo.vida = inimigo.vida - dano;
  inimigo.ticksDeImpacto = 4;
}

// Move os projéteis e vê se algum acertou um inimigo
function moverProjeteis() {
  // (de trás pra frente, porque a gente remove itens da lista no meio do caminho)
  for (var i = listaDeProjeteis.length - 1; i >= 0; i--) {
    var projetil = listaDeProjeteis[i];
    projetil.x = projetil.x + projetil.velocidade;

    var acertou = false;
    for (var j = 0; j < listaDeInimigos.length; j++) {
      var inimigo = listaDeInimigos[j];

      if (inimigo.pista === projetil.pista && inimigo.vida > 0 &&
          projetil.x >= inimigo.x + HITBOX_ESQUERDA_DO_INIMIGO &&
          projetil.x <= inimigo.x + HITBOX_DIREITA_DO_INIMIGO) {
        causarDano(inimigo, projetil.dano);
        acertou = true;
        break;
      }
    }

    if (acertou || projetil.x > canvas.width) {
      listaDeProjeteis.splice(i, 1);
    }
  }
}

// Remove da lista os inimigos que ficaram sem vida e dá XP por eles
function removerInimigosMortos() {
  for (var i = listaDeInimigos.length - 1; i >= 0; i--) {
    var inimigo = listaDeInimigos[i];

    if (inimigo.ticksDeImpacto > 0) {
      inimigo.ticksDeImpacto--;
    }

    if (inimigo.vida <= 0) {
      var centroX = inimigo.x + (LARGURA_DO_SPRITE / 2);
      var centroY = yDaPista(inimigo.pista) + (ALTURA_DA_PISTA / 2);

      listaDeExplosoes.push({ x: centroX, y: centroY, ticks: 0, grande: false });
      ganharXP(inimigo.xp, centroX, centroY - 30);   // NOVO US4: cada inimigo paga o XP dele
      listaDeInimigos.splice(i, 1);
    }
  }
}

// Soma XP e, a cada XP_POR_CARGA, o jogador ganha uma carga do Bombardeio
function ganharXP(quantidade, x, y) {
  xp = xp + quantidade;
  listaDeTextosFlutuantes.push({ texto: "+" + quantidade + " XP", x: x, y: y, ticks: 40 });

  // Converte XP em suprimentos para comprar novos soldados e torres.
  progressoDaConversao += quantidade;
  var suprimentosGanhos = 0;
  while (progressoDaConversao >= XP_PARA_DINHEIRO) {
    progressoDaConversao -= XP_PARA_DINHEIRO;
    recursos += DINHEIRO_POR_CONVERSAO;
    suprimentosGanhos += DINHEIRO_POR_CONVERSAO;
  }
  if (suprimentosGanhos > 0) {
    listaDeTextosFlutuantes.push({
      texto: "+" + suprimentosGanhos + " suprimentos",
      x: x, y: y - 22, ticks: 40
    });
  }

  if (cargasDoBombardeio < MAXIMO_DE_CARGAS) {
    progressoDaCarga += quantidade;
    while (progressoDaCarga >= XP_POR_CARGA && cargasDoBombardeio < MAXIMO_DE_CARGAS) {
      progressoDaCarga -= XP_POR_CARGA;
      cargasDoBombardeio++;
      mostrarAviso("Bombardeio pronto! (tecla B)");
    }
    if (cargasDoBombardeio >= MAXIMO_DE_CARGAS) progressoDaCarga = 0;
  }

  if (cargasDaMina < MAXIMO_DE_CARGAS_DA_MINA) {
    progressoDaCargaDaMina += quantidade;
    while (progressoDaCargaDaMina >= XP_POR_CARGA_DA_MINA &&
           cargasDaMina < MAXIMO_DE_CARGAS_DA_MINA) {
      progressoDaCargaDaMina -= XP_POR_CARGA_DA_MINA;
      cargasDaMina++;
      mostrarAviso("Mina pronta! (tecla M)");
    }
    if (cargasDaMina >= MAXIMO_DE_CARGAS_DA_MINA) progressoDaCargaDaMina = 0;
  }
}

// =====================================================================
// 12) PODER ESPECIAL: BOMBARDEIO
// =====================================================================
// Cada carga solta uma bomba em cada inimigo que está no campo.
// A explosão atinge também os inimigos que estiverem por perto.
function acionarBombardeio() {
  if (jogoAcabou) {
    return;
  }

  if (cargasDoBombardeio <= 0) {
    mostrarAviso("Sem cargas! Derrote inimigos pra carregar.");
    return;
  }

  // Alvos = inimigos que já apareceram na tela
  var alvos = [];
  for (var i = 0; i < listaDeInimigos.length; i++) {
    if (listaDeInimigos[i].x < canvas.width - 20 && listaDeInimigos[i].vida > 0) {
      alvos.push(listaDeInimigos[i]);
    }
  }

  if (alvos.length === 0) {
    mostrarAviso("Nenhum inimigo no campo!");
    return; // não gasta a carga
  }

  cargasDoBombardeio--;

  for (var k = 0; k < alvos.length; k++) {
    var alvo = alvos[k];
    var yDoAlvo = yDaPista(alvo.pista) + (ALTURA_DA_PISTA / 2);
    var yInicial = -imagemBomba.height;

    listaDeBombas.push({
      x: alvo.x + (LARGURA_DO_SPRITE / 2),
      y: yInicial,
      yAlvo: yDoAlvo,
      velocidade: (yDoAlvo - yInicial) / 14,   // cai em 14 ticks
      atraso: Math.min(k * 4, 20)              // as bombas não caem todas juntas
    });
  }
}

function atualizarBombas() {
  for (var i = listaDeBombas.length - 1; i >= 0; i--) {
    var bomba = listaDeBombas[i];

    if (bomba.atraso > 0) {
      bomba.atraso--;
      continue;
    }

    bomba.y = bomba.y + bomba.velocidade;

    if (bomba.y >= bomba.yAlvo) {
      explodirBomba(bomba.x, bomba.yAlvo);
      listaDeBombas.splice(i, 1);
    }
  }
}

// A bomba bateu no chão: explosão + dano em todos os inimigos perto
function explodirBomba(x, y) {
  listaDeExplosoes.push({ x: x, y: y, ticks: 0, grande: true });
  ticksDeFlash = 3;

  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];
    var centroX = inimigo.x + (LARGURA_DO_SPRITE / 2);
    var centroY = yDaPista(inimigo.pista) + (ALTURA_DA_PISTA / 2);
    var distancia = Math.sqrt((centroX - x) * (centroX - x) + (centroY - y) * (centroY - y));

    if (distancia <= RAIO_DA_EXPLOSAO) {
      causarDano(inimigo, DANO_DO_BOMBARDEIO);
    }
  }
}


// =====================================================================
// 13) EFEITOS NA TELA (projéteis, bombas, explosões, textos)
// =====================================================================
function atualizarEfeitos() {
  for (var i = listaDeExplosoes.length - 1; i >= 0; i--) {
    listaDeExplosoes[i].ticks++;
    // cada quadro da animação dura 2 ticks, e são 8 quadros
    if (listaDeExplosoes[i].ticks >= 16) {
      listaDeExplosoes.splice(i, 1);
    }
  }

  for (var j = listaDeTextosFlutuantes.length - 1; j >= 0; j--) {
    listaDeTextosFlutuantes[j].ticks--;
    listaDeTextosFlutuantes[j].y = listaDeTextosFlutuantes[j].y - 1;
    if (listaDeTextosFlutuantes[j].ticks <= 0) {
      listaDeTextosFlutuantes.splice(j, 1);
    }
  }

  if (ticksDeFlash > 0) {
    ticksDeFlash--;
  }
}

function desenharProjeteis() {
  for (var i = 0; i < listaDeProjeteis.length; i++) {
    var projetil = listaDeProjeteis[i];
    contexto.fillStyle = "#f2b630";                       // rastro
    contexto.fillRect(projetil.x - 15, projetil.y - 1, 12, 3);
    contexto.fillStyle = "#fff7d1";                       // ponta
    contexto.fillRect(projetil.x - 3, projetil.y - 3, 6, 6);
  }
}

function desenharBombas() {
  for (var i = 0; i < listaDeBombas.length; i++) {
    var bomba = listaDeBombas[i];
    if (bomba.atraso > 0) {
      continue; // ainda não foi lançada
    }
    // Rastro de fumaça atrás (em cima) da bomba
    contexto.fillStyle = "rgba(200, 200, 200, 0.35)";
    contexto.fillRect(bomba.x - 3, bomba.y - imagemBomba.height - 30, 6, 30);

    // A bomba (a ponta dela encosta em bomba.y)
    contexto.drawImage(imagemBomba, bomba.x - (imagemBomba.width / 2), bomba.y - imagemBomba.height);
  }
}

function desenharExplosoes() {
  for (var i = 0; i < listaDeExplosoes.length; i++) {
    var explosao = listaDeExplosoes[i];
    var quadro = Math.min(7, Math.floor(explosao.ticks / 2));
    var imagem = explosao.grande ? quadrosExplosaoGrande[quadro] : quadrosExplosaoPequena[quadro];
    contexto.drawImage(imagem, explosao.x - (imagem.width / 2), explosao.y - (imagem.height / 2));
  }
}

// Texto dourado ("+10 XP") que sobe e some
function desenharTextosFlutuantes() {
  contexto.font = "bold 18px Verdana";
  contexto.textAlign = "center";

  for (var i = 0; i < listaDeTextosFlutuantes.length; i++) {
    var t = listaDeTextosFlutuantes[i];
    contexto.globalAlpha = Math.min(1, t.ticks / 15);
    contexto.fillStyle = "#1a1812";
    contexto.fillText(t.texto, t.x + 2, t.y + 2);   // sombra
    contexto.fillStyle = "#ffd54f";
    contexto.fillText(t.texto, t.x, t.y);
  }

  contexto.globalAlpha = 1;
  contexto.textAlign = "start";
}

function desenharFlash() {
  if (ticksDeFlash > 0) {
    contexto.fillStyle = "rgba(255, 255, 255, 0.3)";
    contexto.fillRect(0, 0, canvas.width, canvas.height);
  }
}


// =====================================================================
// 9) FUNÇÃO: ATUALIZAR O HUD (as informações que aparecem em texto)
// =====================================================================
function atualizarHUD() {
  textoRecursos.textContent = recursos;
  textoInimigos.textContent = listaDeInimigos.length;
  textoVida.textContent = Math.max(0, vidaDoBatalhao);
  textoXP.textContent = xp;
  atualizarBotaoDoPoder();
  atualizarBotaoDaMina();
  atualizarCartas();
  atualizarCartasDeMelhorias();   // NOVO US4
}

// Atualiza o botão do Bombardeio: quantas cargas tem e quanto falta pra próxima
function atualizarBotaoDoPoder() {
  var proxima;
  if (cargasDoBombardeio >= MAXIMO_DE_CARGAS) {
    proxima = "máximo";
  } else {
    proxima = progressoDaCarga + "/" + XP_POR_CARGA + " XP";
  }
  textoDoPoder.textContent = "Cargas: " + cargasDoBombardeio + "/" + MAXIMO_DE_CARGAS + "  |  próxima: " + proxima;

  botaoBombardeio.classList.toggle("pronto", cargasDoBombardeio > 0);
  botaoBombardeio.classList.toggle("semCarga", cargasDoBombardeio === 0);
}


// =====================================================================
// MINAS: o Cabo habilita a habilidade; a carga é obtida derrotando inimigos.
// =====================================================================
function temCaboNoCampo() {
  return listaDeSoldados.some(function (soldado) { return soldado.id === "cabo"; });
}
function minaNaCelula(pista, coluna) {
  return listaDeMinas.find(function (mina) {
    return mina.pista === pista && mina.coluna === coluna;
  }) || null;
}
function celulaDoCampoNaPosicao(x, y) {
  if (x < POSICAO_DA_TRINCHEIRA) return null;
  var coluna = Math.floor((x - POSICAO_DA_TRINCHEIRA) / LARGURA_DA_COLUNA);
  var pista = Math.floor(y / ALTURA_DA_PISTA);
  if (coluna < 0 || coluna >= NUMERO_DE_COLUNAS_DO_CAMPO || pista < 0 || pista >= NUMERO_DE_PISTAS) return null;
  return { pista: pista, coluna: coluna };
}
function acionarMina() {
  if (jogoAcabou) return;
  if (modoMina) {
    modoMina = false;
    atualizarBotaoDaMina();
    return;
  }
  if (cargasDaMina <= 0) {
    mostrarAviso("Sem cargas de mina! Derrote inimigos para recarregar.");
    return;
  }
  if (!temCaboNoCampo()) {
    mostrarAviso("Posicione um Cabo para liberar as minas!");
    return;
  }
  modoMina = true;
  tipoSelecionado = null;
  mostrarAviso("Clique em uma casa do campo inimigo para plantar a mina!");
  atualizarHUD();
}
function plantarMinaNaCasa(pista, coluna) {
  if (coluna < COLUNA_MINIMA_DA_MINA || coluna > COLUNA_MAXIMA_DA_MINA) {
    mostrarAviso("Plante a mina no campo inimigo!");
    return;
  }
  if (minaNaCelula(pista, coluna)) {
    mostrarAviso("Já existe uma mina nessa posição!");
    return;
  }
  if (listaDeMinas.length >= MAXIMO_DE_MINAS) {
    mostrarAviso("Limite de minas no campo atingido!");
    return;
  }
  listaDeMinas.push({
    pista: pista, coluna: coluna,
    x: xDaCasa(coluna) + LARGURA_DA_COLUNA / 2,
    ticksParaArmar: TICKS_PARA_ARMAR_MINA
  });
  cargasDaMina--;
  modoMina = false;
  atualizarHUD();
}
function atualizarMinas() {
  for (var i = listaDeMinas.length - 1; i >= 0; i--) {
    var mina = listaDeMinas[i];
    if (mina.ticksParaArmar > 0) {
      mina.ticksParaArmar--;
      continue;
    }
    for (var j = 0; j < listaDeInimigos.length; j++) {
      var inimigo = listaDeInimigos[j];
      if (inimigo.pista === mina.pista && inimigo.vida > 0 &&
          mina.x >= inimigo.x + HITBOX_ESQUERDA_DO_INIMIGO &&
          mina.x <= inimigo.x + HITBOX_DIREITA_DO_INIMIGO) {
        explodirMina(mina);
        listaDeMinas.splice(i, 1);
        break;
      }
    }
  }
}
function explodirMina(mina) {
  var y = yDaPista(mina.pista) + ALTURA_DA_PISTA / 2;
  listaDeExplosoes.push({ x: mina.x, y: y, ticks: 0, grande: true });
  for (var i = 0; i < listaDeInimigos.length; i++) {
    var inimigo = listaDeInimigos[i];
    if (inimigo.pista !== mina.pista) continue;
    var centroX = inimigo.x + LARGURA_DO_SPRITE / 2;
    if (Math.abs(centroX - mina.x) <= RAIO_DA_MINA) causarDano(inimigo, DANO_DA_MINA);
  }
}
function desenharMinas() {
  for (var i = 0; i < listaDeMinas.length; i++) {
    var mina = listaDeMinas[i];
    var x = mina.x - imagemMina.width / 2;
    var y = yDaPista(mina.pista) + ALTURA_DA_PISTA - imagemMina.height - 10;
    if (mina.ticksParaArmar > 0) contexto.globalAlpha = 0.5;
    contexto.drawImage(imagemMina, x, y);
    contexto.globalAlpha = 1;
  }
}
function desenharPreviaDaMina() {
  if (!modoMina || jogoAcabou) return;
  var celula = celulaDoCampoNaPosicao(mouseX, mouseY);
  if (!celula) return;
  var valida = celula.coluna >= COLUNA_MINIMA_DA_MINA &&
    celula.coluna <= COLUNA_MAXIMA_DA_MINA &&
    minaNaCelula(celula.pista, celula.coluna) === null;
  var casaX = xDaCasa(celula.coluna);
  var casaY = yDaPista(celula.pista);
  contexto.fillStyle = valida ? "rgba(46,204,113,0.35)" : "rgba(231,76,60,0.35)";
  contexto.fillRect(casaX, casaY, LARGURA_DA_COLUNA, ALTURA_DA_PISTA);
  if (valida) {
    contexto.globalAlpha = 0.6;
    contexto.drawImage(imagemMina, casaX + LARGURA_DA_COLUNA / 2 - imagemMina.width / 2,
      casaY + ALTURA_DA_PISTA - imagemMina.height - 10);
    contexto.globalAlpha = 1;
  }
}
function atualizarBotaoDaMina() {
  var proxima = cargasDaMina >= MAXIMO_DE_CARGAS_DA_MINA
    ? "máximo" : progressoDaCargaDaMina + "/" + XP_POR_CARGA_DA_MINA + " XP";
  textoDaMina.textContent = "Cargas: " + cargasDaMina + "/" + MAXIMO_DE_CARGAS_DA_MINA + " | próxima: " + proxima;
  botaoMina.classList.toggle("pronto", cargasDaMina > 0);
  botaoMina.classList.toggle("semCarga", cargasDaMina === 0);
  botaoMina.classList.toggle("selecionado", modoMina);
}

// =====================================================================
// NOVO US4) MELHORIAS: o jogador gasta o XP que ganhou
// =====================================================================

// Nível atual de uma melhoria (0 = ainda não comprou)
function nivelDaMelhoria(id) {
  for (var i = 0; i < MELHORIAS.length; i++) {
    if (MELHORIAS[i].id === id) {
      return MELHORIAS[i].nivel;
    }
  }
  return 0;
}

// Tempo entre tiros do soldado já com a Cadência (nunca menos que 10 ticks)
function ticksEntreTirosDoSoldado(soldado) {
  var ticks = soldado.ticksEntreTiros - (nivelDaMelhoria("cadencia") * TICKS_A_MENOS_POR_NIVEL);
  return Math.max(10, ticks);
}

// XP que custa o PRÓXIMO nível da melhoria
function custoDaMelhoria(melhoria) {
  return melhoria.custo * (melhoria.nivel + 1);
}

function comprarMelhoria(melhoria) {
  if (jogoAcabou) {
    return;
  }
  if (melhoria.nivel >= melhoria.maximo) {
    mostrarAviso("Essa melhoria já está no máximo!");
    return;
  }

  var custo = custoDaMelhoria(melhoria);
  if (xp < custo) {
    mostrarAviso("XP insuficiente!");
    return;
  }

  xp = xp - custo;   // o XP gasto sai do total
  melhoria.nivel = melhoria.nivel + 1;

  // O Reforço faz efeito na hora (devolve vida). Munição e Cadência valem quando o soldado atira.
  if (melhoria.id === "reforco") {
    vidaDoBatalhao = vidaDoBatalhao + VIDA_DO_REFORCO;
  }

  mostrarAviso(melhoria.nome + " nível " + melhoria.nivel + "!");
  atualizarHUD();
}

// Mesma ideia do criarAcaoDeSelecionar: guarda a melhoria certa pra cada botão
function criarAcaoDeMelhoria(melhoria) {
  return function () {
    comprarMelhoria(melhoria);
  };
}

// Cria um botão pra cada melhoria
function criarCartasDeMelhorias() {
  for (var i = 0; i < MELHORIAS.length; i++) {
    var melhoria = MELHORIAS[i];

    var botao = document.createElement("button");
    botao.className = "carta";

    var icone = criarImagemDoSprite(SPRITE_PATENTE, 2, false, false);
    var texto = document.createElement("span");
    texto.className = "textoDaCarta";
    var titulo = document.createElement("span");    // "Munição Nv 1/3"
    var pequeno = document.createElement("small");  // "+5 de dano | 80 XP"
    texto.appendChild(titulo);
    texto.appendChild(pequeno);
    botao.appendChild(icone);
    botao.appendChild(texto);

    botao.addEventListener("click", criarAcaoDeMelhoria(melhoria));

    barraDeMelhorias.appendChild(botao);
    cartasDeMelhorias.push({ melhoria: melhoria, botao: botao, titulo: titulo, pequeno: pequeno });
  }
}

// Atualiza o texto dos botões (nível e custo) e apaga os que o XP não paga
function atualizarCartasDeMelhorias() {
  for (var i = 0; i < cartasDeMelhorias.length; i++) {
    var carta = cartasDeMelhorias[i];
    var melhoria = carta.melhoria;
    var noMaximo = melhoria.nivel >= melhoria.maximo;

    carta.titulo.textContent = melhoria.nome + " Nv " + melhoria.nivel + "/" + melhoria.maximo;
    if (noMaximo) {
      carta.pequeno.textContent = melhoria.descricao + " | MÁXIMO";
    } else {
      carta.pequeno.textContent = melhoria.descricao + " | " + custoDaMelhoria(melhoria) + " XP";
    }

    carta.botao.classList.toggle("selecionado", noMaximo);                                        // dourado = no máximo
    carta.botao.classList.toggle("semSuprimento", !noMaximo && xp < custoDaMelhoria(melhoria));   // sem XP
  }
}

// Cria as cartas da barra assim que o script carrega
criarCartasDeSoldados();
criarCartasDeMelhorias();   // NOVO US4

// declaração das variáveis globais
let desempenho = 0;
let tentativas = 0;
let acertos = 0;
let pontuacao = 0; // nova variável para pontuação
let jogar = true;
let totalCartas = 4;
let recordePontuacao = localStorage.getItem('recordePontuacao') ? parseInt(localStorage.getItem('recordePontuacao')) : 0;

// captura os botões pelos ids e adiciona um evento de clique
const btnReiniciar = document.getElementById('reiniciar');
const btnJogarNovamente = document.getElementById('joganovamente');
const linha1 = document.getElementById('linha1');

// captura o placar pelo id
const placar = document.getElementById("resposta");

// função que reinicia o jogo
function reiniciar() {
    desempenho = 0;
    tentativas = 0;
    acertos = 0;
    pontuacao = 0; // reinicia a pontuação
    totalCartas = 4;
    jogar = true;
    document.body.classList.remove('perdeu'); // remove a classe do body
    placar.classList.remove('perdeu'); // remove a classe do placar
    atualizarCartas();
    atualizaPlacar(0, 0, 0);
    btnJogarNovamente.className = 'invisivel';
    btnReiniciar.className = 'invisivel';
    const mensagemPerda = document.querySelector('.mensagem-perda');
    if (mensagemPerda) {
        mensagemPerda.remove(); // remove a mensagem de perda, se existir
    }
}

// função que atualiza as cartas
function atualizarCartas() {
    linha1.innerHTML = ''; // limpa as cartas existentes
    for (let i = 0; i < totalCartas; i++) {
        const div = document.createElement('div');
        div.id = i;
        div.className = 'inicial';
        div.onclick = function() { verifica(div); };
        div.textContent = i; // exibe o número da carta
        linha1.appendChild(div);
    }
}

// função que atualiza o placar
function atualizaPlacar(acertos, tentativas, pontuacao) {
    desempenho = tentativas === 0 ? 0 : (acertos / tentativas) * 100; // evita divisão por zero
    placar.innerHTML = `
        <div class="tb_placar">
            <p class="titulo_p">Placar</p>
            <p>Acertos: ${acertos} | Tentativas: ${tentativas}</p>
            <p>Desempenho: ${Math.round(desempenho)}%</p>
            <p>Pontuação: ${pontuacao} | Recorde: ${recordePontuacao}</p>
        </div>`;
}

// função executada quando o jogador acertou
function acertou(obj) {
    obj.className = "acertou";
    const img = new Image(100);
    img.src = "https://upload.wikimedia.org/wikipedia/commons/2/2e/Oxygen480-emotes-face-smile-big.svg";
    obj.appendChild(img);
}

// função executada quando o jogador errou
function errou(obj) {
    obj.className = "errou";
    const img = new Image(100);
    img.src = "https://png.pngtree.com/png-vector/20240513/ourmid/pngtree-clipart-of-sad-emoji-png-image_12456564.png";
    obj.appendChild(img);
}

// Função que verifica se o jogador acertou
function verifica(obj) {
    if (jogar) {
        jogar = false;
        tentativas++;
        let sorteado = Math.floor(Math.random() * totalCartas);
        if (obj.id == sorteado) {
            acertou(obj);
            acertos++;
            pontuacao += (500 * (totalCartas - 2)); // adiciona pontos por acerto
            
            // Atualiza o recorde se necessário
            if (pontuacao > recordePontuacao) {
                recordePontuacao = pontuacao;
                localStorage.setItem('recordePontuacao', recordePontuacao);
            }

            totalCartas++; // aumenta o número de cartas
        } else {
            errou(obj);
            const objSorteado = document.getElementById(sorteado);
            acertou(objSorteado);
            pontuacao -= 300; // subtrai pontos por erro
            
            if (totalCartas <= 2) {
                substituirImagensPerda(); // Chama a nova função

                const mensagem = document.createElement('div');
                mensagem.className = 'mensagem-perda';
                mensagem.textContent = 'Você perdeu o jogo!';
                linha1.appendChild(mensagem);

                // Adiciona a classe 'perdeu' ao corpo e ao placar
                document.body.classList.add('perdeu');
                placar.classList.add('perdeu');

                btnReiniciar.className = 'visivel';
                return; // sai da função para evitar continuar
            } else {
                totalCartas--; // diminui o número de cartas
            }
        }
        atualizaPlacar(acertos, tentativas, pontuacao);
        btnJogarNovamente.className = 'visivel'; // exibe o botão "Continuar"
    } else {
        alert('Clique em "Continuar" ou pressione "space"/"enter" para continuar jogando');
    }
}

// Função para substituir as imagens das cartas quando o jogador perde
function substituirImagensPerda() {
    const cartas = document.querySelectorAll('.inicial, .acertou, .errou');
    cartas.forEach(carta => {
        carta.innerHTML = ''; // limpa a carta
        const img = new Image(100);
        img.src = "https://cdn3d.iconscout.com/3d/premium/thumb/cara-morta-com-bandagem-na-cabeca-9437459-7705008.png?f=webp";
        carta.appendChild(img); // adiciona a nova imagem
    });
}

// adiciona eventos aos botões
btnJogarNovamente.addEventListener('click', function() {
    btnJogarNovamente.className = 'invisivel';
    atualizarCartas(); // atualiza as cartas antes de permitir nova jogada
    jogar = true;
});
btnReiniciar.addEventListener('click', reiniciar);

// Inicializa o jogo
reiniciar();

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
        if (btnJogarNovamente.className === 'visivel') {
            btnJogarNovamente.click(); // Simula o clique no botão "Continuar"
        }
    } else if (event.code === 'KeyR') {
        btnReiniciar.click(); // Simula o clique no botão de reiniciar
    }
});

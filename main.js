import { db } from "./firebase.js";

import {
    ref,
    set,
    get,
    remove
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const musica = [
    {
        nome: "Bloco dos Apaixonados",
        artista: "Sotam",
        arquivo: "musica/musica1.mp3",
        imagem: "img/Sotam.jpg" 
    },
    {
        nome: "american wedding",
        artista: "Frank ocean",
        arquivo: "musica/musica2.mp3",
        imagem: "img/Leon.jpg"
    },
    {
        nome: "a ultima dança",
        artista: "Link do Zap",
        arquivo: "musica/musica3.mp3",
        imagem: "img/link.jpg"
    }
];

const listaMusicas = document.querySelector("#Musicas");
const pesquisa = document.querySelector("#pesquisa");
const biblioteca = document.querySelector("#biblioteca");
const inicio = document.querySelector("#inicio");

const favoritos = [];
let naBiblioteca = false;

function atualizarBiblioteca() {
    const musicas = document.querySelectorAll(".musica");

    musicas.forEach(function(item, index) {

        if (favoritos.includes(index)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }

    });
}

biblioteca.addEventListener("click", function() {
    naBiblioteca = true;
    pesquisa.value = "";

    atualizarBiblioteca();
});

inicio.addEventListener("click", function() {
    naBiblioteca = false;
    pesquisa.value = "";

    const musicas = document.querySelectorAll(".musica");

    musicas.forEach(function(item) {
        item.style.display = "flex";
    });
});

let musicaAtual = 0;

const audio = new Audio(musica[musicaAtual].arquivo);


const nomeMusica = document.querySelector("#NomeMusica");
const nomeArtista = document.querySelector("#NomeArtista");

let botaoMusicaAtual = null;

const botoesMusicas = [];
const botoesFavoritos = [];

function atualizarBotao(botaoAtual) {
    if (botaoMusicaAtual) {
        botaoMusicaAtual.textContent = "Play";
    }

    botaoAtual.textContent = "Pause";
    botaoMusicaAtual = botaoAtual;
}

musica.forEach(function(item, index) {

    const div = document.createElement("div");

    div.classList.add("musica");

    const nome = document.createElement("h3");
    nome.textContent = item.nome;

    const artista = document.createElement("p");
    artista.textContent = item.artista;

    div.appendChild(nome);
    div.appendChild(artista);

    const imagem = document.createElement("img");
    imagem.src = item.imagem;

    div.appendChild(imagem);

    const botaoMusica = document.createElement("button");
    botaoMusica.textContent = "Play";

    const favorito = document.createElement("button");
    favorito.textContent = "♡";

    botoesFavoritos.push(favorito);

    botoesMusicas.push(botaoMusica);

    botaoMusica.addEventListener("click", function() {

       if (musicaAtual === index) {

    if (audio.paused) {
        audio.play();
        botaoMusica.textContent = "Pause";
        atualizarBotao(botaoMusica);
    } else {
        audio.pause();
        botaoMusica.textContent = "Play";
    }

} else {

    musicaAtual = index;
    audio.src = item.arquivo;
    audio.play();

    atualizarBotao(botaoMusica);
}

        nomeMusica.textContent = item.nome;
        nomeArtista.textContent = item.artista;

    });

    favorito.addEventListener("click", function() {

    if (favoritos.includes(index)) {

        favoritos.splice(favoritos.indexOf(index), 1);
        favorito.textContent = "♡";

    } else {

        favoritos.push(index);
        favorito.textContent = "♥";
    }

   if (favoritos.includes(index)) {
    set(ref(db, "favoritos/" + index), true);
} else {
    remove(ref(db, "favoritos/" + index));
}

});

    div.appendChild(botaoMusica);
    div.appendChild(favorito);
    listaMusicas.appendChild(div);

    });

    get(ref(db, "favoritos")).then(function(snapshot) {

    if (snapshot.exists()) {

        const dados = snapshot.val();

        Object.keys(dados).forEach(function(index) {

            if (dados[index] === true) {

                favoritos.push(Number(index));
                botoesFavoritos[index].textContent = "♥";

            }

        });

    }

});

    pesquisa.addEventListener("input", function() {
    const texto = pesquisa.value.toLowerCase();

    const musicas = document.querySelectorAll(".musica");

    musicas.forEach(function(item, index) {
        const nome = musica[index].nome.toLowerCase();
        const artista = musica[index].artista.toLowerCase();

        if (
    (nome.includes(texto) || artista.includes(texto)) &&
    (!naBiblioteca || favoritos.includes(index))
) {
    item.style.display = "flex";
} else {
    item.style.display = "none";
}
    });
}); 

const botao = document.querySelector("#PlayPause");
const botaoProxima = document.querySelector("#Proxima");
const botaoAnterior = document.querySelector("#Anterior");
const progresso = document.querySelector("#progresso");
const tempo = document.querySelector("#tempo");
const volume = document.querySelector("#volume");
let duracaoTotal = 0;

nomeMusica.textContent = musica[musicaAtual].nome;
nomeArtista.textContent = musica[musicaAtual].artista;

botao.addEventListener("click", function() {

    if (audio.paused) {
        audio.play();
        botao.textContent = "⏸";
        atualizarBotao(botoesMusicas[musicaAtual]);
    } else {
        audio.pause();
        botao.textContent = "▶";
        botoesMusicas[musicaAtual].textContent = "Play";
    }

});

botaoProxima.addEventListener("click", function() {

    if (musicaAtual < musica.length - 1) {

        musicaAtual++;

        atualizarBotao(botoesMusicas[musicaAtual]);

        audio.src = musica[musicaAtual].arquivo;
        nomeMusica.textContent = musica[musicaAtual].nome;
        nomeArtista.textContent = musica[musicaAtual].artista;

        progresso.value = 0;

        audio.play();
        botao.textContent = "⏸";
    }

});

botaoAnterior.addEventListener("click", function() {

    if (musicaAtual > 0) {

        musicaAtual--;

        atualizarBotao(botoesMusicas[musicaAtual]);

        audio.src = musica[musicaAtual].arquivo;
        nomeMusica.textContent = musica[musicaAtual].nome;
        nomeArtista.textContent = musica[musicaAtual].artista;

        progresso.value = 0;

        audio.play();
        botao.textContent = "⏸";
    }

});

audio.addEventListener("ended", function() {
    if (musicaAtual < musica.length - 1) {
        musicaAtual++;

        atualizarBotao(botoesMusicas[musicaAtual]);

        audio.src = musica[musicaAtual].arquivo;
        nomeMusica.textContent = musica[musicaAtual].nome;
        nomeArtista.textContent = musica[musicaAtual].artista;

        progresso.value = 0;
        
        audio.play();
        botao.textContent = "⏸";
    }
});

audio.addEventListener("timeupdate", function() {
    const progressoAtual = (audio.currentTime / audio.duration) * 100;
    progresso.value = progressoAtual;

    const minutos = Math.floor(audio.currentTime / 60);
    const segundos = Math.floor(audio.currentTime % 60);

    const segundosFormatados = segundos < 10 ? "0" + segundos : segundos;

    const minutosTotal = Math.floor(duracaoTotal / 60);
    const segundosTotal = Math.floor(duracaoTotal % 60);

    const segundosTotalFormatados = segundosTotal < 10 ? "0" + segundosTotal : segundosTotal;

    tempo.textContent = minutos + ":" + segundosFormatados + " / " + minutosTotal + ":" + segundosTotalFormatados;
});

audio.addEventListener("loadedmetadata", function() {
    const minutosTotal = Math.floor(audio.duration / 60);

    const segundosTotal = Math.floor(audio.duration % 60);

    const segundosFormatados = segundosTotal < 10 ? "0" + segundosTotal : segundosTotal;
    tempo.textContent = "0:00 / " + minutosTotal + ":" + segundosFormatados;

    duracaoTotal = audio.duration;
    
});

progresso.addEventListener("input", function() {
    const novoTempo = (progresso.value / 100) * audio.duration;
    audio.currentTime = novoTempo;
});

volume.addEventListener("input", function() {
    audio.volume = volume.value / 100;
});

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {
        botao.click();
    }

});
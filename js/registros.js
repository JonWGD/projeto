const CHAVE = "arrayRegistros";
const CHAVE_GRAVADORAS = "arrayGravadoras";
const tabela = document.getElementById("tabela");

let arrayRegistros = recuperarRegistros(CHAVE);

if (arrayRegistros === null) {
    arrayRegistros = [
        { artista: "Banda Marmelada", titulo: "Meu Marmelo", versao: "", ano: 2020, duracao: "4:19", isrc: "BRRS12000001", gravadora: "BRRS1" },
        { artista: "Cléber Jurandir", titulo: "Couve Flor", versao: "Ao Vivo no Maracanã", ano: 2026, duracao: "4:20", isrc: "BRLUA2600001", gravadora: "BRLUA" },
        { artista: "Rosa Eletrochoque", titulo: "Zip Zap Zum", versao: "Extended Club Mix", ano: 1999, duracao: "4:18", isrc: "BRLUA9900001", gravadora: "BRLUA" }
    ];
    persistir(CHAVE, arrayRegistros);
}

let contadoresISRC = recuperarRegistros("contadoresISRC");

if (contadoresISRC === null) {
    contadoresISRC = {
        "BRRS120": 1, "BRLUA26": 1, "BRLUA99": 1
    };

    persistir("contadoresISRC", contadoresISRC);
}

// Funções organizadas em ordem alfabética:
function adicionar(dados) {
    arrayRegistros.push(dados);
    salvar();
}

function atualizar(isrc) {
    const registro = arrayRegistros.find(registro => registro.isrc === isrc);

    Object.assign(registro, {
        artista: document.getElementById("artista").value,
        titulo: document.getElementById("titulo").value,
        versao: document.getElementById("versao").value,
        ano: document.getElementById("ano").value,
        duracao: document.getElementById("duracao").value
    });

    salvar();
    document.getElementById("popover-registro").hidePopover();

}

function carregarGravadoras() {
    const select = document.getElementById("gravadora");
    const gravadoras = recuperarRegistros(CHAVE_GRAVADORAS);

    select.replaceChildren(new Option("Selecione uma gravadora", ""));

    gravadoras.forEach(gravadora => {
        const opcao = document.createElement("option");
        opcao.value = gravadora.prefixo;
        opcao.textContent = gravadora.nome;
        select.appendChild(opcao);
    });
}

function editar(isrc) {
    const registro = arrayRegistros.find(registro => registro.isrc === isrc);

    document.getElementById("artista").value = registro.artista;
    document.getElementById("titulo").value = registro.titulo;
    document.getElementById("versao").value = registro.versao;
    document.getElementById("ano").value = registro.ano;
    document.getElementById("duracao").value = registro.duracao;
    document.getElementById("gravadora").value = registro.gravadora;
    document.getElementById("gravadora").disabled = true;

    document.getElementById("botao-confirmar").textContent = "Salvar edições";

    document.getElementById("form-registro").onsubmit = evento => {
        evento.preventDefault();
        atualizar(isrc);
    }

    document.getElementById("popover-registro").showPopover();
}

function excluir(isrc) {
    const indice = arrayRegistros.findIndex(registro => registro.isrc === isrc);

    arrayRegistros.splice(indice, 1);
    salvar();
}

function gerarISRC(prefixo, ano) {
    const base = prefixo + String(ano).slice(-2);
    const contadores = recuperarRegistros("contadoresISRC") || {};

    const proximo = (contadores[base] || 0) + 1;

    if (proximo > 99999) {
        throw new Error("Limite de ISRCs atingido.");
    }

    contadores[base] = proximo;
    persistir("contadoresISRC", contadores);

    return base + String(proximo).padStart(5, "0");
}

function listar(registros = arrayRegistros) {
    const fragmento = document.createDocumentFragment();
    const template = document.getElementById("template");
    const _ = '[data-campo='

    registros.forEach(registro => {
        const linha = template.content.querySelector("tr").cloneNode(true);

        linha.querySelector(_ + 'artista]').textContent = registro.artista;
        linha.querySelector(_ + 'titulo]').textContent = registro.titulo;
        linha.querySelector(_ + 'versao]').textContent = registro.versao;
        linha.querySelector(_ + 'ano]').textContent = registro.ano;
        linha.querySelector(_ + 'duracao]').textContent = registro.duracao;
        linha.querySelector(_ + 'isrc]').textContent = registro.isrc;

        linha.querySelector(".btn-outline-primary").addEventListener("click", function () {
            editar(registro.isrc);
        });

        linha.querySelector(".btn-outline-danger").addEventListener("click", function () {
            excluir(registro.isrc);
        });

        fragmento.appendChild(linha);
    });

    tabela.replaceChildren(fragmento);
}

function persistir(chave, array) {
    localStorage.setItem(chave, JSON.stringify(array));
}

function pesquisar(artista = "", titulo = "") {
    const artistaBusca = artista.trim().toLowerCase();
    const tituloBusca = titulo.trim().toLowerCase();

    const resultados = arrayRegistros.filter(registro =>
        registro.artista.toLowerCase().includes(artistaBusca) &&
        registro.titulo.toLowerCase().includes(tituloBusca)
    );

    listar(resultados);
}

function recuperarRegistros(chave) {
    const registros = localStorage.getItem(chave);
    return registros === null ? null : JSON.parse(registros);
}

function registrar() {
    const dados = {
        artista: document.getElementById("artista").value,
        titulo: document.getElementById("titulo").value,
        versao: document.getElementById("versao").value,
        ano: document.getElementById("ano").value,
        duracao: document.getElementById("duracao").value,
        gravadora: document.getElementById("gravadora").value
    };

    dados.isrc = gerarISRC(dados.gravadora, dados.ano);

    adicionar(dados);

    document.getElementById("form-registro").reset();
    document.getElementById("popover-registro").hidePopover();
}

function salvar() {
    persistir(CHAVE, arrayRegistros);
    listar();
}

// Comportamento do botão "Salvar registro" do formulário
document.getElementById("form-registro").onsubmit = evento => {
    evento.preventDefault();
    registrar();
};

// Comportamento do botão "Registrar" da página
document.getElementById("botao-registrar").addEventListener("click", () => {
    carregarGravadoras();
    document.getElementById("popover-registro").showPopover();
    document.getElementById("gravadora").disabled = false;
    document.getElementById("botao-confirmar").textContent = "Salvar registro";
});

// Comportamento do botão "Cancelar" do formulário
document.getElementById("botao-cancelar").addEventListener("click", () => {
    document.getElementById("form-registro").reset();
    document.getElementById("popover-registro").hidePopover();
});

// Comportamento do botao "Pesquisar" da página
document.getElementById("form-pesquisa").addEventListener("submit", evento => {
    evento.preventDefault();

    const artista = document.getElementById("pesquisa-artista").value;
    const titulo = document.getElementById("pesquisa-titulo").value;
    pesquisar(artista, titulo);
});

carregarGravadoras()
listar()
const CHAVE = "arrayLancamentos";
const tabela = document.getElementById("tabela");

let arrayLancamentos = recuperarRegistros(CHAVE);

if (arrayLancamentos === null) {
    arrayLancamentos = [
        { artista: "Banda Marmelada", titulo: "MixMistura", versao: "Deluxe", quantidadeFaixas: "1", upc: "008980561213" }
    ];
    persistir(CHAVE, arrayLancamentos);
}

// Funções organizadas em ordem alfabética:
function adicionar(dados) {
    arrayLancamentos.push(dados);
    salvar();
}

function atualizar(upc) {
    const lancamento = arrayLancamentos.find(lancamento => lancamento.upc === upc);

    Object.assign(lancamento, {
        artista: document.getElementById("artista").value,
        titulo: document.getElementById("titulo").value,
        versao: document.getElementById("versao").value
    });

    salvar();
    document.getElementById("popover-registro").hidePopover();
}

function editar(upc) {
    const lancamento = arrayLancamentos.find(lancamento => lancamento.upc === upc);

    document.getElementById("artista").value = lancamento.artista;
    document.getElementById("titulo").value = lancamento.titulo;
    document.getElementById("versao").value = lancamento.versao;
    document.getElementById("upc").value = lancamento.upc;
    document.getElementById("upc").disabled = true;

    document.getElementById("botao-confirmar").textContent = "Salvar edições";

    document.getElementById("form-registro").onsubmit = evento => {
        evento.preventDefault();
        atualizar(upc);
    };

    document.getElementById("popover-registro").showPopover();
}

function excluir(upc) {
    const indice = arrayLancamentos.findIndex(lancamento => lancamento.upc === upc);

    arrayLancamentos.splice(indice, 1);
    salvar();
}

function listar(lancamentos = arrayLancamentos) {
    const fragmento = document.createDocumentFragment();
    const template = document.getElementById("template");
    const _ = '[data-campo=';

    lancamentos.forEach(lancamento => {
        const linha = template.content.querySelector("tr").cloneNode(true);

        linha.querySelector(_ + 'artista]').textContent = lancamento.artista;
        linha.querySelector(_ + 'titulo]').textContent = lancamento.titulo;
        linha.querySelector(_ + 'versao]').textContent = lancamento.versao;
        linha.querySelector(_ + 'quantidadeFaixas]').textContent = lancamento.quantidadeFaixas ?? "—";
        linha.querySelector(_ + 'upc]').textContent = lancamento.upc;

        linha.querySelector(".btn-outline-primary").addEventListener("click", function () {
            editar(lancamento.upc);
        });

        linha.querySelector(".btn-outline-danger").addEventListener("click", function () {
            excluir(lancamento.upc);
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

    const resultados = arrayLancamentos.filter(lancamento =>
        lancamento.artista.toLowerCase().includes(artistaBusca) &&
        lancamento.titulo.toLowerCase().includes(tituloBusca)
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
        upc: document.getElementById("upc").value.trim()
    };

    if (upcExiste(dados.upc)) {
        alert("O UPC já existe.");
        return false;
    }

    adicionar(dados);

    document.getElementById("form-registro").reset();
    document.getElementById("popover-registro").hidePopover();
}

function salvar() {
    persistir(CHAVE, arrayLancamentos);
    listar();
}

function upcExiste(upc) {
    return arrayLancamentos.some(lancamento => lancamento.upc === upc);
}

// Comportamento do botão "Salvar registro" do formulário
document.getElementById("form-registro").onsubmit = evento => {
    evento.preventDefault();
    registrar();
};

// Comportamento do botão "Registrar" da página
document.getElementById("botao-registrar").addEventListener("click", () => {
        document.getElementById("form-registro").reset();
    document.getElementById("form-registro").onsubmit = evento => {
        evento.preventDefault();
        registrar();
    };
    document.getElementById("popover-registro").showPopover();
    document.getElementById("upc").disabled = false;
    document.getElementById("botao-confirmar").textContent = "Salvar registro";
});

// Comportamento do botão "Cancelar" do formulário
document.getElementById("botao-cancelar").addEventListener("click", () => {
    document.getElementById("form-registro").reset();
    document.getElementById("popover-registro").hidePopover();
});

// Comportamento do botão "Pesquisar" da página
document.getElementById("form-pesquisa").addEventListener("submit", evento => {
    evento.preventDefault();

    const artista = document.getElementById("pesquisa-artista").value;
    const titulo = document.getElementById("pesquisa-lancamento").value;
    pesquisar(artista, titulo);
});

listar();
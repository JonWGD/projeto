const CHAVE = "arrayGravadoras";
const tabela = document.getElementById("tabela");

let arrayGravadoras = recuperarRegistros(CHAVE);

if (arrayGravadoras === null) {
    arrayGravadoras = [
        { nome: "Raio de Sol", pais: "Brasil", prefixo: "BRRS1", dataRegistro: "2026-11-14", contato: "info@rdslabel.com" },
        { nome: "Estrela do Norte", pais: "Brasil", prefixo: "BRENN", dataRegistro: "2026-02-20", contato: "contato@estreladonorte.com" },
        { nome: "Luar do Sertão", pais: "Brasil", prefixo: "BRLUA", dataRegistro: "2026-05-10", contato: "info@luardo.com.br" }
    ];
    persistir(CHAVE, arrayGravadoras);
}

function persistir(chave, array) {
    localStorage.setItem(chave, JSON.stringify(array));
}

function recuperarRegistros(chave) {
    const registros = localStorage.getItem(chave);
    return registros === null ? null : JSON.parse(registros);
}

function listar() {
    const fragmento = document.createDocumentFragment();
    const template = document.getElementById("template");
    const _ = '[data-campo='

    arrayGravadoras.forEach(gravadora => {
        const linha = template.content.querySelector("tr").cloneNode(true);

        linha.querySelector(_ + 'nome').textContent = gravadora.nome;
        linha.querySelector(_ + 'pais').textContent = gravadora.pais;
        linha.querySelector(_ + 'prefixo').textContent = gravadora.prefixo;
        linha.querySelector(_ + 'dataRegistro').textContent = gravadora.dataRegistro;
        linha.querySelector(_ + 'contato').textContent = gravadora.contato;

        linha.querySelector(".btn-outline-danger").addEventListener("click", function () {
            excluir(gravadora.prefixo);
        });

        fragmento.appendChild(linha);
    });

    tabela.replaceChildren(fragmento);
}

function excluir(prefixo) {
    const indice = arrayGravadoras.findIndex(gravadora => gravadora.prefixo === prefixo);

    arrayGravadoras.splice(indice, 1);
    salvar();
}

function salvar() {
    persistir(CHAVE, arrayGravadoras);
    listar();
}

function prefixoExiste(prefixo) {
    return arrayGravadoras.some(gravadora => gravadora.prefixo === prefixo);
}

function registrar() {
    const dados = {
        nome: document.getElementById("nome").value,
        pais: document.getElementById("pais").value,
        prefixo: document.getElementById("prefixo").value.toUpperCase(),
        dataRegistro: new Date().toLocaleDateString("pt-BR"),
        contato: document.getElementById("contato").value
    };

    if (prefixoExiste(dados.prefixo)) {
        alert("O prefixo já existe.");
        return false;
    }

    adicionar(dados);

    document.getElementById("form-registro").reset();
    document.getElementById("popover-registro").hidePopover();
}

function adicionar(dados) {
    arrayGravadoras.push(dados);
    salvar();
}

document.getElementById("form-registro").onsubmit = evento => {
    evento.preventDefault();
    registrar();
};

listar()
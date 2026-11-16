const CHAVE = "arrayGravadoras";
const tabela = document.getElementById("tabela");

let arrayGravadoras = recuperarRegistros(CHAVE);

if (arrayGravadoras === null) {
    arrayGravadoras = [
        { nome: "Raio de Sol", pais: "Brasil", prefixo: "BRRS1", dataRegistro: "14/11/2026", contato: "info@rdslabel.com" },
        { nome: "Estrela do Norte", pais: "Brasil", prefixo: "BRENN", dataRegistro: "15/11/2026", contato: "contato@estreladonorte.com" },
        { nome: "Luar do Sertão", pais: "Brasil", prefixo: "BRLUA", dataRegistro: "16/11/2026", contato: "info@luardo.com.br" }
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

function listar(gravadoras = arrayGravadoras) {
    const fragmento = document.createDocumentFragment();
    const template = document.getElementById("template");
    const _ = '[data-campo='

    gravadoras.forEach(gravadora => {
        const linha = template.content.querySelector("tr").cloneNode(true);

        linha.querySelector(_ + 'nome').textContent = gravadora.nome;
        linha.querySelector(_ + 'pais').textContent = gravadora.pais;
        linha.querySelector(_ + 'prefixo').textContent = gravadora.prefixo;
        linha.querySelector(_ + 'dataRegistro').textContent = gravadora.dataRegistro;
        linha.querySelector(_ + 'contato').textContent = gravadora.contato;

        linha.querySelector(".btn-outline-primary").addEventListener("click", function () {
            editar(gravadora.prefixo);
        });

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
        contato: document.getElementById("contato").value.toLowerCase(),
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

// Comportamento do botão "Salvar registro" do formulário
document.getElementById("form-registro").onsubmit = evento => {
    evento.preventDefault();
    registrar();
};

// Comportamento do botão "Registrar" da página
document.getElementById("botao-registrar").addEventListener("click", () => {
    document.getElementById("popover-registro").showPopover();
    document.getElementById("prefixo").disabled = false;
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

    const nome = document.getElementById("pesquisa-gravadora").value;
    const pais = document.getElementById("pesquisa-pais").value;
    pesquisar(nome, pais);
});


function editar(prefixo) {
    const gravadora = arrayGravadoras.find(gravadora => gravadora.prefixo === prefixo);

    document.getElementById("nome").value = gravadora.nome;
    document.getElementById("pais").value = gravadora.pais;
    document.getElementById("prefixo").value = gravadora.prefixo;
    document.getElementById("prefixo").disabled = true;
    document.getElementById("contato").value = gravadora.contato;

    document.getElementById("botao-confirmar").textContent = "Salvar edições";

    document.getElementById("form-registro").onsubmit = evento => {
        evento.preventDefault();
        atualizar(prefixo);
    }

    document.getElementById("popover-registro").showPopover();
}

function atualizar(prefixo) {
    const gravadora = arrayGravadoras.find(gravadora => gravadora.prefixo === prefixo);

    Object.assign(gravadora, {
        nome: document.getElementById("nome").value,
        pais: document.getElementById("pais").value,
        contato: document.getElementById("contato").value.toLowerCase()
    });

    salvar();
    document.getElementById("popover-registro").hidePopover();

}

function pesquisar(nome = "", pais = "") {
    const nomeBusca = nome.trim().toLowerCase();
    const paisBusca = pais.trim().toLowerCase();

    const resultados = arrayGravadoras.filter(gravadora =>
        gravadora.nome.toLowerCase().includes(nomeBusca) &&
        gravadora.pais.toLowerCase().includes(paisBusca)
    );

    listar(resultados);
}

listar()
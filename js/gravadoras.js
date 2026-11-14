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

        fragmento.appendChild(linha);
    });

    tabela.replaceChildren(fragmento);
}

listar()
const tipo = document.getElementById("tipo");
const botao = document.getElementById("calcular");
const resultado = document.getElementById("resultado");

// Lê o valor de um campo como número
function ler(id) {
  return parseFloat(document.getElementById(id).value);
}

// Arredonda para no máximo 4 casas, sem zeros inúteis
function fmt(n) {
  return parseFloat(n.toFixed(4));
}

// Mostra ou esconde os campos a, b, c conforme o tipo
function mostrar(id, visivel) {
  document.getElementById(id).style.display = visivel ? "block" : "none";
}

function atualizarCampos() {
  const t = tipo.value;
  mostrar("campo-a", t === "afim" || t === "linear" || t === "quadratica");
  mostrar("campo-b", t === "constante" || t === "afim" || t === "quadratica");
  mostrar("campo-c", t === "quadratica");
}

// Calcula f(x0), f'(x0) e os textos das fórmulas
function calcular(t, a, b, c, x0) {
  switch (t) {
    case "constante":
      return {
        fTexto: `f(x) = ${b}`,
        dTexto: "f'(x) = 0",
        f0: b,
        d0: 0,
      };
    case "afim":
      return {
        fTexto: `f(x) = ${a}x + ${b}`,
        dTexto: `f'(x) = ${a}`,
        f0: a * x0 + b,
        d0: a,
      };
    case "linear":
      return {
        fTexto: `f(x) = ${a}x`,
        dTexto: `f'(x) = ${a}`,
        f0: a * x0,
        d0: a,
      };
    case "quadratica":
      return {
        fTexto: `f(x) = ${a}x² + ${b}x + ${c}`,
        dTexto: `f'(x) = 2·${a}·x + ${b}`,
        f0: a * x0 * x0 + b * x0 + c,
        d0: 2 * a * x0 + b,
      };
    case "modular":
      return {
        fTexto: "f(x) = |x|",
        dTexto: "f'(x) = -1 se x < 0 | +1 se x > 0 | não existe em x = 0",
        f0: Math.abs(x0),
        d0: x0 > 0 ? 1 : x0 < 0 ? -1 : null, // null = não existe
      };
  }
}

function mostrarResultado() {
  const t = tipo.value;
  const a = ler("a");
  const b = ler("b");
  const c = ler("c");
  const x0 = ler("x0");

  // Validação: se algum campo visível estiver vazio, avisa
  if (isNaN(x0) || isNaN(a) || isNaN(b) || isNaN(c)) {
    resultado.innerHTML = "<p>Preencha todos os campos com números.</p>";
    return;
  }

  const r = calcular(t, a, b, c, x0);

  let html = `
    <p><b>${r.fTexto}</b></p>
    <p><b>${r.dTexto}</b></p>
    <p>f(${x0}) = ${fmt(r.f0)}</p>
  `;

  if (r.d0 === null) {
    html += `
      <p>f'(${x0}) não existe.</p>
      <p>Derivada pela esquerda = -1 e pela direita = +1.
      Como são diferentes, a função tem um "ponto de quina" em x = 0.</p>
    `;
  } else {
    const m = fmt(r.d0);
    const y0 = fmt(r.f0);
    html += `
      <p>f'(${x0}) = ${m} (inclinação da reta tangente)</p>
      <p>Reta tangente: y = ${y0} + ${m}·(x − ${x0})</p>
    `;
  }

  resultado.innerHTML = html;
}

tipo.addEventListener("change", atualizarCampos);
botao.addEventListener("click", mostrarResultado);

atualizarCampos();
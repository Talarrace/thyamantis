// Configuração das Vantagens
const vantagensLista = [
  "Arma DD+1", "Briga DD+1", "Arco DD+1", "Esquiva+1.0", 
  "Proteção+1.0", "Montaria +1", "Evasão+1", "Velocidade do Golpe+1.0",
  "Dano Adicional+1", "Resistência+1/2", "Força Superior+1/2", 
  "Vontade+1", "Regeneração+1", "Carisma+1", "Aprendizado+1",
  "Crítico+1", "Mana +1", "Proteção Mágica+1.0"
];

// Criar campos de vantagens
const vantagensDiv = document.getElementById("vantagens");
vantagensLista.forEach(vantagem => {
  const div = document.createElement("div");
  div.className = "input-vantagem";
  div.innerHTML = `
      <label>${vantagem}</label>
      <input type="number" min="0" value="0" 
          class="vantagem-quantidade" 
          data-vantagem="${vantagem}">
  `;
  vantagensDiv.appendChild(div);
});

// Função principal de cálculo
function calcularFicha() {
  // Coletar dados
  const dados = {
      nome: document.getElementById("nome").value || "Herói Sem Nome",
      peso: parseFloat(document.getElementById("peso").value) || 0,
      altura: parseFloat(document.getElementById("altura").value) || 0,
      porte: {
          base: parseFloat(document.getElementById("porte_base").value) || 0,
          bonus: parseFloat(document.getElementById("porte_bonus").value) || 0,
          total() { return this.base + this.bonus }
      },
      movimento: {
          base: parseFloat(document.getElementById("movimento_base").value) || 0,
          bonus: parseFloat(document.getElementById("movimento_bonus").value) || 0,
          total() { return this.base + this.bonus }
      },
      conhecimento: {
          base: parseFloat(document.getElementById("conhecimento_base").value) || 0,
          bonus: parseFloat(document.getElementById("conhecimento_bonus").value) || 0,
          total() { return this.base + this.bonus }
      },
      arsenal: {
          pesoArma: parseFloat(document.getElementById("peso_arma").value) || 0,
          grauArmadura: parseFloat(document.getElementById("grau_armadura").value) || 0,
          forcaArco: parseFloat(document.getElementById("forca_arco").value) || 0
      }
  };

  // Cálculos de Combate
  const calculos = {
      forca: (dados.peso / 100) * dados.porte.total(),
      velocidade: dados.movimento.total() * 0.2,
      resistencia: dados.altura * dados.porte.total(),
      danoComum: (dados.porte.total() + dados.arsenal.pesoArma) * dados.movimento.total(),
      danoBal: dados.porte.total() + dados.arsenal.forcaArco,
      protecao: 1.0 + (dados.movimento.total() + dados.arsenal.grauArmadura),
      protecaoBal: 1.0 + (dados.arsenal.grauArmadura * 0.5),
      protecaoMag: 1.0 + (dados.conhecimento.total() * 0.2)
  };

  // Cálculo de Vantagens
  let vantagensHTML = '';
  let pontosGastos = 0;
  
  document.querySelectorAll(".vantagem-quantidade").forEach(input => {
      const qtd = parseInt(input.value) || 0;
      if(qtd > 0) {
          vantagensHTML += `<li>${input.dataset.vantagem} <strong>(x${qtd})</strong></li>`;
          pontosGastos += Math.pow(2, qtd - 1);
      }
  });

  const desconto = parseFloat(document.getElementById("desconto_vantagens").value) || 0;
  const pontosGastosFinal = Math.max(pontosGastos - desconto, 0);
  const totalAprendizado = (parseFloat(document.getElementById("valor_aprendizado").value) || 0) + dados.conhecimento.total();

  // Gerar Ficha Final
  const fichaHTML = `
      <h3>🗒️ Ficha de ${dados.nome}</h3>
      
      <div class="ficha-grid">
          <div class="info-card">
              <h4>📊 Atributos Básicos</h4>
              <ul>
                  <li>🏋️ Peso: ${dados.peso} kg</li>
                  <li>📏 Altura: ${dados.altura} m</li>
                  <li>💼 Porte Total: ${dados.porte.total()}</li>
              </ul>
          </div>

          <div class="info-card">
              <h4>⚔️ Combate</h4>
              <ul>
                  <li>💪 Força: ${calculos.forca.toFixed(1)}</li>
                  <li>⚡ Velocidade: ${calculos.velocidade.toFixed(1)}</li>
                  <li>🛡️ Proteção: ${calculos.protecao.toFixed(1)}</li>
                  <li>🗡️ Dano Físico: ${calculos.danoComum.toFixed(1)}</li>
                  <li>🏹 Dano à Distância: ${calculos.danoBal.toFixed(1)}</li>
              </ul>
          </div>

          <div class="info-card">
              <h4>🛡️ Defesas</h4>
              <ul>
                  <li>🎯 Proteção Balística: ${calculos.protecaoBal.toFixed(1)}</li>
                  <li>🔮 Proteção Mágica: ${calculos.protecaoMag.toFixed(1)}</li>
                  <li>❤️ Resistência: ${calculos.resistencia.toFixed(1)}</li>
              </ul>
          </div>

          ${vantagensHTML ? `
          <div class="info-card">
              <h4>🌟 Vantagens</h4>
              <ul>${vantagensHTML}</ul>
          </div>` : ''}

          <div class="info-card">
              <h4>📚 Progresso</h4>
              <ul>
                  <li>🎓 Aprendizado Total: ${totalAprendizado}</li>
                  <li>🔑 Pontos Gastos: ${pontosGastosFinal}</li>
              </ul>
          </div>
      </div>
  `;

  document.getElementById("ficha_final").innerHTML = fichaHTML;
}

// Event Listeners
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', calcularFicha);
});

// Inicialização
document.addEventListener('DOMContentLoaded', calcularFicha);
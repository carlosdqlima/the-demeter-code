/**
 * Módulo de pontuação
 * Responsável pelo cálculo e atualização dos indicadores de produtividade e sustentabilidade
 */

// Configuração do sistema de pontuação
const scoreConfig = {
    // Fatores que afetam a produtividade
    productivityFactors: {
        irrigation: 0.2,    // Irrigação adequada
        fertilizer: 0.15,   // Uso de fertilizantes
        pesticide: 0.1,     // Uso de pesticidas
        technology: 0.25,   // Tecnologias desbloqueadas
        weather: 0.3        // Condições climáticas
    },
    
    // Fatores que afetam a sustentabilidade
    sustainabilityFactors: {
        waterUsage: 0.3,    // Uso eficiente de água
        fertilizer: -0.2,   // Impacto negativo de fertilizantes
        pesticide: -0.25,   // Impacto negativo de pesticidas
        cropDiversity: 0.15, // Diversidade de culturas
        technology: 0.1     // Tecnologias sustentáveis
    }
};

/**
 * Inicializa o sistema de pontuação
 */
function initScore() {
    // Define os valores iniciais
    gameState.productivity = 50;
    gameState.sustainability = 50;
    
    // Atualiza a interface
    updateScoreDisplay();
}

/**
 * Atualiza a exibição da pontuação na interface
 */
function updateScoreDisplay() {
    // Atualiza as barras de progresso
    const productivityBar = document.getElementById('productivity-bar');
    const sustainabilityBar = document.getElementById('sustainability-bar');
    
    if (productivityBar) {
        productivityBar.style.width = `${gameState.productivity}%`;
        productivityBar.textContent = `${Math.round(gameState.productivity)}%`;
    }
    
    if (sustainabilityBar) {
        sustainabilityBar.style.width = `${gameState.sustainability}%`;
        sustainabilityBar.textContent = `${Math.round(gameState.sustainability)}%`;
    }
    
    // Atualiza os valores numéricos
    const productivityValue = document.getElementById('productivity-value');
    const sustainabilityValue = document.getElementById('sustainability-value');
    
    if (productivityValue) {
        productivityValue.textContent = Math.round(gameState.productivity);
    }
    
    if (sustainabilityValue) {
        sustainabilityValue.textContent = Math.round(gameState.sustainability);
    }
    
    // Atualiza as classes de status
    updateStatusClasses();
}

/**
 * Atualiza as classes de status com base nos valores atuais
 */
function updateStatusClasses() {
    const productivityStatus = document.getElementById('productivity-status');
    const sustainabilityStatus = document.getElementById('sustainability-status');
    
    if (productivityStatus) {
        // Remove classes anteriores
        productivityStatus.classList.remove('status-low', 'status-medium', 'status-high');
        
        // Adiciona a classe apropriada
        if (gameState.productivity < 30) {
            productivityStatus.classList.add('status-low');
            productivityStatus.textContent = 'Baixa';
        } else if (gameState.productivity < 70) {
            productivityStatus.classList.add('status-medium');
            productivityStatus.textContent = 'Média';
        } else {
            productivityStatus.classList.add('status-high');
            productivityStatus.textContent = 'Alta';
        }
    }
    
    if (sustainabilityStatus) {
        // Remove classes anteriores
        sustainabilityStatus.classList.remove('status-low', 'status-medium', 'status-high');
        
        // Adiciona a classe apropriada
        if (gameState.sustainability < 30) {
            sustainabilityStatus.classList.add('status-low');
            sustainabilityStatus.textContent = 'Baixa';
        } else if (gameState.sustainability < 70) {
            sustainabilityStatus.classList.add('status-medium');
            sustainabilityStatus.textContent = 'Média';
        } else {
            sustainabilityStatus.classList.add('status-high');
            sustainabilityStatus.textContent = 'Alta';
        }
    }
}

/**
 * Atualiza o valor de produtividade
 * @param {number} change - Valor a ser adicionado/subtraído da produtividade
 */
function updateProductivity(change) {
    gameState.productivity = Math.max(0, Math.min(100, gameState.productivity + change));
    updateScoreDisplay();
}

/**
 * Atualiza o valor de sustentabilidade
 * @param {number} change - Valor a ser adicionado/subtraído da sustentabilidade
 */
function updateSustainability(change) {
    gameState.sustainability = Math.max(0, Math.min(100, gameState.sustainability + change));
    updateScoreDisplay();
}

/**
 * Calcula a pontuação final com base na produtividade e sustentabilidade
 * @returns {number} Pontuação final
 */
function calculateFinalScore() {
    // Pontuação base é a média ponderada entre produtividade e sustentabilidade
    const baseScore = (gameState.productivity * 0.6) + (gameState.sustainability * 0.4);
    
    // Multiplicador baseado no dinheiro acumulado
    const moneyMultiplier = 1 + (gameState.money / 10000);
    
    // Multiplicador baseado no ciclo atual
    const cycleMultiplier = 1 + (gameState.cycle / 20);
    
    // Pontuação final
    const finalScore = Math.round(baseScore * moneyMultiplier * cycleMultiplier);
    
    return finalScore;
}

/**
 * Exibe a pontuação final em um modal
 */
function showFinalScore() {
    const finalScore = calculateFinalScore();
    
    // Cria o conteúdo do modal
    const modalContent = `
        <h2>Pontuação Final</h2>
        <div class="final-score">${finalScore}</div>
        <div class="score-breakdown">
            <div class="score-item">
                <span>Produtividade:</span>
                <span>${Math.round(gameState.productivity)}%</span>
            </div>
            <div class="score-item">
                <span>Sustentabilidade:</span>
                <span>${Math.round(gameState.sustainability)}%</span>
            </div>
            <div class="score-item">
                <span>Dinheiro acumulado:</span>
                <span>$${gameState.money}</span>
            </div>
            <div class="score-item">
                <span>Ciclos completados:</span>
                <span>${gameState.cycle}</span>
            </div>
        </div>
        <button id="restart-game">Jogar Novamente</button>
    `;
    
    // Exibe o modal
    showModal(modalContent);
    
    // Adiciona evento ao botão de reiniciar
    document.getElementById('restart-game').addEventListener('click', () => {
        resetGame();
        closeModal();
    });
}
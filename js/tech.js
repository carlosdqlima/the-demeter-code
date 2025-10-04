/**
 * Módulo de tecnologias
 * Responsável pelo gerenciamento da árvore tecnológica e desbloqueio de novas tecnologias
 */

// Configuração das tecnologias
const techConfig = {
    technologies: {
        // Culturas
        arroz: {
            name: 'Arroz',
            category: 'Culturas',
            cost: 50,
            description: 'Uma cultura resistente que se adapta bem a áreas úmidas.',
            effect: () => {
                // Adiciona arroz às culturas disponíveis
                farmConfig.crops.arroz = {
                    icon: '🌾',
                    growthTime: 3,
                    waterNeeded: 30,
                    value: 55,
                    sustainabilityImpact: 0
                };
                
                // Adiciona botão de semente
                addSeedButton('arroz', 'Arroz');
            }
        },
        algodao: {
            name: 'Algodão',
            category: 'Culturas',
            cost: 75,
            description: 'Uma cultura de alto valor, mas que requer mais água.',
            effect: () => {
                // Adiciona algodão às culturas disponíveis
                farmConfig.crops.algodao = {
                    icon: '☁️',
                    growthTime: 5,
                    waterNeeded: 35,
                    value: 80,
                    sustainabilityImpact: -10
                };
                
                // Adiciona botão de semente
                addSeedButton('algodao', 'Algodão');
            }
        },
        
        // Irrigação
        gotejamento: {
            name: 'Irrigação por Gotejamento',
            category: 'Irrigação',
            cost: 100,
            description: 'Sistema de irrigação eficiente que reduz o consumo de água.',
            effect: () => {
                // Reduz o custo de irrigação
                farmState.irrigationCost = 5;
                
                // Aumenta a sustentabilidade
                updateSustainability(15);
                
                // Atualiza o botão de irrigação
                document.getElementById('btn-irrigate').textContent = 'Irrigação por Gotejamento';
            }
        },
        
        // Monitoramento
        drones: {
            name: 'Drones de Monitoramento',
            category: 'Monitoramento',
            cost: 150,
            description: 'Drones equipados com câmeras para monitorar a saúde das culturas.',
            effect: () => {
                // Aumenta a produtividade
                updateProductivity(10);
                
                // Adiciona um novo botão de ação
                addDroneMonitoringButton();
            }
        }
    }
};

/**
 * Inicializa o sistema de tecnologias
 */
function initTech() {
    // Adiciona eventos de clique aos botões de desbloqueio
    const unlockButtons = document.querySelectorAll('.unlock-btn');
    
    unlockButtons.forEach(button => {
        const techId = button.parentElement.dataset.tech;
        
        button.addEventListener('click', () => {
            unlockTechnology(techId);
        });
    });
    
    // Atualiza o estado inicial dos botões
    updateTechButtons();
}

/**
 * Atualiza o estado dos botões de tecnologia
 */
function updateTechButtons() {
    const unlockButtons = document.querySelectorAll('.unlock-btn');
    
    unlockButtons.forEach(button => {
        const techId = button.parentElement.dataset.tech;
        const tech = techConfig.technologies[techId];
        
        // Verifica se a tecnologia já foi desbloqueada
        if (gameState.unlockedTechnologies.includes(techId)) {
            button.textContent = 'Desbloqueado';
            button.disabled = true;
            return;
        }
        
        // Verifica se há pontos de pesquisa suficientes
        if (gameState.research >= tech.cost) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

/**
 * Desbloqueia uma tecnologia
 * @param {string} techId - ID da tecnologia a ser desbloqueada
 */
function unlockTechnology(techId) {
    const tech = techConfig.technologies[techId];
    
    if (!tech) {
        console.error(`Tecnologia ${techId} não encontrada!`);
        return;
    }
    
    // Verifica se já foi desbloqueada
    if (gameState.unlockedTechnologies.includes(techId)) {
        console.log(`Tecnologia ${tech.name} já foi desbloqueada.`);
        return;
    }
    
    // Verifica se há pontos de pesquisa suficientes
    if (gameState.research < tech.cost) {
        console.log(`Pontos de pesquisa insuficientes para desbloquear ${tech.name}.`);
        return;
    }
    
    // Deduz o custo
    gameState.research -= tech.cost;
    
    // Adiciona à lista de tecnologias desbloqueadas
    gameState.unlockedTechnologies.push(techId);
    
    // Aplica o efeito da tecnologia
    tech.effect();
    
    // Atualiza a interface
    updateUI();
    updateTechButtons();
    
    console.log(`Tecnologia ${tech.name} desbloqueada com sucesso!`);
    
    // Mostra uma mensagem de sucesso
    alert(`Tecnologia Desbloqueada: ${tech.name}`);
}

/**
 * Adiciona um botão de semente para uma nova cultura
 * @param {string} seedId - ID da semente
 * @param {string} seedName - Nome da semente
 */
function addSeedButton(seedId, seedName) {
    const seedSelection = document.querySelector('.seed-selection');
    
    // Verifica se o botão já existe
    if (document.querySelector(`.seed-btn[data-seed="${seedId}"]`)) {
        return;
    }
    
    // Cria o botão
    const button = document.createElement('button');
    button.className = 'seed-btn';
    button.dataset.seed = seedId;
    button.textContent = seedName;
    
    // Adiciona o evento de clique
    button.addEventListener('click', () => {
        gameState.selectedSeed = seedId;
        gameState.selectedTool = 'plant';
        updateUI();
    });
    
    // Adiciona o botão à seleção de sementes
    seedSelection.appendChild(button);
}

/**
 * Adiciona um botão para monitoramento com drones
 */
function addDroneMonitoringButton() {
    const controlGroup = document.querySelector('.control-group:nth-child(3)');
    
    // Verifica se o botão já existe
    if (document.getElementById('btn-drone')) {
        return;
    }
    
    // Cria o botão
    const button = document.createElement('button');
    button.id = 'btn-drone';
    button.textContent = 'Monitoramento com Drones';
    
    // Adiciona o evento de clique
    button.addEventListener('click', () => {
        // Aumenta temporariamente a produtividade
        updateProductivity(5);
        
        // Atualiza a interface
        updateUI();
        
        alert('Drones enviados! Produtividade aumentada em 5%.');
    });
    
    // Adiciona o botão ao grupo de controles
    controlGroup.appendChild(button);
}
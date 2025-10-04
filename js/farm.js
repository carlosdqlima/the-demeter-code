/**
 * Módulo de gerenciamento da fazenda
 * Responsável pela criação, renderização e interação com a fazenda virtual
 */

// Configuração da fazenda
const farmConfig = {
    gridSize: {
        rows: 6,
        cols: 6
    },
    plotStates: {
        empty: 'empty',
        planted: 'planted',
        growing: 'growing',
        ready: 'ready',
        dry: 'dry'
    },
    crops: {
        milho: {
            icon: '🌽',
            growthTime: 3,
            waterNeeded: 20,
            value: 50,
            sustainabilityImpact: 0
        },
        soja: {
            icon: '🌱',
            growthTime: 2,
            waterNeeded: 15,
            value: 40,
            sustainabilityImpact: 5
        },
        trigo: {
            icon: '🌾',
            growthTime: 4,
            waterNeeded: 25,
            value: 60,
            sustainabilityImpact: -5
        }
    }
};

// Estado da fazenda
const farmState = {
    plots: [],
    selectedPlot: null,
    irrigationCost: 10,
    fertilizationCost: 15,
    pesticideCost: 20,
    weatherCondition: 'normal', // normal, drought, rainy
    soilQuality: 'normal' // poor, normal, rich
};

/**
 * Inicializa a fazenda
 */
function initFarm() {
    // Cria a grade da fazenda
    createFarmGrid();
    
    // Adiciona os eventos de clique nos plots
    addPlotClickEvents();
}

/**
 * Cria a grade da fazenda
 */
function createFarmGrid() {
    const farmGrid = document.getElementById('farm-grid');
    farmGrid.innerHTML = '';
    
    // Inicializa o array de plots
    farmState.plots = [];
    
    // Cria os plots da fazenda
    for (let i = 0; i < farmConfig.gridSize * farmConfig.gridSize; i++) {
        // Cria o elemento do plot
        const plot = document.createElement('div');
        plot.className = 'farm-plot empty';
        plot.dataset.index = i;
        
        // Adiciona o plot à grade
        farmGrid.appendChild(plot);
        
        // Adiciona o plot ao estado da fazenda
        farmState.plots.push({
            index: i,
            state: farmConfig.plotStates.empty,
            crop: null,
            growthStage: 0,
            irrigated: false,
            fertilized: false,
            pesticide: false
        });
    }
}

/**
 * Adiciona eventos de clique aos plots da fazenda
 */
function addPlotClickEvents() {
    const plots = document.querySelectorAll('.farm-plot');
    
    plots.forEach(plot => {
        plot.addEventListener('click', () => {
            const index = parseInt(plot.dataset.index);
            handlePlotClick(index);
        });
    });
}

/**
 * Manipula o clique em um plot da fazenda
 * @param {number} index - Índice do plot clicado
 */
function handlePlotClick(index) {
    // Seleciona o plot
    selectPlot(index);
    
    // Executa a ação selecionada
    if (gameState.selectedTool) {
        executeAction(index, gameState.selectedTool);
    }
}

/**
 * Seleciona um plot da fazenda
 * @param {number} index - Índice do plot a ser selecionado
 */
function selectPlot(index) {
    // Remove a seleção anterior
    if (farmState.selectedPlot !== null) {
        const previousPlot = document.querySelector(`.farm-plot[data-index="${farmState.selectedPlot}"]`);
        if (previousPlot) {
            previousPlot.classList.remove('selected');
        }
    }
    
    // Seleciona o novo plot
    farmState.selectedPlot = index;
    const plot = document.querySelector(`.farm-plot[data-index="${index}"]`);
    plot.classList.add('selected');
}

/**
 * Executa uma ação em um plot
 * @param {number} index - Índice do plot
 * @param {string} action - Ação a ser executada (plant, irrigate, fertilize, pesticide, harvest)
 */
function executeAction(index, action) {
    const plot = farmState.plots[index];
    
    switch (action) {
        case 'plant':
            plantCrop(index);
            break;
        case 'irrigate':
            irrigatePlot(index);
            break;
        case 'fertilize':
            fertilizePlot(index);
            break;
        case 'pesticide':
            applyPesticide(index);
            break;
        case 'harvest':
            harvestPlot(index);
            break;
    }
    
    // Atualiza a renderização da fazenda
    renderFarm();
    
    // Atualiza a interface do usuário
    updateUI();
}

/**
 * Planta uma cultura em um plot
 * @param {number} index - Índice do plot
 */
function plantCrop(index) {
    const plot = farmState.plots[index];
    const selectedSeed = gameState.selectedSeed;
    
    // Verifica se o plot está vazio
    if (plot.state !== farmConfig.plotStates.empty) {
        console.log('Este plot já está plantado.');
        return;
    }
    
    // Verifica se uma semente foi selecionada
    if (!selectedSeed || !farmConfig.crops[selectedSeed]) {
        console.log('Selecione uma semente primeiro.');
        return;
    }
    
    // Verifica se há dinheiro suficiente
    const seedCost = 10; // Custo fixo para todas as sementes
    if (gameState.money < seedCost) {
        console.log('Dinheiro insuficiente para plantar.');
        return;
    }
    
    // Planta a cultura
    plot.state = farmConfig.plotStates.planted;
    plot.crop = selectedSeed;
    plot.growthStage = 0;
    
    // Deduz o custo
    gameState.money -= seedCost;
    
    // Atualiza a sustentabilidade
    updateSustainability(farmConfig.crops[selectedSeed].sustainabilityImpact);
    
    console.log(`${selectedSeed} plantado com sucesso!`);
}

/**
 * Irriga um plot
 * @param {number} index - Índice do plot
 */
function irrigatePlot(index) {
    const plot = farmState.plots[index];
    
    // Verifica se o plot está plantado
    if (plot.state === farmConfig.plotStates.empty) {
        console.log('Não há nada plantado neste plot.');
        return;
    }
    
    // Verifica se já está irrigado
    if (plot.irrigated) {
        console.log('Este plot já está irrigado.');
        return;
    }
    
    // Verifica se há água suficiente
    if (gameState.water < farmState.irrigationCost) {
        console.log('Água insuficiente para irrigar.');
        return;
    }
    
    // Irriga o plot
    plot.irrigated = true;
    
    // Se o plot estiver seco, restaura para o estado normal
    if (plot.state === farmConfig.plotStates.dry) {
        plot.state = plot.growthStage >= farmConfig.crops[plot.crop].growthTime ? 
            farmConfig.plotStates.ready : 
            farmConfig.plotStates.growing;
    }
    
    // Deduz o custo
    gameState.water -= farmState.irrigationCost;
    
    // Atualiza a sustentabilidade (uso consciente de água)
    updateSustainability(5);
    
    console.log('Plot irrigado com sucesso!');
}

/**
 * Fertiliza um plot
 * @param {number} index - Índice do plot
 */
function fertilizePlot(index) {
    const plot = farmState.plots[index];
    
    // Verifica se o plot está plantado
    if (plot.state === farmConfig.plotStates.empty) {
        console.log('Não há nada plantado neste plot.');
        return;
    }
    
    // Verifica se já está fertilizado
    if (plot.fertilized) {
        console.log('Este plot já está fertilizado.');
        return;
    }
    
    // Verifica se há dinheiro suficiente
    if (gameState.money < farmState.fertilizationCost) {
        console.log('Dinheiro insuficiente para fertilizar.');
        return;
    }
    
    // Fertiliza o plot
    plot.fertilized = true;
    
    // Deduz o custo
    gameState.money -= farmState.fertilizationCost;
    
    // Atualiza a sustentabilidade (fertilizantes químicos têm impacto negativo)
    updateSustainability(-10);
    
    console.log('Plot fertilizado com sucesso!');
}

/**
 * Aplica pesticida em um plot
 * @param {number} index - Índice do plot
 */
function applyPesticide(index) {
    const plot = farmState.plots[index];
    
    // Verifica se o plot está plantado
    if (plot.state === farmConfig.plotStates.empty) {
        console.log('Não há nada plantado neste plot.');
        return;
    }
    
    // Verifica se já tem pesticida
    if (plot.pesticide) {
        console.log('Este plot já tem pesticida aplicado.');
        return;
    }
    
    // Verifica se há dinheiro suficiente
    if (gameState.money < farmState.pesticideCost) {
        console.log('Dinheiro insuficiente para aplicar pesticida.');
        return;
    }
    
    // Aplica pesticida
    plot.pesticide = true;
    
    // Deduz o custo
    gameState.money -= farmState.pesticideCost;
    
    // Atualiza a sustentabilidade (pesticidas químicos têm impacto negativo)
    updateSustainability(-15);
    
    console.log('Pesticida aplicado com sucesso!');
}

/**
 * Colhe um plot
 * @param {number} index - Índice do plot
 */
function harvestPlot(index) {
    const plot = farmState.plots[index];
    
    // Verifica se o plot está pronto para colheita
    if (plot.state !== farmConfig.plotStates.ready) {
        console.log('Este plot não está pronto para colheita.');
        return;
    }
    
    // Calcula o valor da colheita
    const crop = farmConfig.crops[plot.crop];
    let harvestValue = crop.value;
    
    // Bônus por fertilização
    if (plot.fertilized) {
        harvestValue *= 1.5;
    }
    
    // Adiciona o valor ao dinheiro
    gameState.money += harvestValue;
    
    // Calcula pontos de pesquisa ganhos
    const researchPoints = Math.floor(harvestValue / 10);
    gameState.research += researchPoints;
    
    // Atualiza a produtividade
    updateProductivity(10);
    
    // Limpa o plot
    plot.state = farmConfig.plotStates.empty;
    plot.crop = null;
    plot.growthStage = 0;
    plot.irrigated = false;
    plot.fertilized = false;
    plot.pesticide = false;
    
    // Mostra o modal de colheita
    showHarvestResults(harvestValue, researchPoints);
    
    console.log(`Colheita realizada com sucesso! Ganhou $${harvestValue} e ${researchPoints} pontos de pesquisa.`);
}

/**
 * Mostra os resultados da colheita
 * @param {number} value - Valor da colheita
 * @param {number} research - Pontos de pesquisa ganhos
 */
function showHarvestResults(value, research) {
    // Atualiza os valores no modal
    document.getElementById('productivity-value').textContent = `${gameState.productivity}%`;
    document.getElementById('sustainability-value').textContent = `${gameState.sustainability}%`;
    document.getElementById('research-gained').textContent = research;
    document.getElementById('profit-gained').textContent = `$${value}`;
    
    // Atualiza as barras de progresso
    document.getElementById('harvest-productivity').style.width = `${gameState.productivity}%`;
    document.getElementById('harvest-sustainability').style.width = `${gameState.sustainability}%`;
    
    // Mostra o modal
    document.getElementById('harvest-modal').style.display = 'block';
}

/**
 * Processa o crescimento das culturas
 */
function growCrops() {
    farmState.plots.forEach(plot => {
        // Pula plots vazios
        if (plot.state === farmConfig.plotStates.empty) {
            return;
        }
        
        // Verifica se o plot está irrigado
        if (!plot.irrigated) {
            // Chance de secar se não estiver irrigado
            if (Math.random() < 0.7) {
                plot.state = farmConfig.plotStates.dry;
                return;
            }
        }
        
        // Reseta a irrigação a cada ciclo
        plot.irrigated = false;
        
        // Incrementa o estágio de crescimento
        if (plot.state !== farmConfig.plotStates.dry) {
            plot.growthStage++;
            
            // Verifica se a cultura está pronta para colheita
            if (plot.growthStage >= farmConfig.crops[plot.crop].growthTime) {
                plot.state = farmConfig.plotStates.ready;
            } else {
                plot.state = farmConfig.plotStates.growing;
            }
        }
    });
    
    // Renderiza a fazenda atualizada
    renderFarm();
}

/**
 * Renderiza a fazenda
 */
function renderFarm() {
    farmState.plots.forEach((plot, index) => {
        const plotElement = document.querySelector(`.farm-plot[data-index="${index}"]`);
        
        // Atualiza as classes do plot
        plotElement.className = `farm-plot ${plot.state}`;
        if (index === farmState.selectedPlot) {
            plotElement.classList.add('selected');
        }
        if (plot.irrigated) {
            plotElement.classList.add('irrigated');
        }
        if (plot.fertilized) {
            plotElement.classList.add('fertilized');
        }
        
        // Limpa o conteúdo anterior
        plotElement.innerHTML = '';
        
        // Adiciona o ícone da cultura se houver uma plantada
        if (plot.crop) {
            const cropIcon = document.createElement('span');
            cropIcon.className = 'crop-icon';
            cropIcon.textContent = farmConfig.crops[plot.crop].icon;
            plotElement.appendChild(cropIcon);
        }
    });
}

/**
 * Atualiza a pontuação de produtividade
 * @param {number} value - Valor a ser adicionado à produtividade
 */
function updateProductivity(value) {
    gameState.productivity = Math.min(100, Math.max(0, gameState.productivity + value));
}

/**
 * Atualiza a pontuação de sustentabilidade
 * @param {number} value - Valor a ser adicionado à sustentabilidade
 */
function updateSustainability(value) {
    gameState.sustainability = Math.min(100, Math.max(0, gameState.sustainability + value));
}
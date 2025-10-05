/**
 * Arquivo principal do jogo The Demeter Code
 * Responsável pela inicialização e controle geral do jogo
 */

// Estado global do jogo
const gameState = {
    money: 1000,
    water: 500,
    research: 0,
    currentDay: 1,
    maxDays: 365,
    productivity: 50,
    sustainability: 85,
    selectedTool: null,
    selectedSeed: 'milho', // Semente padrão selecionada
    unlockedTechnologies: [],
    activeChallenges: [],
    activeSection: 'farm',
    // Dados da NASA para o dashboard
    nasaData: {
        soilMoisture: 60,
        temperature: 25,
        precipitation: 40,
        vegetationIndex: 0.72,
        cropGrowth: 80
    }
};

// Elementos DOM
const elements = {
    // Recursos no header
    dayCounter: document.getElementById('day-counter'),
    moneyDisplay: document.getElementById('money-display'),
    waterDisplay: document.getElementById('water-display'),
    sustainabilityDisplay: document.getElementById('sustainability-display'),
    
    // Área da fazenda
    farmArea: document.getElementById('farm-area'),
    
    // Controles de ação
    plantBtn: document.getElementById('plant-btn'),
    irrigateBtn: document.getElementById('irrigate-btn'),
    harvestBtn: document.getElementById('harvest-btn'),
    upgradesBtn: document.getElementById('upgrades-btn'),
    
    // Status da plantação
    soilMoisture: document.getElementById('soil-moisture'),
    soilMoistureBar: document.getElementById('soil-moisture-bar'),
    cropGrowth: document.getElementById('crop-growth'),
    cropGrowthBar: document.getElementById('crop-growth-bar'),
    

    

    
    // Configurações
    settingsBtn: document.getElementById('settings-btn')
};

/**
 * Inicializa o jogo
 */
function initGame() {
    console.log('Inicializando NASA Farm Navigators...');
    
    // Inicializar sistemas
    initEventListeners();
    updateUI();
    
    // Inicializar dados da NASA se disponível
    if (typeof initData === 'function') {
        initData();
    }
    
    // Inicializar mapa da fazenda
    setTimeout(() => {
        initFarmMap();
        // As camadas da NASA agora são gerenciadas pelo data.js
    }, 500); // Pequeno delay para garantir que o DOM esteja totalmente carregado
    
    console.log('Jogo inicializado com sucesso!');
}

/**
 * Inicializa os event listeners
 */
function initEventListeners() {
    // Controles de ação
    if (elements.plantBtn) {
        elements.plantBtn.addEventListener('click', plantCrop);
    }
    
    if (elements.irrigateBtn) {
        elements.irrigateBtn.addEventListener('click', irrigateCrop);
    }
    
    if (elements.harvestBtn) {
        elements.harvestBtn.addEventListener('click', harvestCrop);
    }
    
    if (elements.upgradesBtn) {
        elements.upgradesBtn.addEventListener('click', showUpgrades);
    }
    
    // Configurar drag and drop de ações
    setupActionDragDrop();
    

    
    // Controles da integração NASA
    const dataSourceSelect = document.getElementById('data-source');
    if (dataSourceSelect) {
        dataSourceSelect.addEventListener('change', handleDataSourceChange);
    }
    
    const updateDataBtn = document.getElementById('update-data');
    if (updateDataBtn) {
        updateDataBtn.addEventListener('click', handleUpdateData);
    }
    
    const locationSelect = document.getElementById('location-select');
    if (locationSelect) {
        locationSelect.addEventListener('change', handleLocationChange);
    }
    
    // Controles de zoom
    if (elements.zoomIn) {
        elements.zoomIn.addEventListener('click', zoomIn);
    }
    
    if (elements.zoomOut) {
        elements.zoomOut.addEventListener('click', zoomOut);
    }
    
    // Configurações
    if (elements.settingsBtn) {
        elements.settingsBtn.addEventListener('click', openSettings);
    }
    
    // Área da fazenda - clique para plantar
    if (elements.farmArea) {
        elements.farmArea.addEventListener('click', handleFarmClick);
    }
    
    // Redimensionamento do mapa
    window.addEventListener('resize', resizeFarmMap);
}

/**
 * Atualiza a interface do usuário
 */
function updateUI() {
    // Atualizar recursos no header
    if (elements.dayCounter) {
        elements.dayCounter.textContent = gameState.currentDay;
    }
    
    if (elements.moneyDisplay) {
        elements.moneyDisplay.textContent = `$${gameState.money.toLocaleString()}`;
    }
    
    if (elements.waterDisplay) {
        elements.waterDisplay.textContent = `${gameState.water}L`;
    }
    
    if (elements.sustainabilityDisplay) {
        elements.sustainabilityDisplay.textContent = `${gameState.sustainability}%`;
    }
    
    // Atualizar status da plantação
    updatePlantationStatus();
}

/**
 * Atualiza o status da plantação
 */
function updatePlantationStatus() {
    // Atualizar umidade do solo
    if (elements.soilMoisture) {
        elements.soilMoisture.textContent = `${gameState.nasaData.soilMoisture}%`;
    }
    
    if (elements.soilMoistureBar) {
        elements.soilMoistureBar.style.width = `${gameState.nasaData.soilMoisture}%`;
        
        // Atualizar cor baseada no nível
        if (gameState.nasaData.soilMoisture < 30) {
            elements.soilMoistureBar.className = 'h-2 bg-alert-orange rounded-full transition-all duration-300';
        } else if (gameState.nasaData.soilMoisture < 60) {
            elements.soilMoistureBar.className = 'h-2 bg-water-blue rounded-full transition-all duration-300';
        } else {
            elements.soilMoistureBar.className = 'h-2 bg-vibrant-green rounded-full transition-all duration-300';
        }
    }
    
    // Atualizar crescimento da cultura
    if (elements.cropGrowth) {
        elements.cropGrowth.textContent = `${gameState.nasaData.cropGrowth}%`;
    }
    
    if (elements.cropGrowthBar) {
        elements.cropGrowthBar.style.width = `${gameState.nasaData.cropGrowth}%`;
    }
}

/**
 * Planta uma cultura na fazenda
 */
function plantCrop() {
    if (gameState.money >= 50) {
        gameState.money -= 50;
        gameState.nasaData.cropGrowth = Math.min(100, gameState.nasaData.cropGrowth + 20);
        
        // Animação visual da fazenda
        if (elements.farmArea) {
            elements.farmArea.classList.add('animate-pulse');
            setTimeout(() => {
                elements.farmArea.classList.remove('animate-pulse');
            }, 1000);
        }
        
        updateUI();
        showNotification('Cultura plantada com sucesso!', 'success');
    } else {
        showNotification('Dinheiro insuficiente para plantar!', 'error');
    }
}

/**
 * Irriga a plantação
 */
function irrigateCrop() {
    if (gameState.water >= 50) {
        gameState.water -= 50;
        gameState.nasaData.soilMoisture = Math.min(100, gameState.nasaData.soilMoisture + 25);
        gameState.nasaData.cropGrowth = Math.min(100, gameState.nasaData.cropGrowth + 10);
        
        updateUI();
        showNotification('Plantação irrigada!', 'success');
    } else {
        showNotification('Água insuficiente para irrigar!', 'error');
    }
}

/**
 * Colhe a plantação
 */
function harvestCrop() {
    if (gameState.nasaData.cropGrowth >= 80) {
        const harvest = Math.floor(gameState.nasaData.cropGrowth * 5);
        gameState.money += harvest;
        gameState.nasaData.cropGrowth = 0;
        gameState.sustainability = Math.min(100, gameState.sustainability + 2);
        
        updateUI();
        showNotification(`Colheita realizada! +$${harvest}`, 'success');
    } else {
        showNotification('Cultura ainda não está pronta para colheita!', 'warning');
    }
}

/**
 * Mostra upgrades disponíveis
 */
function showUpgrades() {
    showNotification('Sistema de upgrades em desenvolvimento!', 'info');
}



/**
 * Controle de zoom in
 */
function zoomIn() {
    showNotification('Zoom aumentado!', 'info');
}

/**
 * Controle de zoom out
 */
function zoomOut() {
    showNotification('Zoom diminuído!', 'info');
}

/**
 * Abre configurações
 */
function openSettings() {
    showNotification('Configurações em desenvolvimento!', 'info');
}

/**
 * Manipula cliques na área da fazenda
 */
function handleFarmClick(event) {
    // Simula interação com a fazenda
    const rect = elements.farmArea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    console.log(`Clique na fazenda: ${x}, ${y}`);
    showNotification('Área da fazenda selecionada!', 'info');
}

/**
 * Avança para o próximo dia
 */
function nextDay() {
    gameState.currentDay++;
    
    // Simula mudanças diárias
    gameState.water = Math.max(0, gameState.water - 20);
    gameState.nasaData.soilMoisture = Math.max(0, gameState.nasaData.soilMoisture - 5);
    gameState.nasaData.cropGrowth = Math.min(100, gameState.nasaData.cropGrowth + 3);
    
    updateUI();
    showNotification(`Dia ${gameState.currentDay} iniciado!`, 'info');
}

/**
 * Mostra notificações para o usuário
 */
function showNotification(message, type = 'info') {
    // Obter container de notificações
    const container = document.getElementById('notifications-container');
    if (!container) {
        console.warn('Container de notificações não encontrado');
        return;
    }
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `relative px-4 py-3 rounded-lg shadow-glow shadow-primary/20 text-sm font-medium transition-all duration-300 transform translate-x-full pointer-events-auto backdrop-blur-sm`;
    
    // Definir cores baseadas no tipo
    switch (type) {
        case 'success':
            notification.className += ' bg-vibrant-green/20 border border-vibrant-green/30 text-vibrant-green shadow-vibrant-green/20';
            break;
        case 'error':
            notification.className += ' bg-alert-orange/20 border border-alert-orange/30 text-alert-orange shadow-alert-orange/20';
            break;
        case 'warning':
            notification.className += ' bg-alert-orange/20 border border-alert-orange/30 text-alert-orange shadow-alert-orange/20';
            break;
        default:
            notification.className += ' bg-primary/20 border border-primary/30 text-primary shadow-primary/20';
    }
    
    // Adicionar ícone baseado no tipo
    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };
    
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">${icons[type] || icons.info}</span>
            <span>${message}</span>
            <button class="ml-2 opacity-60 hover:opacity-100 transition-opacity" onclick="this.parentElement.parentElement.remove()">
                <span class="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
    `;
    
    // Adicionar ao container
    container.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remover após 4 segundos (aumentado para dar tempo de ler)
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

// ===== FUNÇÕES DA INTEGRAÇÃO NASA =====

/**
 * Manipula mudança na fonte de dados (NASA vs Simulado)
 */
function handleDataSourceChange(event) {
    const useNASAData = event.target.value === 'nasa';
    
    if (typeof toggleNASAData === 'function') {
        toggleNASAData(useNASAData);
        
        // Atualiza status visual
        const statusElement = document.getElementById('nasa-status');
        if (statusElement) {
            const indicator = statusElement.querySelector('div');
            const text = statusElement.querySelector('span');
            
            if (useNASAData) {
                indicator.className = 'w-2 h-2 bg-vibrant-green rounded-full animate-pulse';
                text.textContent = 'Conectado';
                text.className = 'text-sm text-vibrant-green';
            } else {
                indicator.className = 'w-2 h-2 bg-alert-orange rounded-full';
                text.textContent = 'Simulado';
                text.className = 'text-sm text-alert-orange';
            }
        }
        
        showNotification(
            useNASAData ? 'Alternado para dados reais da NASA' : 'Alternado para dados simulados',
            'info'
        );
    }
}

/**
 * Manipula atualização manual dos dados
 */
function handleUpdateData() {
    const dataSource = document.getElementById('data-source')?.value;
    const location = document.getElementById('location-select')?.value;
    
    if (typeof updateNasaData === 'function' && location) {
        updateNasaData(location);
        showNotification(`Dados atualizados para ${location}`, 'success');
    }
    
    if (dataSource === 'nasa' && typeof initNASAIntegration === 'function') {
        initNASAIntegration();
    }
}

/**
 * Manipula mudança de localização
 */
function handleLocationChange(event) {
    const locationId = event.target.value;
    const locationName = event.target.selectedOptions[0].text;
    
    // Coordenadas das diferentes localizações
    const locationCoordinates = {
        'brasilia': [-15.7942, -47.8822],
        'goiania': [-16.6869, -49.2648],
        'cuiaba': [-15.6014, -56.0979],
        'palmas': [-10.1689, -48.3317]
    };
    
    // Atualiza dados da NASA
    if (typeof updateNasaData === 'function') {
        updateNasaData(locationId);
    }
    
    // Atualiza localização no mapa da fazenda
    const coordinates = locationCoordinates[locationId];
    if (coordinates && farmMap) {
        updateFarmLocation(coordinates[0], coordinates[1], locationName);
    }
    
    showNotification(`Localização alterada para ${locationName}`, 'info');
}

// Variáveis globais para o mapa da fazenda
let farmMap = null;
let farmMarker = null;
let farmPolygon = null;
let selectedArea = null; // Nova variável para área selecionada
let isSelecting = false; // Flag para modo de seleção
let selectionStart = null; // Ponto inicial da seleção

// Variáveis globais para drag and drop de ações
let draggedAction = null;
let dragGhost = null;
let isDraggingAction = false;

/**
 * Inicializa o mapa interativo da fazenda
 */
function initFarmMap() {
    try {
        // Coordenadas da fazenda (exemplo: região de Brasília)
        const farmCoordinates = [-15.7942, -47.8822];
        const farmBounds = [
            [-15.7962, -47.8842],
            [-15.7922, -47.8802]
        ];

        // Inicializa o mapa
        farmMap = L.map('farm-map', {
            center: farmCoordinates,
            zoom: 16,
            zoomControl: false,
            attributionControl: true
        });

        // Adiciona camada base (OpenStreetMap)
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        });

        // Adiciona camada de satélite (Esri)
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
            maxZoom: 19
        });

        // Adiciona camada de terreno
        const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors',
            maxZoom: 17
        });

        // Define camada padrão
        osmLayer.addTo(farmMap);

        // Adiciona marcador da fazenda
        farmMarker = L.marker(farmCoordinates, {
            title: 'Fazenda NASA Farm Navigators'
        }).addTo(farmMap);

        farmMarker.bindPopup(`
            <div style="text-align: center;">
                <h4 style="margin: 0 0 10px 0; color: var(--azul-orbital);">🌾 Fazenda NASA Farm Navigators</h4>
                <p style="margin: 0; font-size: 12px;">Localização: Brasília, DF</p>
                <p style="margin: 5px 0 0 0; font-size: 12px;">Área: ~2.5 hectares</p>
            </div>
        `);

        // Adiciona polígono da área da fazenda
        farmPolygon = L.rectangle(farmBounds, {
            color: '#2E8540',
            weight: 2,
            fillColor: '#2E8540',
            fillOpacity: 0.2
        }).addTo(farmMap);

        farmPolygon.bindPopup('Área cultivável da fazenda');

        // Configura controles do mapa
        setupMapControls(osmLayer, satelliteLayer, terrainLayer);

        // Configura eventos de seleção por arrasto
        setupAreaSelection();

        // Remove indicador de carregamento
        hideMapLoading();

        console.log('Mapa da fazenda inicializado com sucesso');

    } catch (error) {
        console.error('Erro ao inicializar mapa da fazenda:', error);
        showMapError();
    }
}

/**
 * Configura os controles personalizados do mapa (agora no cabeçalho)
 */
function setupMapControls(osmLayer, satelliteLayer, terrainLayer) {
    // Buscar os novos botões no cabeçalho pelos IDs
    const satelliteBtn = document.getElementById('map-satellite');
    const terrainBtn = document.getElementById('map-terrain');
    const layersBtn = document.getElementById('map-layers');

    // Controle de camada satélite
    if (satelliteBtn) {
        satelliteBtn.addEventListener('click', () => {
            farmMap.eachLayer(layer => {
                if (layer._url && layer._url.includes('tile')) {
                    farmMap.removeLayer(layer);
                }
            });
            satelliteLayer.addTo(farmMap);
            updateActiveControl(satelliteBtn);
        });
    }

    // Controle de camada terreno
    if (terrainBtn) {
        terrainBtn.addEventListener('click', () => {
            farmMap.eachLayer(layer => {
                if (layer._url && layer._url.includes('tile')) {
                    farmMap.removeLayer(layer);
                }
            });
            terrainLayer.addTo(farmMap);
            updateActiveControl(terrainBtn);
        });
    }

    // Botão de camadas agora é apenas visual - checkboxes estão sempre visíveis

    // Controle de fullscreen
    const fullscreenBtn = document.getElementById('farm-map-fullscreen');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const mapContainer = document.querySelector('.farm-map-container');
            if (mapContainer) {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    mapContainer.requestFullscreen().catch(err => {
                        console.log('Erro ao entrar em fullscreen:', err);
                    });
                }
            }
        });
    }
}

/**
 * Atualiza o controle ativo visualmente
 */
function updateActiveControl(activeBtn) {
    const controls = document.querySelectorAll('.map-control-btn');
    controls.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

/**
 * Remove o indicador de carregamento do mapa
 */
function hideMapLoading() {
    const loadingElement = document.querySelector('.map-loading');
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

/**
 * Mostra erro no carregamento do mapa
 */
function showMapError() {
    const mapContainer = document.querySelector('.farm-map-container');
    const loadingElement = document.querySelector('.map-loading');
    
    if (loadingElement) {
        loadingElement.innerHTML = `
            <div style="text-align: center; color: var(--vermelho-critico);">
                <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i>
                <p>Erro ao carregar o mapa</p>
                <button onclick="initFarmMap()" style="margin-top: 10px; padding: 5px 10px; background: var(--azul-orbital); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Tentar novamente
                </button>
            </div>
        `;
    }
}

/**
 * Configura a funcionalidade de seleção de área por arrasto
 */
function setupAreaSelection() {
    let isDrawing = false;
    let startLatLng = null;
    let currentRectangle = null;
    let selectionHint = null;
    let tooltip = null;

    // Cria hint de seleção
    createSelectionHint();
    
    // Cria tooltip de instruções
    createSelectionTooltip();

    // Evento de mouse down - inicia seleção
    farmMap.on('mousedown', function(e) {
        if (e.originalEvent.shiftKey) { // Só ativa com Shift pressionado
            isDrawing = true;
            startLatLng = e.latlng;
            
            // Desabilita o arrasto do mapa temporariamente
            farmMap.dragging.disable();
            
            // Adiciona classe de seleção ao container
            farmMap.getContainer().classList.add('selecting');
            
            // Mostra hint de seleção
            showSelectionHint();
            
            // Previne outros eventos
            e.originalEvent.preventDefault();
        }
    });

    // Evento de mouse move - atualiza seleção
    farmMap.on('mousemove', function(e) {
        if (isDrawing && startLatLng) {
            // Remove retângulo anterior se existir
            if (currentRectangle) {
                farmMap.removeLayer(currentRectangle);
            }
            
            // Cria novo retângulo
            const bounds = L.latLngBounds(startLatLng, e.latlng);
            currentRectangle = L.rectangle(bounds, {
                color: '#FF6B35',
                weight: 2,
                fillColor: '#FF6B35',
                fillOpacity: 0.3,
                dashArray: '5, 5'
            }).addTo(farmMap);
            
            // Atualiza tooltip com área atual
            updateSelectionTooltip(e.originalEvent, bounds);
        } else {
            // Mostra tooltip de instruções quando Shift está pressionado
            if (e.originalEvent.shiftKey && !isDrawing) {
                showInstructionTooltip(e.originalEvent);
            } else {
                hideTooltip();
            }
        }
    });

    // Evento de mouse up - finaliza seleção
    farmMap.on('mouseup', function(e) {
        if (isDrawing) {
            isDrawing = false;
            
            // Reabilita o arrasto do mapa
            farmMap.dragging.enable();
            
            // Remove classe de seleção
            farmMap.getContainer().classList.remove('selecting');
            
            // Esconde hint
            hideSelectionHint();
            hideTooltip();
            
            if (startLatLng && currentRectangle) {
                // Finaliza a seleção
                finalizeAreaSelection(startLatLng, e.latlng);
            }
            
            startLatLng = null;
        }
    });

    // Evento para cancelar seleção com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isDrawing) {
            cancelAreaSelection();
            hideSelectionHint();
            hideTooltip();
        }
    });

    // Eventos de teclado para mostrar/esconder tooltip
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Shift' && !isDrawing) {
            farmMap.getContainer().style.cursor = 'crosshair';
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.key === 'Shift' && !isDrawing) {
            farmMap.getContainer().style.cursor = '';
            hideTooltip();
        }
    });

    /**
     * Cria o hint de seleção
     */
    function createSelectionHint() {
        selectionHint = document.createElement('div');
        selectionHint.className = 'area-selection-hint';
        selectionHint.textContent = 'Arraste para selecionar área';
        document.getElementById('farm-map').appendChild(selectionHint);
    }

    /**
     * Cria o tooltip de instruções
     */
    function createSelectionTooltip() {
        tooltip = document.createElement('div');
        tooltip.className = 'selection-tooltip';
        document.body.appendChild(tooltip);
    }

    /**
     * Mostra o hint de seleção
     */
    function showSelectionHint() {
        if (selectionHint) {
            selectionHint.classList.add('show');
        }
    }

    /**
     * Esconde o hint de seleção
     */
    function hideSelectionHint() {
        if (selectionHint) {
            selectionHint.classList.remove('show');
        }
    }

    /**
     * Mostra tooltip de instruções
     */
    function showInstructionTooltip(mouseEvent) {
        if (tooltip) {
            tooltip.textContent = 'Mantenha Shift + clique e arraste para selecionar área';
            tooltip.style.left = (mouseEvent.clientX + 10) + 'px';
            tooltip.style.top = (mouseEvent.clientY - 30) + 'px';
            tooltip.classList.add('show');
        }
    }

    /**
     * Atualiza tooltip durante seleção
     */
    function updateSelectionTooltip(mouseEvent, bounds) {
        if (tooltip && bounds) {
            const area = calculateAreaFromBounds(bounds);
            const hectares = (area / 10000).toFixed(2);
            tooltip.textContent = `Área: ${hectares} hectares`;
            tooltip.style.left = (mouseEvent.clientX + 10) + 'px';
            tooltip.style.top = (mouseEvent.clientY - 30) + 'px';
            tooltip.classList.add('show');
        }
    }

    /**
     * Esconde tooltip
     */
    function hideTooltip() {
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }
}

/**
 * Finaliza a seleção de área
 * @param {L.LatLng} startLatLng - Coordenada inicial
 * @param {L.LatLng} endLatLng - Coordenada final
 */
function finalizeAreaSelection(startLatLng, endLatLng) {
    // Remove área selecionada anterior
    if (selectedArea) {
        farmMap.removeLayer(selectedArea);
    }
    
    // Cria nova área selecionada
    const bounds = L.latLngBounds(startLatLng, endLatLng);
    selectedArea = L.rectangle(bounds, {
        color: '#FF6B35',
        weight: 3,
        fillColor: '#FF6B35',
        fillOpacity: 0.4,
        className: 'selected-area-animation'
    }).addTo(farmMap);
    
    // Calcula área em hectares
    const areaInSquareMeters = calculateAreaFromBounds(bounds);
    const areaInHectares = (areaInSquareMeters / 10000).toFixed(2);
    
    // Adiciona popup com informações
    selectedArea.bindPopup(`
        <div style="text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: #FF6B35;">📍 Área Selecionada</h4>
            <p style="margin: 0; font-size: 12px;">Área: ${areaInHectares} hectares</p>
            <p style="margin: 5px 0 0 0; font-size: 11px;">
                Coordenadas:<br>
                ${bounds.getNorth().toFixed(6)}, ${bounds.getWest().toFixed(6)}<br>
                ${bounds.getSouth().toFixed(6)}, ${bounds.getEast().toFixed(6)}
            </p>
            <button onclick="clearSelectedArea()" class="area-popup-button">
                Limpar Seleção
            </button>
        </div>
    `).openPopup();
    
    // Atualiza as coordenadas no cabeçalho com animação
    updateSelectedAreaCoordinates(bounds, areaInHectares);
    
    // Mostra notificação
    showNotification(`Área de ${areaInHectares} hectares selecionada! Use Shift + arrastar para selecionar nova área.`, 'success');
}

/**
 * Cancela a seleção atual
 */
function cancelAreaSelection() {
    if (currentRectangle) {
        farmMap.removeLayer(currentRectangle);
        currentRectangle = null;
    }
    
    isDrawing = false;
    farmMap.dragging.enable();
    farmMap.getContainer().classList.remove('selecting');
    farmMap.getContainer().style.cursor = '';
    startLatLng = null;
}

/**
 * Limpa a área selecionada
 */
function clearSelectedArea() {
    if (selectedArea) {
        farmMap.removeLayer(selectedArea);
        selectedArea = null;
        
        // Restaura coordenadas originais no cabeçalho
        updateSelectedAreaCoordinates(null, null);
        
        showNotification('Seleção de área removida.', 'info');
    }
}

/**
 * Calcula a área em metros quadrados a partir dos bounds
 * @param {L.LatLngBounds} bounds - Limites da área
 * @returns {number} Área em metros quadrados
 */
function calculateAreaFromBounds(bounds) {
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();
    
    // Conversão aproximada de graus para metros (na latitude de Brasília)
    const latToMeters = 111320; // metros por grau de latitude
    const lngToMeters = 111320 * Math.cos(Math.abs(north + south) / 2 * Math.PI / 180); // metros por grau de longitude
    
    const width = Math.abs(east - west) * lngToMeters;
    const height = Math.abs(north - south) * latToMeters;
    
    return width * height;
}

/**
 * Atualiza as coordenadas da área selecionada no cabeçalho
 * @param {L.LatLngBounds} bounds - Limites da área selecionada
 * @param {string} area - Área em hectares
 */
function updateSelectedAreaCoordinates(bounds, area) {
    const coordinatesElement = document.getElementById('farm-coordinates-header');
    
    if (coordinatesElement) {
        // Adiciona animação de destaque
        coordinatesElement.classList.add('coordinates-updated');
        
        setTimeout(() => {
            coordinatesElement.classList.remove('coordinates-updated');
        }, 1000);
        
        if (bounds && area) {
            // Atualiza com nova seleção
            coordinatesElement.innerHTML = `
                <div style="font-size: 0.75rem; color: #FF6B35;">
                    <strong>Área Selecionada: ${area} ha</strong><br>
                    ${bounds.getNorth().toFixed(4)}, ${bounds.getWest().toFixed(4)}<br>
                    ${bounds.getSouth().toFixed(4)}, ${bounds.getEast().toFixed(4)}
                </div>
            `;
        } else {
            // Restaura coordenadas originais
            coordinatesElement.innerHTML = `
                <div style="font-size: 0.75rem; color: #666;">
                    15°47'39"S, 47°52'56"W<br>
                    15°47'32"S, 47°52'49"W
                </div>
            `;
        }
    }
}

/**
 * Redimensiona o mapa quando necessário
 */
function resizeFarmMap() {
    if (farmMap) {
        setTimeout(() => {
            farmMap.invalidateSize();
        }, 100);
    }
}

/**
 * Atualiza a localização da fazenda no mapa
 */
function updateFarmLocation(lat, lng, locationName) {
    if (!farmMap || !farmMarker) return;

    const newCoordinates = [lat, lng];
    
    // Atualiza posição do marcador
    farmMarker.setLatLng(newCoordinates);
    
    // Atualiza popup do marcador
    farmMarker.bindPopup(`
        <div style="text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: var(--azul-orbital);">🌾 Fazenda NASA Farm Navigators</h4>
            <p style="margin: 0; font-size: 12px;">Localização: ${locationName}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Área: ~2.5 hectares</p>
        </div>
    `);
    
    // Centraliza o mapa na nova localização
    farmMap.setView(newCoordinates, 16);
    
    // Atualiza polígono da fazenda
    if (farmPolygon) {
        const offset = 0.002;
        const newBounds = [
            [lat - offset, lng - offset],
            [lat + offset, lng + offset]
        ];
        farmPolygon.setBounds(newBounds);
    }
    
    console.log(`Localização da fazenda atualizada para: ${locationName}`);
}

/**
 * Configura eventos de drag and drop para as ações
 */
function setupActionDragDrop() {
    const actionButtons = document.querySelectorAll('[data-action]');
    
    actionButtons.forEach(button => {
        // Eventos de drag
        button.addEventListener('dragstart', handleActionDragStart);
        button.addEventListener('dragend', handleActionDragEnd);
        
        // Previne o comportamento padrão de clique durante drag
        button.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Botão esquerdo
                setTimeout(() => {
                    if (isDraggingAction) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, 100);
            }
        });
    });
    
    // Configurar área de drop no mapa
    const mapContainer = document.getElementById('farm-map');
    if (mapContainer) {
        mapContainer.addEventListener('dragover', handleMapDragOver);
        mapContainer.addEventListener('drop', handleMapDrop);
        mapContainer.addEventListener('dragenter', handleMapDragEnter);
        mapContainer.addEventListener('dragleave', handleMapDragLeave);
    }
}

/**
 * Manipula o início do arrasto de uma ação
 */
function handleActionDragStart(e) {
    isDraggingAction = true;
    draggedAction = e.target.closest('[data-action]').dataset.action;
    const button = e.target.closest('[data-action]');
    
    // Criar elemento fantasma personalizado
    createDragGhost(e.target);
    
    // Configurar dados de transferência
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', draggedAction);
    
    // Adicionar classe visual ao botão sendo arrastado
    button.classList.add('dragging');
    
    // Adicionar efeito de vibração e feedback tátil
    addEnhancedDragFeedback(button);
    
    // Mostrar feedback visual no mapa
    showMapDropZone();
    
    // Mostrar tooltip de instrução
    showDragTooltip('Arraste para o mapa para executar a ação');
    
    // Adicionar efeito de vibração sutil
    addDragStartEffect(button);
    
    // Adicionar efeito de ondulação nos outros botões
    addSiblingButtonsEffect(button);
}

/**
 * Adiciona efeito visual no início do drag
 */
function addDragStartEffect(element) {
    // Criar ondas de energia ao redor do botão
    const ripples = document.createElement('div');
    ripples.className = 'drag-ripples';
    ripples.style.position = 'absolute';
    ripples.style.top = '0';
    ripples.style.left = '0';
    ripples.style.width = '100%';
    ripples.style.height = '100%';
    ripples.style.pointerEvents = 'none';
    ripples.style.borderRadius = '8px';
    ripples.style.background = 'radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%)';
    ripples.style.animation = 'dragRipple 0.6s ease-out';
    
    element.style.position = 'relative';
    element.appendChild(ripples);
    
    // Remover após animação
    setTimeout(() => {
        if (ripples.parentNode) {
            ripples.parentNode.removeChild(ripples);
        }
    }, 600);
}

/**
 * Adiciona feedback visual aprimorado ao botão durante drag
 */
function addEnhancedDragFeedback(button) {
    // Criar overlay de energia
    const energyOverlay = document.createElement('div');
    energyOverlay.className = 'drag-energy-overlay';
    energyOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        border-radius: inherit;
        pointer-events: none;
        animation: energyPulse 1.5s ease-in-out infinite;
        z-index: 1;
    `;
    
    // Criar partículas de energia
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'drag-particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        pointer-events: none;
        z-index: 2;
    `;
    
    // Adicionar partículas flutuantes
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: currentColor;
            border-radius: 50%;
            opacity: 0.8;
            animation: dragParticleFloat ${1.5 + Math.random() * 0.5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 0.5}s;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            box-shadow: 0 0 4px currentColor;
        `;
        particlesContainer.appendChild(particle);
    }
    
    button.style.position = 'relative';
    button.appendChild(energyOverlay);
    button.appendChild(particlesContainer);
}

/**
 * Adiciona efeito sutil aos botões irmãos
 */
function addSiblingButtonsEffect(draggedButton) {
    const allActionButtons = document.querySelectorAll('[data-action]');
    allActionButtons.forEach(button => {
        if (button !== draggedButton) {
            button.style.transition = 'all 0.3s ease';
            button.style.opacity = '0.6';
            button.style.transform = 'scale(0.95)';
            button.style.filter = 'grayscale(0.3)';
        }
    });
}

/**
 * Remove efeito dos botões irmãos
 */
function removeSiblingButtonsEffect() {
    const allActionButtons = document.querySelectorAll('[data-action]');
    allActionButtons.forEach(button => {
        button.style.opacity = '';
        button.style.transform = '';
        button.style.filter = '';
    });
}

/**
 * Manipula o fim do arrasto de uma ação
 */
function handleActionDragEnd(e) {
    isDraggingAction = false;
    draggedAction = null;
    const button = e.target.closest('[data-action]');
    
    // Remover classe visual
    button.classList.remove('dragging');
    
    // Remover efeitos visuais adicionados
    const energyOverlay = button.querySelector('.drag-energy-overlay');
    const particlesContainer = button.querySelector('.drag-particles-container');
    
    if (energyOverlay) energyOverlay.remove();
    if (particlesContainer) particlesContainer.remove();
    
    // Remover efeito dos botões irmãos
    removeSiblingButtonsEffect();
    
    // Limpar feedback visual
    hideMapDropZone();
    hideDragTooltip();
    
    // Remover elemento fantasma
    if (dragGhost) {
        // Animação de saída suave
        dragGhost.style.transition = 'all 0.3s ease';
        dragGhost.style.opacity = '0';
        dragGhost.style.transform = 'scale(0.5) rotate(45deg)';
        
        setTimeout(() => {
            if (dragGhost && dragGhost.parentNode) {
                document.body.removeChild(dragGhost);
            }
            dragGhost = null;
        }, 300);
    }
    
    // Adicionar efeito de sucesso ao botão
    button.classList.add('action-success');
    setTimeout(() => {
        button.classList.remove('action-success');
    }, 800);
}

/**
 * Cria elemento fantasma personalizado para o drag
 */
function createDragGhost(element) {
    const action = element.dataset.action;
    const actionData = {
        plant: { icon: 'eco', color: '#4CAF50', name: 'Plantar', emoji: '🌱' },
        irrigate: { icon: 'water_drop', color: '#2196F3', name: 'Irrigar', emoji: '💧' },
        harvest: { icon: 'agriculture', color: '#FF9800', name: 'Colher', emoji: '🌾' },
        upgrade: { icon: 'trending_up', color: '#9C27B0', name: 'Upgrade', emoji: '⚡' }
    };
    
    const data = actionData[action];
    if (!data) return;
    
    // Criar container principal do ghost
    dragGhost = document.createElement('div');
    dragGhost.className = 'drag-ghost-container';
    dragGhost.style.cssText = `
        position: fixed;
        top: -1000px;
        left: -1000px;
        pointer-events: none;
        z-index: 10000;
        transform: scale(1.2) rotate(-5deg);
        transition: all 0.2s ease;
        filter: drop-shadow(0 8px 25px rgba(0, 0, 0, 0.3));
    `;
    
    // Criar card do ghost
    const ghostCard = document.createElement('div');
    ghostCard.style.cssText = `
        background: linear-gradient(135deg, ${data.color}15, ${data.color}25);
        border: 2px solid ${data.color};
        border-radius: 12px;
        padding: 16px;
        min-width: 120px;
        text-align: center;
        backdrop-filter: blur(10px);
        box-shadow: 
            0 0 20px ${data.color}40,
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        animation: ghostFloat 0.6s ease-out;
    `;
    
    // Criar ícone principal
    const iconElement = document.createElement('div');
    iconElement.style.cssText = `
        font-family: 'Material Symbols Outlined';
        font-size: 32px;
        color: ${data.color};
        margin-bottom: 8px;
        text-shadow: 0 0 10px ${data.color}60;
        animation: iconPulse 1.5s ease-in-out infinite;
    `;
    iconElement.textContent = data.icon;
    
    // Criar emoji decorativo
    const emojiElement = document.createElement('div');
    emojiElement.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        font-size: 20px;
        background: white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        animation: emojiSpin 2s linear infinite;
    `;
    emojiElement.textContent = data.emoji;
    
    // Criar texto da ação
    const textElement = document.createElement('div');
    textElement.style.cssText = `
        color: ${data.color};
        font-weight: bold;
        font-size: 14px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        margin-top: 4px;
    `;
    textElement.textContent = data.name;
    
    // Criar efeito de partículas
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        border-radius: 12px;
    `;
    
    // Adicionar partículas flutuantes
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${data.color};
            border-radius: 50%;
            opacity: 0.7;
            animation: particleFloat ${1 + Math.random()}s ease-in-out infinite;
            animation-delay: ${Math.random() * 0.5}s;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            box-shadow: 0 0 6px ${data.color};
        `;
        particlesContainer.appendChild(particle);
    }
    
    // Montar o ghost
    ghostCard.style.position = 'relative';
    ghostCard.appendChild(iconElement);
    ghostCard.appendChild(textElement);
    ghostCard.appendChild(emojiElement);
    ghostCard.appendChild(particlesContainer);
    dragGhost.appendChild(ghostCard);
    
    document.body.appendChild(dragGhost);
    
    // Adicionar animação de entrada
    setTimeout(() => {
        if (dragGhost) {
            dragGhost.style.transform = 'scale(1) rotate(0deg)';
        }
    }, 50);
}

/**
 * Manipula dragover no mapa
 */
function handleMapDragOver(e) {
    if (draggedAction) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        
        // Atualizar posição do cursor no mapa
        updateDragCursor(e);
    }
}

/**
 * Manipula dragenter no mapa
 */
function handleMapDragEnter(e) {
    if (draggedAction) {
        e.preventDefault();
        document.getElementById('farm-map').classList.add('drag-over');
    }
}

/**
 * Manipula dragleave no mapa
 */
function handleMapDragLeave(e) {
    if (draggedAction && !e.relatedTarget?.closest('#farm-map')) {
        document.getElementById('farm-map').classList.remove('drag-over');
    }
}

/**
 * Manipula drop no mapa
 */
function handleMapDrop(e) {
    e.preventDefault();
    
    if (!draggedAction) return;
    
    // Obter coordenadas do drop
    const mapContainer = document.getElementById('farm-map');
    const rect = mapContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Converter coordenadas do pixel para coordenadas do mapa
    const latlng = farmMap.containerPointToLatLng([x, y]);
    
    // Executar ação baseada no tipo
    executeActionOnMap(draggedAction, latlng, { x, y });
    
    // Limpar estado
    document.getElementById('farm-map').classList.remove('drag-over');
}

/**
 * Executa a ação no mapa baseada no tipo
 */
function executeActionOnMap(action, latlng, pixelCoords) {
    const actionNames = {
        plant: 'Plantar',
        irrigate: 'Irrigar', 
        harvest: 'Colher',
        upgrade: 'Upgrade'
    };
    
    const actionIcons = {
        plant: 'eco',
        irrigate: 'water_drop',
        harvest: 'agriculture', 
        upgrade: 'trending_up'
    };
    
    // Adicionar efeito de impacto no local do drop
    addDropImpactEffect(pixelCoords);
    
    // Adicionar marcador temporário no local do drop
    addActionMarker(latlng, action, actionIcons[action]);
    
    // Mostrar notificação de sucesso com animação
    showAnimatedNotification(
        `${actionNames[action]} executado em ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`,
        'success',
        action
    );
    
    // Executar lógica específica da ação
    switch(action) {
        case 'plant':
            executePlantAction(latlng);
            break;
        case 'irrigate':
            executeIrrigateAction(latlng);
            break;
        case 'harvest':
            executeHarvestAction(latlng);
            break;
        case 'upgrade':
            executeUpgradeAction(latlng);
            break;
    }
}

/**
 * Adiciona efeito de impacto no local do drop
 */
function addDropImpactEffect(pixelCoords) {
    const mapContainer = document.getElementById('farm-map');
    const impact = document.createElement('div');
    impact.className = 'drop-impact-effect';
    impact.style.position = 'absolute';
    impact.style.left = (pixelCoords.x - 25) + 'px';
    impact.style.top = (pixelCoords.y - 25) + 'px';
    impact.style.width = '50px';
    impact.style.height = '50px';
    impact.style.borderRadius = '50%';
    impact.style.background = 'radial-gradient(circle, rgba(255, 107, 53, 0.8) 0%, rgba(255, 107, 53, 0.3) 50%, transparent 100%)';
    impact.style.animation = 'dropImpact 0.8s ease-out';
    impact.style.pointerEvents = 'none';
    impact.style.zIndex = '1000';
    
    mapContainer.appendChild(impact);
    
    // Remover após animação
    setTimeout(() => {
        if (impact.parentNode) {
            impact.parentNode.removeChild(impact);
        }
    }, 800);
}

/**
 * Mostra notificação animada baseada no tipo de ação
 */
function showAnimatedNotification(message, type, action) {
    const actionEmojis = {
        plant: '🌱',
        irrigate: '💧',
        harvest: '🌾',
        upgrade: '⚡'
    };
    
    const emoji = actionEmojis[action] || '✅';
    showNotification(`${emoji} ${message}`, type);
    
    // Adicionar efeito de partículas
    createActionParticles(action);
}

/**
 * Cria efeito de partículas baseado na ação
 */
function createActionParticles(action) {
    const colors = {
        plant: ['#4CAF50', '#8BC34A', '#CDDC39'],
        irrigate: ['#2196F3', '#03A9F4', '#00BCD4'],
        harvest: ['#FF9800', '#FFC107', '#FFEB3B'],
        upgrade: ['#9C27B0', '#E91E63', '#F44336']
    };
    
    const actionColors = colors[action] || colors.plant;
    
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            createParticle(actionColors[Math.floor(Math.random() * actionColors.length)]);
        }, i * 50);
    }
}

/**
 * Cria uma partícula individual
 */
function createParticle(color) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10000';
    
    // Posição inicial aleatória na tela
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    // Animação da partícula
    particle.style.animation = `particleFloat ${1 + Math.random() * 2}s ease-out forwards`;
    
    document.body.appendChild(particle);
    
    // Remover após animação
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 3000);
}

/**
 * Adiciona marcador de ação no mapa com design aprimorado e animações
 */
function addActionMarker(latlng, action, icon) {
    const actionConfig = {
        plant: {
            color: '#4CAF50',
            gradient: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #81C784 100%)',
            emoji: '🌱',
            name: 'Plantio',
            description: 'Sementes plantadas com sucesso'
        },
        irrigate: {
            color: '#2196F3',
            gradient: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 50%, #64B5F6 100%)',
            emoji: '💧',
            name: 'Irrigação',
            description: 'Sistema de irrigação ativado'
        },
        harvest: {
            color: '#FF9800',
            gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 50%, #FFCC02 100%)',
            emoji: '🌾',
            name: 'Colheita',
            description: 'Colheita realizada com sucesso'
        },
        upgrade: {
            color: '#9C27B0',
            gradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 50%, #CE93D8 100%)',
            emoji: '⚡',
            name: 'Upgrade',
            description: 'Sistema aprimorado'
        }
    };
    
    const config = actionConfig[action];
    
    const marker = L.marker(latlng, {
        icon: L.divIcon({
            className: 'enhanced-action-marker',
            html: `
                <div class="enhanced-marker-container">
                    <!-- Ondas de energia -->
                    <div class="marker-energy-waves">
                        <div class="energy-wave wave-1"></div>
                        <div class="energy-wave wave-2"></div>
                        <div class="energy-wave wave-3"></div>
                    </div>
                    
                    <!-- Marcador principal -->
                    <div class="enhanced-marker-content" style="background: ${config.gradient}; border-color: ${config.color};">
                        <!-- Brilho interno -->
                        <div class="marker-inner-glow"></div>
                        
                        <!-- Ícone principal -->
                        <div class="marker-icon-container">
                            <span class="material-symbols-outlined marker-main-icon">${icon}</span>
                        </div>
                        
                        <!-- Emoji decorativo -->
                        <div class="marker-emoji">${config.emoji}</div>
                        
                        <!-- Partículas flutuantes -->
                        <div class="marker-particles">
                            ${Array.from({length: 6}, (_, i) => `
                                <div class="marker-particle particle-${i + 1}" style="background-color: ${config.color};"></div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Sombra projetada -->
                    <div class="marker-shadow"></div>
                </div>
            `,
            iconSize: [60, 60],
            iconAnchor: [30, 30]
        })
    }).addTo(farmMap);
    
    // Popup aprimorado com design moderno
    marker.bindPopup(`
        <div class="enhanced-popup">
            <div class="popup-header" style="background: ${config.gradient};">
                <div class="popup-icon">
                    <span class="material-symbols-outlined">${icon}</span>
                </div>
                <div class="popup-emoji">${config.emoji}</div>
            </div>
            <div class="popup-content">
                <h3 class="popup-title">${config.name} Executado</h3>
                <p class="popup-description">${config.description}</p>
                <div class="popup-coordinates">
                    <span class="material-symbols-outlined">location_on</span>
                    <span>${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}</span>
                </div>
                <div class="popup-timestamp">
                    <span class="material-symbols-outlined">schedule</span>
                    <span>${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    `, {
        maxWidth: 280,
        className: 'enhanced-popup-container'
    }).openPopup();
    
    // Adicionar efeito de entrada com animação
    setTimeout(() => {
        const markerElement = marker.getElement();
        if (markerElement) {
            markerElement.classList.add('marker-entrance-animation');
        }
    }, 100);
    
    // Remover marcador após 8 segundos com animação de saída
    setTimeout(() => {
        const markerElement = marker.getElement();
        if (markerElement) {
            markerElement.classList.add('marker-exit-animation');
            setTimeout(() => {
                if (farmMap.hasLayer(marker)) {
                    farmMap.removeLayer(marker);
                }
            }, 500);
        }
    }, 8000);
}

/**
 * Executa ação de plantar
 */
function executePlantAction(latlng) {
    // Lógica específica para plantar
    console.log('Executando ação de plantar em:', latlng);
    // Aqui você pode adicionar a lógica específica do jogo
}

/**
 * Executa ação de irrigar
 */
function executeIrrigateAction(latlng) {
    // Lógica específica para irrigar
    console.log('Executando ação de irrigar em:', latlng);
    // Aqui você pode adicionar a lógica específica do jogo
}

/**
 * Executa ação de colher
 */
function executeHarvestAction(latlng) {
    // Lógica específica para colher
    console.log('Executando ação de colher em:', latlng);
    // Aqui você pode adicionar a lógica específica do jogo
}

/**
 * Executa ação de upgrade
 */
function executeUpgradeAction(latlng) {
    // Lógica específica para upgrade
    console.log('Executando ação de upgrade em:', latlng);
    // Aqui você pode adicionar a lógica específica do jogo
}

/**
 * Mostra zona de drop no mapa
 */
function showMapDropZone() {
    const mapContainer = document.getElementById('farm-map');
    mapContainer.classList.add('drop-zone-active');
}

/**
 * Esconde zona de drop no mapa
 */
function hideMapDropZone() {
    const mapContainer = document.getElementById('farm-map');
    mapContainer.classList.remove('drop-zone-active', 'drag-over');
}

/**
 * Mostra tooltip de drag com animação
 */
function showDragTooltip(message) {
    let tooltip = document.getElementById('drag-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'drag-tooltip';
        tooltip.className = 'drag-tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = message;
    tooltip.style.display = 'block';
    tooltip.style.animation = 'tooltipFadeIn 0.3s ease-out';
    
    // Seguir cursor
    document.addEventListener('mousemove', updateTooltipPosition);
}

/**
 * Esconde tooltip de drag com animação
 */
function hideDragTooltip() {
    const tooltip = document.getElementById('drag-tooltip');
    if (tooltip) {
        tooltip.style.animation = 'tooltipFadeOut 0.3s ease-out';
        setTimeout(() => {
            tooltip.style.display = 'none';
            document.removeEventListener('mousemove', updateTooltipPosition);
        }, 300);
    }
}

/**
 * Atualiza posição do tooltip
 */
function updateTooltipPosition(e) {
    const tooltip = document.getElementById('drag-tooltip');
    if (tooltip) {
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 30) + 'px';
    }
}

/**
 * Atualiza cursor durante drag
 */
function updateDragCursor(e) {
    // Adicionar feedback visual adicional se necessário
    const mapContainer = document.getElementById('farm-map');
    mapContainer.style.cursor = 'copy';
}

// Função toggleLayersPanel removida - checkboxes agora estão sempre visíveis

// Funções de camadas NASA removidas - agora gerenciadas pelo data.js

// Inicializa o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initGame);
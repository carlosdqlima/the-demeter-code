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
    
    // Dashboard de dados NASA
    dataDashboard: document.getElementById('data-dashboard'),
    openDataDashboard: document.getElementById('open-data-dashboard'),
    closeDashboard: document.getElementById('close-dashboard'),
    dataToggle: document.getElementById('data-toggle'),
    
    // Controles de zoom
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out'),
    
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
    
    // Dashboard de dados NASA
    if (elements.openDataDashboard) {
        elements.openDataDashboard.addEventListener('click', openDataDashboard);
    }
    
    if (elements.closeDashboard) {
        elements.closeDashboard.addEventListener('click', closeDataDashboard);
    }
    
    if (elements.dataToggle) {
        elements.dataToggle.addEventListener('click', toggleDataDashboard);
    }
    
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
    
    // Event listeners para seleção de regiões
    initRegionSelectionListeners();
}

/**
 * Inicializa os event listeners para seleção de regiões
 */
function initRegionSelectionListeners() {
    // Event listeners para as opções de região
    document.querySelectorAll('.region-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const regionId = e.currentTarget.getAttribute('data-region');
            selectRegionFromMap(regionId);
        });
    });

    // Event listener para o botão de alterar região
    const changeRegionBtn = document.getElementById('change-region-btn');
    if (changeRegionBtn) {
        changeRegionBtn.addEventListener('click', () => {
            // Scroll para a seção de seleção de região
            const regionSelector = document.getElementById('region-selector');
            if (regionSelector) {
                regionSelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Adiciona efeito visual temporário
                regionSelector.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.5)';
                setTimeout(() => {
                    regionSelector.style.boxShadow = '';
                }, 2000);
            }
        });
    }
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
 * Abre o dashboard de dados NASA
 */
function openDataDashboard() {
    if (elements.dataDashboard) {
        elements.dataDashboard.classList.remove('hidden');
        elements.dataDashboard.classList.add('flex');
    }
}

/**
 * Fecha o dashboard de dados NASA
 */
function closeDataDashboard() {
    if (elements.dataDashboard) {
        elements.dataDashboard.classList.add('hidden');
        elements.dataDashboard.classList.remove('flex');
    }
}

/**
 * Alterna o dashboard de dados NASA
 */
function toggleDataDashboard() {
    if (elements.dataDashboard) {
        if (elements.dataDashboard.classList.contains('hidden')) {
            openDataDashboard();
        } else {
            closeDataDashboard();
        }
    }
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
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-glow shadow-primary/20 text-sm font-medium transition-all duration-300 transform translate-x-full`;
    
    // Definir cores baseadas no tipo
    switch (type) {
        case 'success':
            notification.className += ' bg-vibrant-green/20 border border-vibrant-green/30 text-vibrant-green';
            break;
        case 'error':
            notification.className += ' bg-alert-orange/20 border border-alert-orange/30 text-alert-orange';
            break;
        case 'warning':
            notification.className += ' bg-alert-orange/20 border border-alert-orange/30 text-alert-orange';
            break;
        default:
            notification.className += ' bg-primary/20 border border-primary/30 text-primary';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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
let regionMarkers = [];

// Dados das regiões disponíveis
const regionData = {
    'brasilia': {
        name: 'Brasília',
        state: 'Distrito Federal',
        coords: [-15.7942, -47.8822],
        climate: 'Tropical de altitude',
        suitability: 'Excelente',
        suitabilityClass: 'suitability-excellent',
        icon: '🏛️',
        description: 'Capital federal com clima estável e boa infraestrutura'
    },
    'goiania': {
        name: 'Goiânia',
        state: 'Goiás',
        coords: [-16.6869, -49.2648],
        climate: 'Tropical semi-úmido',
        suitability: 'Excelente',
        suitabilityClass: 'suitability-excellent',
        icon: '🌾',
        description: 'Região agrícola tradicional com solo fértil'
    },
    'cuiaba': {
        name: 'Cuiabá',
        state: 'Mato Grosso',
        coords: [-15.6014, -56.0979],
        climate: 'Tropical quente',
        suitability: 'Bom',
        suitabilityClass: 'suitability-good',
        icon: '🌿',
        description: 'Portal de entrada do Pantanal com grande potencial agrícola'
    },
    'palmas': {
        name: 'Palmas',
        state: 'Tocantins',
        coords: [-10.1689, -48.3317],
        climate: 'Tropical com estação seca',
        suitability: 'Bom',
        suitabilityClass: 'suitability-good',
        icon: '🌴',
        description: 'Região de cerrado com crescimento do agronegócio'
    }
};

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

        // Camadas do mapa
        const mapLayers = {
            osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 19
            }),
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri',
                maxZoom: 19
            })
        };

        // Define camada padrão
        mapLayers.osm.addTo(farmMap);

        // Adiciona marcadores para todas as regiões disponíveis
        addRegionMarkersToMap();

        // Define a região inicial (Brasília)
        setActiveRegion('brasilia');

        // Configura controles do mapa
        setupMapControls(mapLayers);

        // Remove indicador de carregamento
        hideMapLoading();

        console.log('Mapa da fazenda inicializado com sucesso');

    } catch (error) {
        console.error('Erro ao inicializar mapa da fazenda:', error);
        showMapError();
    }
}

/**
 * Configura os controles personalizados do mapa
 */
function setupMapControls(osmLayer, satelliteLayer, terrainLayer) {
    const mapControls = document.querySelector('.map-controls');
    if (!mapControls) return;

    const satelliteBtn = mapControls.querySelector('[data-layer="satellite"]');
    const terrainBtn = mapControls.querySelector('[data-layer="terrain"]');
    const layersBtn = mapControls.querySelector('[data-layer="layers"]');

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

    // Controle de camadas (volta para OSM)
    if (layersBtn) {
        layersBtn.addEventListener('click', () => {
            farmMap.eachLayer(layer => {
                if (layer._url && layer._url.includes('tile')) {
                    farmMap.removeLayer(layer);
                }
            });
            osmLayer.addTo(farmMap);
            updateActiveControl(layersBtn);
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
 * Adiciona marcadores de todas as regiões disponíveis no mapa
 */
function addRegionMarkersToMap() {
    // Remove marcadores existentes
    regionMarkers.forEach(marker => farmMap.removeLayer(marker));
    regionMarkers = [];

    // Adiciona marcador para cada região
    Object.keys(regionData).forEach(regionId => {
        const region = regionData[regionId];
        const marker = L.marker(region.coords, {
            icon: L.divIcon({
                className: 'region-marker',
                html: `<div class="region-marker-icon" data-region="${regionId}">
                    <span class="region-emoji">${region.icon}</span>
                    <div class="region-marker-pulse"></div>
                </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(farmMap);

        marker.bindPopup(`
            <div style="font-family: 'Inter', sans-serif; color: #1a1a1a; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #22c55e; font-size: 14px;">${region.icon} ${region.name}</h3>
                <p style="margin: 0; font-size: 12px;"><strong>Estado:</strong> ${region.state}</p>
                <p style="margin: 4px 0; font-size: 12px;"><strong>Clima:</strong> ${region.climate}</p>
                <p style="margin: 4px 0; font-size: 12px;"><strong>Adequação:</strong> <span style="color: ${region.suitabilityClass === 'suitability-excellent' ? '#22c55e' : '#ffd700'};">${region.suitability}</span></p>
                <p style="margin: 8px 0 4px 0; font-size: 11px; color: #666;">${region.description}</p>
                <button onclick="selectRegionFromMap('${regionId}')" style="margin-top: 8px; padding: 6px 12px; background: #22c55e; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                    Selecionar Esta Região
                </button>
            </div>
        `);

        // Adiciona evento de clique no marcador
        marker.on('click', () => {
            selectRegionFromMap(regionId);
        });

        regionMarkers.push(marker);
    });
}

/**
 * Define a região ativa no mapa e na interface
 * @param {string} regionId - ID da região
 */
function setActiveRegion(regionId) {
    const region = regionData[regionId];
    if (!region) return;

    // Remove marcador e polígono da fazenda existentes
    if (farmMarker) {
        farmMap.removeLayer(farmMarker);
    }
    if (farmPolygon) {
        farmMap.removeLayer(farmPolygon);
    }

    // Adiciona marcador da fazenda na nova região
    farmMarker = L.marker(region.coords, {
        icon: L.divIcon({
            className: 'farm-marker active',
            html: '<div style="background: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(34, 197, 94, 0.7); animation: pulse 2s infinite;"></div>',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
        })
    }).addTo(farmMap);

    farmMarker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; color: #1a1a1a;">
            <h3 style="margin: 0 0 8px 0; color: #22c55e; font-size: 14px;">🌱 Fazenda Sustentável</h3>
            <p style="margin: 0; font-size: 12px;">Localização: ${region.name}, ${region.state}</p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">Área cultivável: 2.5 hectares</p>
        </div>
    `);

    // Adiciona polígono da área cultivável
    const bounds = [
        [region.coords[0] + 0.002, region.coords[1] + 0.002],
        [region.coords[0] - 0.002, region.coords[1] - 0.002]
    ];
    
    farmPolygon = L.polygon(bounds, {
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 0.2,
        weight: 2
    }).addTo(farmMap);

    // Centraliza o mapa na região
    farmMap.setView(region.coords, 12);

    // Atualiza interface visual
    updateRegionInterface(regionId);
    updateRegionInfoPanel(regionId);
}

/**
 * Atualiza a interface de seleção de regiões
 * @param {string} activeRegionId - ID da região ativa
 */
function updateRegionInterface(activeRegionId) {
    // Remove classe active de todas as opções
    document.querySelectorAll('.region-option').forEach(option => {
        option.classList.remove('active');
    });

    // Adiciona classe active à região selecionada
    const activeOption = document.querySelector(`[data-region="${activeRegionId}"]`);
    if (activeOption) {
        activeOption.classList.add('active');
    }

    // Atualiza o select oculto para compatibilidade
    const locationSelect = document.getElementById('location-select');
    if (locationSelect) {
        locationSelect.value = activeRegionId;
    }
}

/**
 * Atualiza o painel de informações da região
 * @param {string} regionId - ID da região
 */
function updateRegionInfoPanel(regionId) {
    const region = regionData[regionId];
    if (!region) return;

    // Atualiza elementos do painel
    const regionNameEl = document.getElementById('current-region-name');
    const regionClimateEl = document.getElementById('current-region-climate');
    const regionCoordsEl = document.getElementById('current-region-coords');
    const regionSuitabilityEl = document.getElementById('current-region-suitability');

    if (regionNameEl) regionNameEl.textContent = `${region.name}, ${region.state}`;
    if (regionClimateEl) regionClimateEl.textContent = region.climate;
    if (regionCoordsEl) regionCoordsEl.textContent = `${region.coords[0].toFixed(2)}°, ${region.coords[1].toFixed(2)}°`;
    if (regionSuitabilityEl) {
        regionSuitabilityEl.textContent = region.suitability;
        regionSuitabilityEl.className = region.suitabilityClass;
    }
}

/**
 * Seleciona uma região a partir do mapa
 * @param {string} regionId - ID da região
 */
function selectRegionFromMap(regionId) {
    setActiveRegion(regionId);
    
    // Dispara evento de mudança de localização para integração com NASA
    const locationSelect = document.getElementById('location-select');
    if (locationSelect) {
        locationSelect.value = regionId;
        const event = new Event('change', { bubbles: true });
        locationSelect.dispatchEvent(event);
    }
    
    showNotification(`Região alterada para ${regionData[regionId].name}`, 'info');
}

/**
 * Atualiza a localização da fazenda no mapa (função legada mantida para compatibilidade)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} locationName - Nome da localização
 */
function updateFarmLocation(lat, lng, locationName) {
    // Encontra a região correspondente às coordenadas
    const regionId = Object.keys(regionData).find(id => {
        const region = regionData[id];
        return Math.abs(region.coords[0] - lat) < 0.1 && Math.abs(region.coords[1] - lng) < 0.1;
    });

    if (regionId) {
        setActiveRegion(regionId);
    }
}

// Inicializa o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initGame);
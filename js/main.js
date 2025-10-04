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
    
    // Botão de seleção manual de localização
    const selectLocationBtn = document.getElementById('select-location-btn');
    if (selectLocationBtn) {
        selectLocationBtn.addEventListener('click', () => toggleLocationSelection());
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
let isSelectingLocation = false; // Controla se está no modo de seleção
let customLocation = null; // Armazena localização personalizada

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

        // Adiciona handler de clique para seleção manual
        farmMap.on('click', handleMapClick);

        // Configura controles do mapa
        setupMapControls(osmLayer, satelliteLayer, terrainLayer);

        // Esconde indicador de carregamento
        hideMapLoading();
        
        // Carrega localização personalizada se existir
        const savedLocation = loadCustomLocation();
        if (savedLocation) {
            updateFarmLocation(savedLocation.lat, savedLocation.lng, savedLocation.name, true);
        }
        
        console.log('Mapa da fazenda inicializado com sucesso');

    } catch (error) {
        console.error('Erro ao inicializar mapa da fazenda:', error);
        showMapError();
    }
}

/**
 * Manipula cliques no mapa para seleção manual da localização
 */
function handleMapClick(e) {
    if (!isSelectingLocation) return;
    
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Atualiza localização da fazenda
    updateFarmLocation(lat, lng, 'Localização Personalizada', true);
    
    // Salva localização personalizada
    customLocation = { lat, lng, name: 'Localização Personalizada' };
    saveCustomLocation(customLocation);
    
    // Sai do modo de seleção
    toggleLocationSelection(false);
    
    // Mostra notificação de confirmação
    showNotification('📍 Localização da fazenda atualizada com sucesso!', 'success');
    
    console.log(`Nova localização selecionada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
}

/**
 * Ativa/desativa modo de seleção de localização
 */
function toggleLocationSelection(enable = null) {
    if (enable === null) {
        isSelectingLocation = !isSelectingLocation;
    } else {
        isSelectingLocation = enable;
    }
    
    const mapContainer = document.getElementById('farm-map');
    const selectBtn = document.getElementById('select-location-btn');
    
    if (isSelectingLocation) {
        // Ativa modo de seleção
        mapContainer.classList.add('selecting');
        if (selectBtn) {
            selectBtn.classList.add('active');
            selectBtn.title = 'Cancelar seleção';
        }
        showNotification('🎯 Clique no mapa para selecionar a nova localização da fazenda', 'info');
    } else {
        // Desativa modo de seleção
        mapContainer.classList.remove('selecting');
        if (selectBtn) {
            selectBtn.classList.remove('active');
            selectBtn.title = 'Selecionar localização manualmente';
        }
    }
}

/**
 * Salva localização personalizada no localStorage
 */
function saveCustomLocation(location) {
    try {
        localStorage.setItem('farmCustomLocation', JSON.stringify(location));
        console.log('Localização personalizada salva:', location);
    } catch (error) {
        console.error('Erro ao salvar localização personalizada:', error);
    }
}

/**
 * Carrega localização personalizada do localStorage
 */
function loadCustomLocation() {
    try {
        const saved = localStorage.getItem('farmCustomLocation');
        if (saved) {
            customLocation = JSON.parse(saved);
            console.log('Localização personalizada carregada:', customLocation);
            return customLocation;
        }
    } catch (error) {
        console.error('Erro ao carregar localização personalizada:', error);
    }
    return null;
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
 * Atualiza a localização da fazenda no mapa
 */
function updateFarmLocation(lat, lng, locationName, isCustom = false) {
    if (!farmMap || !farmMarker) return;

    const newCoordinates = [lat, lng];
    
    // Atualiza posição do marcador
    farmMarker.setLatLng(newCoordinates);
    
    // Atualiza popup do marcador com informações diferentes para localização personalizada
    const popupContent = isCustom ? `
        <div style="text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: var(--azul-orbital);">🌾 Fazenda NASA Farm Navigators</h4>
            <p style="margin: 0; font-size: 12px;">📍 ${locationName}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Área: ~2.5 hectares</p>
        </div>
    ` : `
        <div style="text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: var(--azul-orbital);">🌾 Fazenda NASA Farm Navigators</h4>
            <p style="margin: 0; font-size: 12px;">Localização: ${locationName}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Área: ~2.5 hectares</p>
        </div>
    `;
    
    farmMarker.bindPopup(popupContent);
    
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
    
    // Atualiza dados da NASA se for uma localização personalizada
    if (isCustom && typeof updateNasaData === 'function') {
        // Para localização personalizada, usa coordenadas como ID
        const customLocationId = `custom_${lat.toFixed(4)}_${lng.toFixed(4)}`;
        updateNasaData(customLocationId, { lat, lng });
    }
    
    console.log(`Localização da fazenda atualizada para: ${locationName} (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
}

// Inicializa o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initGame);
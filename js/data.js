/**
 * Módulo de dados da NASA (Refatorado para Simplicidade)
 * Gerencia um único mapa com camadas de dados da NASA.
 */

// --- Configurações ---
const config = {
    locations: {
        brasilia: { name: 'Brasília', lat: -15.7801, lng: -47.9292 },
        goiania: { name: 'Goiânia', lat: -16.6799, lng: -49.2550 },
        cuiaba: { name: 'Cuiabá', lat: -15.6014, lng: -56.0979 },
        palmas: { name: 'Palmas', lat: -10.2491, lng: -48.3243 }
    },
    map: {
        defaultLocation: 'brasilia',
        defaultZoom: 8,
        containerId: 'farm-map'
    },
    nasaGibs: {
        baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/{layer}/default/{date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png',
        layers: {
            soilMoisture: 'SMAP_L3_Passive_Enhanced_Day_Soil_Moisture',
            vegetation: 'MODIS_Terra_NDVI_8Day',
            precipitation: 'GPM_3IMERGHH_Precipitation_Rate'
        }
    }
};

// --- Estado do Módulo ---
const state = {
    map: null,
    activeLocationId: config.map.defaultLocation,
    nasaLayers: {
        soilMoisture: null,
        vegetation: null,
        precipitation: null,
    }
};

/**
 * Inicializa o mapa principal e os controles.
 */
function initMapAndData() {
    console.log('Inicializando o mapa e os dados...');
    try {
        const initialLocation = config.locations[state.activeLocationId];
        state.map = L.map(config.map.containerId).setView([initialLocation.lat, initialLocation.lng], config.map.defaultZoom);

        // Adiciona o mapa base (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(state.map);

        // Esconde o loader quando o mapa estiver pronto
        const mapLoader = document.getElementById('map-loading');
        if (mapLoader) {
            mapLoader.style.display = 'none';
        }
        
        // Inicializa os eventos dos controles
        setupMapControls();

    } catch (error) {
        console.error('Erro ao inicializar o mapa Leaflet:', error);
        const mapLoader = document.getElementById('map-loading');
        if (mapLoader) {
            mapLoader.innerHTML = '<p class="text-alert-orange">Erro ao carregar o mapa.</p>';
        }
    }
}

/**
 * Configura todos os eventos de interação do mapa e da UI.
 */
function setupMapControls() {
    // Seletor de Localização
    const locationSelect = document.getElementById('location-select');
    if (locationSelect) {
        locationSelect.addEventListener('change', (e) => {
            state.activeLocationId = e.target.value;
            const newLocation = config.locations[state.activeLocationId];
            state.map.setView([newLocation.lat, newLocation.lng], config.map.defaultZoom);
            updateAllNasaLayers(); // Atualiza as camadas para a nova localização
        });
    }

    // Botão de Camadas
    const layersBtn = document.getElementById('map-layers');
    const layersPanel = document.getElementById('map-layers-panel');
    if (layersBtn && layersPanel) {
        layersBtn.addEventListener('click', () => {
            layersPanel.classList.toggle('hidden');
        });
    }

    // Controles (checkbox) das camadas
    const soilCheckbox = document.getElementById('toggle-soil-moisture');
    const vegCheckbox = document.getElementById('toggle-vegetation');
    const precipCheckbox = document.getElementById('toggle-precipitation');

    if (soilCheckbox) {
        soilCheckbox.addEventListener('change', (e) => toggleNasaLayer('soilMoisture', e.target.checked));
    }
    if (vegCheckbox) {
        vegCheckbox.addEventListener('change', (e) => toggleNasaLayer('vegetation', e.target.checked));
    }
    if (precipCheckbox) {
        precipCheckbox.addEventListener('change', (e) => toggleNasaLayer('precipitation', e.target.checked));
    }
}

/**
 * Adiciona ou remove uma camada de dados da NASA no mapa.
 * @param {string} layerName - O nome da camada (ex: 'soilMoisture').
 * @param {boolean} isVisible - Se a camada deve ser exibida.
 */
function toggleNasaLayer(layerName, isVisible) {
    if (!state.map) return;

    // Remove a camada antiga, se existir
    if (state.nasaLayers[layerName]) {
        state.map.removeLayer(state.nasaLayers[layerName]);
        state.nasaLayers[layerName] = null;
    }

    // Se for para exibir, cria e adiciona a nova camada
    if (isVisible) {
        const layerId = config.nasaGibs.layers[layerName];
        if (!layerId) {
            console.error(`ID da camada NASA para '${layerName}' não encontrado.`);
            return;
        }

        const date = getFormattedDateForNasa();
        const tileUrl = config.nasaGibs.baseUrl
            .replace('{layer}', layerId)
            .replace('{date}', date);

        state.nasaLayers[layerName] = L.tileLayer(tileUrl, {
            attribution: '© NASA GIBS',
            opacity: 0.7,
            maxZoom: 9
        });
        state.nasaLayers[layerName].addTo(state.map);
        console.log(`Camada '${layerName}' adicionada para a data ${date}.`);
    } else {
        console.log(`Camada '${layerName}' removida.`);
    }
}

/**
 * Atualiza todas as camadas ativas. Útil ao mudar de localização.
 */
function updateAllNasaLayers() {
    const soilCheckbox = document.getElementById('toggle-soil-moisture');
    const vegCheckbox = document.getElementById('toggle-vegetation');
    const precipCheckbox = document.getElementById('toggle-precipitation');

    if (soilCheckbox && soilCheckbox.checked) toggleNasaLayer('soilMoisture', true);
    if (vegCheckbox && vegCheckbox.checked) toggleNasaLayer('vegetation', true);
    if (precipCheckbox && precipCheckbox.checked) toggleNasaLayer('precipitation', true);
}

/**
 * Retorna a data formatada para a API da NASA (YYYY-MM-DD).
 * Pega uma data de alguns dias atrás para garantir que os dados estejam disponíveis.
 */
function getFormattedDateForNasa() {
    const date = new Date();
    date.setDate(date.getDate() - 3); // Usar dados de 3 dias atrás
    return date.toISOString().split('T')[0];
}

/**
 * Função de compatibilidade para integração com main.js
 * Mantém a interface esperada pelo sistema existente
 */
function initData() {
    console.log('Inicializando dados da NASA via função de compatibilidade...');
    // A inicialização real acontece via DOMContentLoaded
    // Esta função existe para manter compatibilidade com main.js
}

// --- Inicialização ---
// Chama a função principal quando o DOM estiver pronto.
document.addEventListener('DOMContentLoaded', initMapAndData);
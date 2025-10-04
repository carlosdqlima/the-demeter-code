/**
 * Módulo de dados da NASA
 * Responsável pela visualização e integração de dados da NASA
 */

// Configuração do sistema de dados
const dataConfig = {
    // Localização padrão do mapa
    defaultLocation: 'brasilia',
    
    // Localizações disponíveis
    locations: [
        { id: 'brasilia', name: 'Brasília', lat: -15.7801, lng: -47.9292 },
        { id: 'goiania', name: 'Goiânia', lat: -16.6799, lng: -49.2550 },
        { id: 'cuiaba', name: 'Cuiabá', lat: -15.6014, lng: -56.0979 },
        { id: 'palmas', name: 'Palmas', lat: -10.2491, lng: -48.3243 }
    ],
    
    // Configuração da NASA GIBS API
    nasaGibs: {
        baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best',
        layers: {
            soilMoisture: 'SMAP_L3_Soil_Moisture_Active_Passive_Daily_Global_10km_EASE_Grid',
            vegetation: 'MODIS_Terra_NDVI_8Day',
            temperature: 'MODIS_Terra_Land_Surface_Temp_Day',
            precipitation: 'GPM_3IMERGHH_06_precipitation'
        },
        format: 'image/png',
        tileMatrixSet: 'GoogleMapsCompatible_Level9',
        style: 'default',
        time: null // Será definido dinamicamente
    },
    
    // Camadas ativas no mapa
    activeLayers: {
        soilMoisture: true,
        vegetation: false,
        weather: false
    },
    
    // Objetos dos mapas
    maps: {
        soilMoisture: null,
        vegetation: null
    },
    
    // Objetos dos gráficos
    charts: {
        weather: null
    },
    
    // Dados simulados
    simulatedData: {
        soilMoisture: {
            brasilia: { value: 60, trend: 'stable' },
            goiania: { value: 65, trend: 'rising' },
            cuiaba: { value: 35, trend: 'falling' },
            palmas: { value: 55, trend: 'stable' }
        },
        vegetation: {
            brasilia: { value: 0.72, trend: 'stable' },
            goiania: { value: 0.78, trend: 'rising' },
            cuiaba: { value: 0.45, trend: 'falling' },
            palmas: { value: 0.68, trend: 'rising' }
        },
        weatherForecast: {
            brasilia: [
                { date: 'Hoje', temperature: 25, precipitation: 10 },
                { date: 'Amanhã', temperature: 27, precipitation: 5 },
                { date: 'Dia 3', temperature: 26, precipitation: 15 },
                { date: 'Dia 4', temperature: 24, precipitation: 30 },
                { date: 'Dia 5', temperature: 23, precipitation: 25 }
            ],
            goiania: [
                { date: 'Hoje', temperature: 28, precipitation: 5 },
                { date: 'Amanhã', temperature: 30, precipitation: 0 },
                { date: 'Dia 3', temperature: 29, precipitation: 10 },
                { date: 'Dia 4', temperature: 27, precipitation: 20 },
                { date: 'Dia 5', temperature: 26, precipitation: 15 }
            ],
            cuiaba: [
                { date: 'Hoje', temperature: 32, precipitation: 0 },
                { date: 'Amanhã', temperature: 34, precipitation: 0 },
                { date: 'Dia 3', temperature: 33, precipitation: 5 },
                { date: 'Dia 4', temperature: 31, precipitation: 10 },
                { date: 'Dia 5', temperature: 30, precipitation: 8 }
            ],
            palmas: [
                { date: 'Hoje', temperature: 30, precipitation: 40 },
                { date: 'Amanhã', temperature: 28, precipitation: 35 },
                { date: 'Dia 3', temperature: 29, precipitation: 20 },
                { date: 'Dia 4', temperature: 31, precipitation: 15 },
                { date: 'Dia 5', temperature: 32, precipitation: 10 }
            ]
        }
    },
    
    // Dados simulados de umidade do solo
    soilMoistureData: {
        min: 0,
        max: 100,
        current: 50,
        history: [45, 48, 52, 55, 50, 47, 43],
        locations: {
            brasilia: { value: 50, trend: 'stable' },
            goiania: { value: 65, trend: 'rising' },
            cuiaba: { value: 35, trend: 'falling' },
            palmas: { value: 55, trend: 'stable' }
        }
    },
    
    // Dados simulados de vegetação (NDVI)
    vegetationData: {
        min: 0,
        max: 1,
        current: 0.6,
        history: [0.55, 0.57, 0.62, 0.65, 0.6, 0.58, 0.56],
        locations: {
            brasilia: { value: 0.6, trend: 'stable' },
            goiania: { value: 0.7, trend: 'rising' },
            cuiaba: { value: 0.4, trend: 'falling' },
            palmas: { value: 0.65, trend: 'rising' }
        }
    },
    
    // Dados simulados de previsão do tempo
    weatherForecast: {
        temperature: {
            current: 25,
            min: 18,
            max: 30,
            forecast: [26, 28, 27, 25, 24, 23, 25]
        },
        precipitation: {
            current: 0,
            forecast: [0, 0, 30, 60, 20, 10, 0]
        },
        locations: {
            brasilia: { temp: 25, precip: 10, condition: 'clear' },
            goiania: { temp: 28, precip: 5, condition: 'clear' },
            cuiaba: { temp: 32, precip: 0, condition: 'hot' },
            palmas: { temp: 30, precip: 40, condition: 'rain' }
        }
    }
}

/**
 * Inicializa os botões de filtro
 */
function initFilterButtons() {
    // Filtros de camada
    const layerButtons = document.querySelectorAll('.nasa-layer-filter');
    layerButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active de todos os botões
            layerButtons.forEach(btn => btn.classList.remove('bg-primary/20', 'border-primary'));
            layerButtons.forEach(btn => btn.classList.add('bg-panel-dark/50', 'border-primary/30'));
            
            // Adiciona active ao botão clicado
            button.classList.remove('bg-panel-dark/50', 'border-primary/30');
            button.classList.add('bg-primary/20', 'border-primary');
            
            const layer = button.dataset.layer;
            if (dataConfig.activeLayers) {
                dataConfig.activeLayers[layer] = !dataConfig.activeLayers[layer];
                updateMapLayers();
            }
        });
    });
    
    // Seletor de localização
    const locationSelect = document.getElementById('nasa-location-select');
    if (locationSelect) {
        locationSelect.addEventListener('change', (e) => {
            updateNasaData(e.target.value);
        });
    }
}

/**
 * Atualiza as camadas dos mapas
 */
function updateMapLayers() {
    console.log('Atualizando camadas dos mapas...');
    
    // Verifica se deve usar dados reais da NASA ou simulados
    const useNASAData = typeof L !== 'undefined';
    
    if (useNASAData) {
        // Usa dados reais da NASA GIBS
        if (dataConfig.activeLayers.soilMoisture && dataConfig.maps.soilMoisture) {
            addNASAGibsLayer(dataConfig.maps.soilMoisture, 'soilMoisture');
        }
        
        if (dataConfig.activeLayers.vegetation && dataConfig.maps.vegetation) {
            addNASAGibsLayer(dataConfig.maps.vegetation, 'vegetation');
        }
    } else {
        // Usa dados simulados como fallback
        if (dataConfig.activeLayers.soilMoisture && dataConfig.maps.soilMoisture) {
            updateSimulatedMap(dataConfig.maps.soilMoisture, 'soilMoisture', dataConfig.defaultLocation);
        }
        
        if (dataConfig.activeLayers.vegetation && dataConfig.maps.vegetation) {
            updateSimulatedMap(dataConfig.maps.vegetation, 'vegetation', dataConfig.defaultLocation);
        }
    }
}

/**
 * Atualiza mapa simulado (fallback quando Leaflet não está disponível)
 * @param {HTMLElement|Object} mapElement - Elemento do mapa ou objeto do mapa Leaflet
 * @param {string} dataType - Tipo de dados ('soilMoisture' ou 'vegetation')
 * @param {string} locationId - ID da localização
 */
function updateSimulatedMap(mapElement, dataType, locationId) {
    if (!mapElement || !dataConfig.simulatedData) return;
    
    const data = dataConfig.simulatedData[dataType][locationId];
    if (!data) return;
    
    // Se for um objeto Leaflet, apenas atualiza os dados
    if (mapElement.setView) {
        // É um mapa Leaflet, recriar as camadas
        mapElement.eachLayer(layer => {
            if (layer instanceof L.Circle) {
                mapElement.removeLayer(layer);
            }
        });
        
        // Adicionar novos dados
        if (dataType === 'soilMoisture') {
            addSoilMoistureData(mapElement);
        } else if (dataType === 'vegetation') {
            addVegetationData(mapElement);
        }
        return;
    }
    
    // Se for um elemento HTML, criar visualização simulada
    let color, label;
    
    if (dataType === 'soilMoisture') {
        color = getSoilMoistureColor(data.value);
        label = `Umidade: ${data.value}%`;
    } else if (dataType === 'vegetation') {
        color = getVegetationColor(data.value);
        label = `NDVI: ${data.value.toFixed(2)}`;
    }
    
    mapElement.innerHTML = `
        <div class="flex items-center justify-center h-full">
            <div class="text-center">
                <div class="w-16 h-16 rounded-full mx-auto mb-2" style="background-color: ${color}"></div>
                <div class="text-sm font-medium text-text-dark">${label}</div>
                <div class="text-xs text-text-dark/70">${getTrendText(data.trend)}</div>
            </div>
        </div>
    `;
}

/**
 * Atualiza gráfico simulado quando Chart.js não está disponível
 * @param {HTMLElement|Object} chartElement - Elemento do gráfico ou objeto Chart.js
 * @param {Array} weatherData - Dados de previsão do tempo
 */
function updateSimulatedChart(chartElement, weatherData) {
    if (!chartElement || !weatherData) return;
    
    // Se for um objeto Chart.js, atualizar os dados
    if (chartElement.data) {
        chartElement.data.labels = weatherData.map(day => day.date);
        chartElement.data.datasets[0].data = weatherData.map(day => day.temperature);
        chartElement.data.datasets[1].data = weatherData.map(day => day.precipitation);
        chartElement.update();
        return;
    }
    
    // Se for um elemento HTML, criar visualização simulada
    const maxTemp = Math.max(...weatherData.map(day => day.temperature));
    const maxPrecip = Math.max(...weatherData.map(day => day.precipitation));
    
    chartElement.innerHTML = `
        <div class="p-4">
            <h4 class="text-primary text-sm font-medium mb-3">Previsão do Tempo</h4>
            <div class="space-y-2">
                ${weatherData.map(day => `
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-text-dark/70 w-16">${day.date}</span>
                        <div class="flex items-center gap-2 flex-1">
                            <div class="w-8 text-primary">${day.temperature}°C</div>
                            <div class="flex-1 bg-panel-dark/50 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: ${(day.temperature / maxTemp) * 100}%"></div>
                            </div>
                            <div class="w-8 text-water-blue">${day.precipitation}%</div>
                            <div class="flex-1 bg-panel-dark/50 rounded-full h-2">
                                <div class="bg-water-blue h-2 rounded-full" style="width: ${(day.precipitation / maxPrecip) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Atualiza dados da NASA para uma localização específica
 */
function updateNasaData(locationId) {
    console.log(`Atualizando dados da NASA para: ${locationId}`);
    
    // Verifica se os dados simulados existem
    if (!dataConfig.simulatedData) {
        console.warn('Dados simulados não encontrados');
        return;
    }
    
    // Atualiza a localização padrão
    dataConfig.defaultLocation = locationId;
    
    // Simula dados específicos da localização
    const soilData = dataConfig.simulatedData.soilMoisture[locationId];
    const vegData = dataConfig.simulatedData.vegetation[locationId];
    const weatherData = dataConfig.simulatedData.weatherForecast[locationId];
    
    // Atualiza elementos da interface
    const soilMoistureElement = document.getElementById('soil-moisture-value');
    const vegetationElement = document.getElementById('vegetation-value');
    const weatherElement = document.getElementById('weather-summary');
    
    if (soilMoistureElement && soilData) {
        soilMoistureElement.textContent = `${soilData.value}%`;
        soilMoistureElement.className = `text-lg font-bold ${getSoilMoistureClass(soilData.value)}`;
    }
    
    if (vegetationElement && vegData) {
        vegetationElement.textContent = vegData.value.toFixed(2);
        vegetationElement.className = `text-lg font-bold ${getVegetationClass(vegData.value)}`;
    }
    
    if (weatherElement && weatherData && weatherData.length > 0) {
        const today = weatherData[0];
        weatherElement.innerHTML = `
            <div class="text-lg font-bold text-primary">${today.temperature}°C</div>
            <div class="text-sm text-text-dark/70">${today.precipitation}% chuva</div>
        `;
    }
    
    // Atualiza os mapas com dados da NASA GIBS para a nova localização
    if (typeof L !== 'undefined') {
        updateNASAMaps(locationId);
    } else {
        // Fallback para dados simulados
        if (dataConfig.maps.soilMoisture) {
            updateSimulatedMap(dataConfig.maps.soilMoisture, 'soilMoisture', locationId);
        }
        if (dataConfig.maps.vegetation) {
            updateSimulatedMap(dataConfig.maps.vegetation, 'vegetation', locationId);
        }
    }
    
    // Atualizar dados simulados baseados na localização
    const locationData = dataConfig.simulatedData.soilMoisture[locationId];
    if (locationData && gameState.nasaData) {
        gameState.nasaData.soilMoisture = locationData.value;
        
        // Atualizar interface principal se disponível
        if (typeof updatePlantationStatus === 'function') {
            updatePlantationStatus();
        }
    }
    
    // Atualizar gráficos se disponíveis
    if (dataConfig.charts.weather) {
        const weatherChartData = dataConfig.simulatedData.weatherForecast[locationId];
        if (weatherChartData) {
            dataConfig.charts.weather.data.labels = weatherChartData.map(day => day.date);
            dataConfig.charts.weather.data.datasets[0].data = weatherChartData.map(day => day.temperature);
            dataConfig.charts.weather.data.datasets[1].data = weatherChartData.map(day => day.precipitation);
            dataConfig.charts.weather.update();
        }
    }
}

/**
 * Obtém texto de tendência baseado no valor
 */
function getTrendText(trend) {
    switch (trend) {
        case 'rising': return 'Subindo';
        case 'falling': return 'Descendo';
        case 'stable': return 'Estável';
        default: return 'Desconhecido';
    }
}

/**
 * Obtém texto de condição climática
 */
function getWeatherConditionText(condition) {
    switch (condition) {
        case 'clear': return 'Limpo';
        case 'rain': return 'Chuva';
        case 'hot': return 'Quente';
        case 'cloudy': return 'Nublado';
        default: return 'Desconhecido';
    }
}

/**
 * Obtém classe CSS para condição climática
 */
function getWeatherConditionClass(condition) {
    switch (condition) {
        case 'clear': return 'text-vibrant-green';
        case 'rain': return 'text-water-blue';
        case 'hot': return 'text-alert-orange';
        case 'cloudy': return 'text-text-dark';
        default: return 'text-text-dark';
    }
}

/**
 * Atualiza recomendação da fazenda
 */
function updateFarmRecommendation(soilMoisture, temperature, precipitation) {
    let recommendation = '';
    
    if (soilMoisture < 30) {
        recommendation = 'Irrigação necessária urgentemente';
    } else if (soilMoisture < 60) {
        recommendation = 'Considere irrigação preventiva';
    } else if (temperature > 30) {
        recommendation = 'Monitore estresse térmico das plantas';
    } else if (precipitation > 50) {
        recommendation = 'Atenção para drenagem do solo';
    } else {
        recommendation = 'Condições favoráveis para cultivo';
    }
    
    const element = document.getElementById('farm-recommendation');
    if (element) {
        element.textContent = recommendation;
    }
    
    return recommendation;
};

// Variáveis para armazenar os objetos de mapa e gráfico
let soilMoistureMap;
let vegetationMap;
let weatherChart;

/**
 * Inicializa o sistema de dados da NASA
 */
function initData() {
    console.log('Inicializando dados da NASA...');
    
    // Inicializar mapas
    initMaps();
    
    // Inicializar gráficos
    initCharts();
    
    // Inicializar botões de filtro
    initFilterButtons();
    
    // Inicializar integração NASA GIBS
    if (typeof initNASAIntegration === 'function') {
        initNASAIntegration();
    }
    
    // Carregar dados para localização padrão
    updateNasaData(dataConfig.defaultLocation);
    
    // Configurar botão de atualização
    const updateButton = document.getElementById('update-nasa-data');
    if (updateButton) {
        updateButton.addEventListener('click', () => {
            const selectedLocation = document.getElementById('nasa-location-select')?.value || dataConfig.defaultLocation;
            updateNasaData(selectedLocation);
        });
    }
    
    console.log('Dados da NASA inicializados com sucesso!');
}

/**
 * Inicializa os mapas de umidade do solo e vegetação
 */
function initMaps() {
    try {
        // Verificar se o Leaflet está disponível
        if (typeof L === 'undefined') {
            console.warn('Leaflet não encontrado, usando mapas simulados');
            updateSimulatedMap('nasa-soil-map', 'Umidade do Solo');
            updateSimulatedMap('nasa-vegetation-map', 'Vegetação');
            return;
        }

        // Inicializar mapa de umidade do solo
        if (!dataConfig.maps.soilMoisture) {
            const soilMapElement = document.getElementById('nasa-soil-map');
            if (soilMapElement) {
                dataConfig.maps.soilMoisture = L.map('nasa-soil-map').setView([-15.7801, -47.9292], 6);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(dataConfig.maps.soilMoisture);
                addSoilMoistureData(dataConfig.maps.soilMoisture);
            }
        }

        // Inicializar mapa de vegetação
        if (!dataConfig.maps.vegetation) {
            const vegMapElement = document.getElementById('nasa-vegetation-map');
            if (vegMapElement) {
                dataConfig.maps.vegetation = L.map('nasa-vegetation-map').setView([-15.7801, -47.9292], 6);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(dataConfig.maps.vegetation);
                addVegetationData(dataConfig.maps.vegetation);
            }
        }
    } catch (error) {
        console.error('Erro ao inicializar mapas:', error);
        updateSimulatedMap('nasa-soil-map', 'Umidade do Solo');
        updateSimulatedMap('nasa-vegetation-map', 'Vegetação');
    }
}

/**
 * Adiciona os dados de umidade do solo ao mapa
 * @param {L.Map} map - Objeto do mapa Leaflet
 */
function addSoilMoistureData(map) {
    dataConfig.locations.forEach(location => {
        const soilData = dataConfig.simulatedData.soilMoisture[location.id];
        if (soilData) {
            // Determina a cor com base no valor de umidade
            const color = getSoilMoistureColor(soilData.value);
            
            // Cria um círculo no mapa
            L.circle([location.lat, location.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                radius: 50000 // 50km de raio
            }).addTo(map).bindPopup(`${location.name}<br>Umidade do Solo: ${soilData.value}%<br>Tendência: ${getTrendText(soilData.trend)}`);
        }
    });
}

/**
 * Retorna uma cor baseada no valor de umidade do solo
 * @param {number} value - Valor de umidade (0-100)
 * @returns {string} - Código de cor hexadecimal
 */
function getSoilMoistureColor(value) {
    if (value >= 70) return '#56A0D3'; // Azul Água (muito úmido)
    if (value >= 50) return '#7FB3D5'; // Azul mais claro (úmido)
    if (value >= 30) return '#F5CBA7'; // Marrom claro (seco)
    return '#E59866';                  // Marrom mais escuro (muito seco)
}

/**
 * Adiciona os dados de vegetação ao mapa
 * @param {L.Map} map - Objeto do mapa Leaflet
 */
function addVegetationData(map) {
    dataConfig.locations.forEach(location => {
        const vegData = dataConfig.simulatedData.vegetation[location.id];
        if (vegData) {
            // Determina a cor com base no valor de NDVI
            const color = getVegetationColor(vegData.value);
            
            // Cria um círculo no mapa
            L.circle([location.lat, location.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                radius: 50000 // 50km de raio
            }).addTo(map).bindPopup(`${location.name}<br>Índice de Vegetação (NDVI): ${vegData.value.toFixed(2)}<br>Tendência: ${getTrendText(vegData.trend)}`);
        }
    });
}

/**
 * Retorna uma cor baseada no valor de NDVI
 * @param {number} value - Valor de NDVI (0-1)
 * @returns {string} - Código de cor hexadecimal
 */
function getVegetationColor(value) {
    if (value >= 0.7) return '#2E8540'; // Verde Safra (vegetação muito saudável)
    if (value >= 0.5) return '#58D68D'; // Verde mais claro (vegetação saudável)
    if (value >= 0.3) return '#F9E79F'; // Amarelo (vegetação moderada)
    return '#F5B041';                   // Laranja (vegetação estressada)
}

/**
 * Inicializa os gráficos
 */
function initCharts() {
    initWeatherForecastChart();
}

/**
 * Inicializa o gráfico de previsão do tempo
 */
function initWeatherForecastChart() {
    try {
        // Verificar se Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js não encontrado, usando gráfico simulado');
            updateSimulatedChart('nasa-weather-chart', 'Previsão do Tempo');
            return;
        }

        const ctx = document.getElementById('nasa-weather-chart');
        if (!ctx) {
            console.warn('Elemento do gráfico não encontrado');
            return;
        }

        // Destruir gráfico existente se houver
        if (dataConfig.charts.weather) {
            dataConfig.charts.weather.destroy();
        }

        // Dados simulados de previsão do tempo
        const weatherData = dataConfig.simulatedData.weatherForecast[dataConfig.defaultLocation];
        
        dataConfig.charts.weather = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weatherData.map(day => day.date),
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: weatherData.map(day => day.temperature),
                    backgroundColor: 'rgba(255, 140, 0, 0.6)',
                    borderColor: 'rgba(255, 140, 0, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                }, {
                    label: 'Precipitação (mm)',
                    data: weatherData.map(day => day.precipitation),
                    backgroundColor: 'rgba(0, 191, 255, 0.6)',
                    borderColor: 'rgba(0, 191, 255, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#E0E0FF'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#E0E0FF'
                        },
                        grid: {
                            color: 'rgba(224, 224, 255, 0.1)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            color: '#E0E0FF'
                        },
                        grid: {
                            color: 'rgba(224, 224, 255, 0.1)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                            color: '#E0E0FF'
                        },
                        grid: {
                            drawOnChartArea: false,
                            color: 'rgba(224, 224, 255, 0.1)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao inicializar gráfico de previsão do tempo:', error);
        updateSimulatedChart('nasa-weather-chart', 'Previsão do Tempo');
    }
}



/**
 * Atualiza os dados com base no ciclo atual do jogo
 */
function updateDataForCycle() {
    // Simula mudanças nos dados com base no ciclo atual
    const cycleFactor = gameState.currentCycle / gameState.maxCycles;
    
    // Atualiza os dados de umidade do solo
    dataConfig.soilMoistureData.forEach(point => {
        // Simula variação aleatória com tendência de queda ao longo dos ciclos
        point.value = Math.max(0, Math.min(100, 
            point.value - (10 * cycleFactor) + (Math.random() * 20 - 10)
        ));
    });
    
    // Atualiza os dados de vegetação
    dataConfig.vegetationData.forEach(point => {
        // Simula variação aleatória com tendência de queda ao longo dos ciclos
        point.value = Math.max(0, Math.min(1, 
            point.value - (0.1 * cycleFactor) + (Math.random() * 0.2 - 0.1)
        ));
    });
    
    // Atualiza a previsão climática
    Object.keys(dataConfig.simulatedData.weatherForecast).forEach(locationId => {
        const forecast = dataConfig.simulatedData.weatherForecast[locationId];
        for (let i = 0; i < forecast.length; i++) {
            // Simula aumento de temperatura ao longo dos ciclos
            forecast[i].temperature = 
                Math.round(25 + (5 * cycleFactor) + (Math.random() * 4 - 2));
            
            // Simula variação na precipitação
            forecast[i].precipitation = 
                Math.round(Math.max(0, Math.min(100, 
                    30 - (15 * cycleFactor) + (Math.random() * 40 - 20)
                )));
        }
    });
    
    // Atualiza os mapas e gráficos se estiverem visíveis
    if (document.getElementById('data-section').classList.contains('active')) {
        // Atualiza os mapas
        if (soilMoistureMap) {
            soilMoistureMap.eachLayer(layer => {
                if (layer instanceof L.Circle) {
                    soilMoistureMap.removeLayer(layer);
                }
            });
            addSoilMoistureData(soilMoistureMap);
        }
        
        if (vegetationMap) {
            vegetationMap.eachLayer(layer => {
                if (layer instanceof L.Circle) {
                    vegetationMap.removeLayer(layer);
                }
            });
            addVegetationData(vegetationMap);
        }
        
        // Atualiza o gráfico
        if (weatherChart) {
            const currentLocationForecast = dataConfig.simulatedData.weatherForecast[dataConfig.defaultLocation];
            weatherChart.data.datasets[0].data = currentLocationForecast.map(day => day.temperature);
            weatherChart.data.datasets[1].data = currentLocationForecast.map(day => day.precipitation);
            weatherChart.update();
        }
    }
}

// ===== INTEGRAÇÃO NASA GIBS API =====

/**
 * Obtém a data atual no formato necessário para a NASA GIBS API
 * @returns {string} Data no formato YYYY-MM-DD
 */
function getCurrentDateForNASA() {
    const today = new Date();
    // Subtrai alguns dias para garantir que os dados estejam disponíveis
    today.setDate(today.getDate() - 3);
    return today.toISOString().split('T')[0];
}

/**
 * Constrói a URL para acessar dados da NASA GIBS
 * @param {string} layer - Nome da camada (ex: 'soilMoisture', 'vegetation')
 * @param {number} z - Nível de zoom
 * @param {number} x - Coordenada X do tile
 * @param {number} y - Coordenada Y do tile
 * @param {string} date - Data no formato YYYY-MM-DD
 * @returns {string} URL completa para o tile da NASA GIBS
 */
function buildNASAGibsUrl(layer, z, x, y, date) {
    const config = dataConfig.nasaGibs;
    const layerName = config.layers[layer];
    
    if (!layerName) {
        console.warn(`Camada ${layer} não encontrada na configuração NASA GIBS`);
        return null;
    }
    
    return `${config.baseUrl}/${layerName}/default/${date}/${config.tileMatrixSet}/${z}/${y}/${x}.${config.format.split('/')[1]}`;
}

/**
 * Adiciona camada da NASA GIBS ao mapa Leaflet
 * @param {Object} map - Objeto do mapa Leaflet
 * @param {string} layerType - Tipo da camada ('soilMoisture', 'vegetation', etc.)
 * @param {string} date - Data no formato YYYY-MM-DD
 * @returns {Object} Camada adicionada ao mapa
 */
function addNASAGibsLayer(map, layerType, date = null) {
    if (!map || !layerType) {
        console.warn('Mapa ou tipo de camada não especificado para NASA GIBS');
        return null;
    }
    
    const currentDate = date || getCurrentDateForNASA();
    
    // Remove camadas NASA existentes
    map.eachLayer(layer => {
        if (layer.options && layer.options.isNASALayer) {
            map.removeLayer(layer);
        }
    });
    
    // Cria nova camada NASA GIBS
    const nasaLayer = L.tileLayer(
        buildNASAGibsUrl(layerType, '{z}', '{x}', '{y}', currentDate),
        {
            attribution: '© NASA GIBS',
            opacity: 0.7,
            isNASALayer: true,
            maxZoom: 9,
            tms: false
        }
    );
    
    // Adiciona ao mapa
    nasaLayer.addTo(map);
    
    console.log(`Camada NASA GIBS ${layerType} adicionada para ${currentDate}`);
    return nasaLayer;
}

/**
 * Atualiza todos os mapas com dados reais da NASA
 * @param {string} locationId - ID da localização selecionada
 */
function updateNASAMaps(locationId = null) {
    const location = locationId || dataConfig.defaultLocation;
    const locationData = dataConfig.locations.find(loc => loc.id === location);
    
    if (!locationData) {
        console.warn(`Localização ${location} não encontrada`);
        return;
    }
    
    // Atualiza mapa de umidade do solo
    if (dataConfig.maps.soilMoisture) {
        // Centraliza o mapa na localização
        dataConfig.maps.soilMoisture.setView([locationData.lat, locationData.lng], 8);
        
        // Adiciona camada NASA GIBS
        addNASAGibsLayer(dataConfig.maps.soilMoisture, 'soilMoisture');
    }
    
    // Atualiza mapa de vegetação
    if (dataConfig.maps.vegetation) {
        // Centraliza o mapa na localização
        dataConfig.maps.vegetation.setView([locationData.lat, locationData.lng], 8);
        
        // Adiciona camada NASA GIBS
        addNASAGibsLayer(dataConfig.maps.vegetation, 'vegetation');
    }
}

/**
 * Busca dados meteorológicos da NASA para uma localização
 * @param {string} locationId - ID da localização
 * @returns {Promise<Object>} Dados meteorológicos ou dados simulados como fallback
 */
async function fetchNASAWeatherData(locationId) {
    try {
        const locationData = dataConfig.locations.find(loc => loc.id === locationId);
        if (!locationData) {
            throw new Error(`Localização ${locationId} não encontrada`);
        }
        
        // Por enquanto, retorna dados simulados
        // Em uma implementação real, aqui faria uma requisição para a API da NASA
        console.log(`Buscando dados NASA para ${locationData.name} (${locationData.lat}, ${locationData.lng})`);
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Retorna dados simulados como fallback
        return dataConfig.simulatedData.weatherForecast[locationId] || 
               dataConfig.simulatedData.weatherForecast[dataConfig.defaultLocation];
               
    } catch (error) {
        console.warn('Erro ao buscar dados NASA, usando dados simulados:', error);
        return dataConfig.simulatedData.weatherForecast[locationId] || 
               dataConfig.simulatedData.weatherForecast[dataConfig.defaultLocation];
    }
}

/**
 * Inicializa a integração com NASA GIBS
 */
function initNASAIntegration() {
    console.log('Inicializando integração NASA GIBS...');
    
    // Define a data atual para as requisições
    dataConfig.nasaGibs.time = getCurrentDateForNASA();
    
    // Atualiza os mapas com dados NASA se estiverem disponíveis
    if (typeof L !== 'undefined') {
        updateNASAMaps();
    } else {
        console.log('Leaflet não disponível, usando dados simulados');
    }
}

/**
 * Alterna entre dados simulados e dados reais da NASA
 * @param {boolean} useRealData - Se true, usa dados reais da NASA; se false, usa dados simulados
 */
function toggleNASAData(useRealData = true) {
    if (useRealData && typeof L !== 'undefined') {
        console.log('Alternando para dados reais da NASA...');
        updateNASAMaps();
    } else {
        console.log('Alternando para dados simulados...');
        // Recarrega dados simulados
        if (dataConfig.maps.soilMoisture) {
            updateSimulatedMap(dataConfig.maps.soilMoisture, 'soilMoisture', dataConfig.defaultLocation);
        }
        if (dataConfig.maps.vegetation) {
            updateSimulatedMap(dataConfig.maps.vegetation, 'vegetation', dataConfig.defaultLocation);
        }
    }
}
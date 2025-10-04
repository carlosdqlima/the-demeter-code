/**
 * Módulo de eventos do jogo
 * Responsável por gerenciar eventos aleatórios e desafios
 */

// Configuração dos eventos
const eventsConfig = {
    // Eventos pré-definidos
    events: {
        welcome: {
            title: 'Bem-vindo ao Programa NASA Farm Navigators',
            description: 'Olá, novo gestor! Bem-vindo à sua fazenda-piloto. Sua missão é transformá-la em um modelo de produtividade e sustentabilidade utilizando dados da NASA. Comece plantando algumas culturas e explore os dados disponíveis para tomar decisões informadas.',
            options: [
                {
                    text: 'Vamos começar!',
                    effect: () => {
                        console.log('Jogo iniciado!');
                    }
                }
            ]
        },
        drought: {
            title: 'Alerta de Seca',
            description: 'Os dados de satélite da NASA indicam uma onda de calor se aproximando. A umidade do solo deve cair drasticamente nos próximos dias. Prepare-se!',
            options: [
                {
                    text: 'Aumentar a irrigação (Custo: 30 água)',
                    effect: () => {
                        if (gameState.water >= 30) {
                            gameState.water -= 30;
                            updateSustainability(-5);
                            return 'Você aumentou a irrigação, protegendo suas culturas, mas com um custo para a sustentabilidade.';
                        } else {
                            return 'Você não tem água suficiente!';
                        }
                    }
                },
                {
                    text: 'Plantar culturas resistentes à seca',
                    effect: () => {
                        updateSustainability(10);
                        return 'Boa escolha! Culturas resistentes à seca são mais sustentáveis em períodos de escassez de água.';
                    }
                },
                {
                    text: 'Ignorar o alerta',
                    effect: () => {
                        // Seca todas as plantas não irrigadas
                        farmState.plots.forEach(plot => {
                            if (plot.state !== farmConfig.plotStates.empty && !plot.irrigated) {
                                plot.state = farmConfig.plotStates.dry;
                            }
                        });
                        renderFarm();
                        return 'Suas culturas não irrigadas sofreram com a seca!';
                    }
                }
            ]
        },
        heavyRain: {
            title: 'Chuvas Intensas',
            description: 'Os dados meteorológicos da NASA preveem chuvas intensas nos próximos dias. Isso pode ser bom para suas culturas, mas também pode causar erosão do solo.',
            options: [
                {
                    text: 'Implementar técnicas de contenção de erosão (Custo: $50)',
                    effect: () => {
                        if (gameState.money >= 50) {
                            gameState.money -= 50;
                            updateSustainability(15);
                            // Adiciona água extra
                            gameState.water += 20;
                            return 'Você implementou técnicas de contenção de erosão e ainda aproveitou a água da chuva!';
                        } else {
                            return 'Você não tem dinheiro suficiente!';
                        }
                    }
                },
                {
                    text: 'Reduzir a irrigação para economizar água',
                    effect: () => {
                        gameState.water += 10;
                        updateSustainability(5);
                        return 'Você economizou água, aproveitando as chuvas naturais.';
                    }
                },
                {
                    text: 'Não fazer nada',
                    effect: () => {
                        // 50% de chance de erosão
                        if (Math.random() < 0.5) {
                            updateSustainability(-10);
                            return 'Infelizmente, a chuva intensa causou erosão em parte de sua fazenda.';
                        } else {
                            gameState.water += 5;
                            return 'A chuva foi benéfica para suas culturas sem causar danos.';
                        }
                    }
                }
            ]
        },
        pestInfestation: {
            title: 'Infestação de Pragas',
            description: 'As imagens de satélite da NASA detectaram padrões que sugerem uma infestação de pragas em sua região. Suas culturas estão em risco!',
            options: [
                {
                    text: 'Usar pesticidas químicos (Custo: $100)',
                    effect: () => {
                        if (gameState.money >= 100) {
                            gameState.money -= 100;
                            updateSustainability(-20);
                            return 'Os pesticidas eliminaram as pragas, mas tiveram um impacto negativo na sustentabilidade.';
                        } else {
                            return 'Você não tem dinheiro suficiente!';
                        }
                    }
                },
                {
                    text: 'Usar controle biológico de pragas (Custo: $150)',
                    effect: () => {
                        if (gameState.money >= 150) {
                            gameState.money -= 150;
                            updateSustainability(10);
                            return 'O controle biológico foi eficaz e ainda melhorou sua pontuação de sustentabilidade!';
                        } else {
                            return 'Você não tem dinheiro suficiente!';
                        }
                    }
                },
                {
                    text: 'Não fazer nada',
                    effect: () => {
                        // Reduz a produtividade
                        updateProductivity(-15);
                        return 'As pragas danificaram suas culturas, reduzindo sua produtividade.';
                    }
                }
            ]
        },
        marketOpportunity: {
            title: 'Oportunidade de Mercado',
            description: 'Há uma alta demanda por produtos agrícolas sustentáveis no mercado. Esta é uma boa oportunidade para aumentar seus lucros!',
            options: [
                {
                    text: 'Focar na produção sustentável',
                    effect: () => {
                        if (gameState.sustainability >= 50) {
                            gameState.money += 200;
                            return 'Sua abordagem sustentável rendeu um bônus de $200!';
                        } else {
                            return 'Sua fazenda não é sustentável o suficiente para aproveitar esta oportunidade.';
                        }
                    }
                },
                {
                    text: 'Maximizar a produção a qualquer custo',
                    effect: () => {
                        gameState.money += 100;
                        updateSustainability(-10);
                        return 'Você ganhou $100, mas sua sustentabilidade foi afetada.';
                    }
                },
                {
                    text: 'Manter o curso atual',
                    effect: () => {
                        return 'Você decidiu não mudar sua estratégia.';
                    }
                }
            ]
        },
        researchBreakthrough: {
            title: 'Avanço na Pesquisa',
            description: 'A NASA compartilhou novos dados que podem melhorar significativamente suas práticas agrícolas. Isso pode ser um grande avanço para sua fazenda!',
            options: [
                {
                    text: 'Investir em novas tecnologias (Custo: $200)',
                    effect: () => {
                        if (gameState.money >= 200) {
                            gameState.money -= 200;
                            gameState.research += 50;
                            return 'Você investiu em novas tecnologias e ganhou 50 pontos de pesquisa!';
                        } else {
                            return 'Você não tem dinheiro suficiente!';
                        }
                    }
                },
                {
                    text: 'Compartilhar os dados com outros agricultores',
                    effect: () => {
                        gameState.research += 20;
                        updateSustainability(10);
                        return 'Você compartilhou os dados, ganhando 20 pontos de pesquisa e melhorando sua sustentabilidade!';
                    }
                },
                {
                    text: 'Ignorar os novos dados',
                    effect: () => {
                        return 'Você decidiu não utilizar os novos dados por enquanto.';
                    }
                }
            ]
        }
    }
};

/**
 * Inicializa o sistema de eventos
 */
function initEvents() {
    // Adiciona evento de clique ao botão de continuar do modal de eventos
    document.getElementById('event-options').addEventListener('click', handleEventOption);
}

/**
 * Manipula a seleção de uma opção de evento
 * @param {Event} e - Evento de clique
 */
function handleEventOption(e) {
    if (e.target.tagName === 'BUTTON') {
        const optionIndex = parseInt(e.target.dataset.index);
        const eventId = e.target.dataset.event;
        const event = eventsConfig.events[eventId];
        
        if (event && event.options[optionIndex]) {
            const result = event.options[optionIndex].effect();
            
            // Se houver um resultado, mostra-o
            if (result) {
                // Atualiza a descrição do evento com o resultado
                document.getElementById('event-description').textContent = result;
                
                // Remove as opções
                document.getElementById('event-options').innerHTML = `
                    <button class="close-event">Continuar</button>
                `;
                
                // Adiciona evento ao botão de continuar
                document.querySelector('.close-event').addEventListener('click', () => {
                    document.getElementById('event-modal').style.display = 'none';
                    
                    // Atualiza a interface
                    updateUI();
                    renderFarm();
                });
            } else {
                // Fecha o modal se não houver resultado
                document.getElementById('event-modal').style.display = 'none';
                
                // Atualiza a interface
                updateUI();
                renderFarm();
            }
        }
    }
}

/**
 * Dispara um evento específico
 * @param {string} eventId - ID do evento a ser disparado
 */
function triggerEvent(eventId) {
    const event = eventsConfig.events[eventId];
    
    if (!event) {
        console.error(`Evento ${eventId} não encontrado!`);
        return;
    }
    
    // Atualiza o conteúdo do modal
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-description').textContent = event.description;
    
    // Cria os botões de opção
    const optionsContainer = document.getElementById('event-options');
    optionsContainer.innerHTML = '';
    
    event.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.dataset.index = index;
        button.dataset.event = eventId;
        optionsContainer.appendChild(button);
    });
    
    // Mostra o modal
    document.getElementById('event-modal').style.display = 'block';
}

/**
 * Gera um evento aleatório
 */
function generateRandomEvent() {
    // Lista de eventos possíveis (excluindo o evento de boas-vindas)
    const possibleEvents = Object.keys(eventsConfig.events).filter(id => id !== 'welcome');
    
    // Seleciona um evento aleatório
    const randomIndex = Math.floor(Math.random() * possibleEvents.length);
    const eventId = possibleEvents[randomIndex];
    
    // Dispara o evento
    triggerEvent(eventId);
}
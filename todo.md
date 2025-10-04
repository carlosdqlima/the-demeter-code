Roadmap de Desenvolvimento: Jogo "The Demeter Code"
Título do Jogo: The Demeter Code
Gênero: Jogo de Simulação e Gerenciamento (Management Simulation Game)
Plataforma: Web (HTML5, CSS3, JavaScript)


Tema Central: Utilizar dados abertos da NASA para promover práticas agrícolas sustentáveis e inovadoras. 


Fase 1: Conceituação e Planejamento (Pré-Produção)
1. Definição do Core Loop (Ciclo Principal de Jogo):

Plantar: O jogador escolhe o que e onde plantar em sua fazenda virtual.


Gerenciar: O jogador toma decisões sobre irrigação, fertilização e manejo de pragas, utilizando dados da NASA apresentados de forma simplificada. 


Monitorar: O jogador acompanha a saúde da plantação e os indicadores ambientais (umidade do solo, clima, etc.) que mudam com base nos dados reais e nas ações tomadas.


Colher e Analisar: O jogador realiza a colheita e recebe um feedback sobre seu desempenho, medido em produtividade (quantidade colhida) e sustentabilidade (impacto ambiental). 




Inovar: Com base nos resultados, o jogador ganha "Pontos de Pesquisa" para desbloquear novas tecnologias, dados da NASA ou práticas sustentáveis. 

2. Objetivos Educacionais Claros:


Conscientização: Educar os jogadores sobre os desafios reais da agricultura, como mudanças climáticas e crescimento populacional. 



Aplicação de Dados: Demonstrar como dados da NASA (ex: imagens de satélite, dados climáticos) podem ser usados na prática para tomar decisões agrícolas mais inteligentes. 



Sustentabilidade: Ensinar a importância de técnicas de conservação para preservar recursos e a viabilidade da terra a longo prazo. 



Acessibilidade: Tornar o conhecimento sobre essas tecnologias acessível a um público amplo, sem necessidade de conhecimento científico prévio. 


3. Persona do Jogador:

Público-alvo: Estudantes, entusiastas de tecnologia, pequenos agricultores e o público geral interessado em sustentabilidade e ciência. O jogo deve ser acessível para todas as idades e níveis de conhecimento.

4. Narrativa e Contexto:

O jogador assume o papel de um(a) novo(a) gestor(a) de uma fazenda-piloto, parte de um programa da NASA para testar inovações na agricultura ("NASA Farm Navigators"). 



Missão: Transformar a fazenda em um modelo de produtividade e sustentabilidade, enfrentando desafios baseados em cenários reais (secas, pragas, etc.). 


Um "Mentor Virtual" (um cientista da NASA) pode guiar o jogador, explicando os dados e dando dicas, evitando que o jogador se sinta sobrecarregado. 


Fase 2: Design do Jogo (Produção - Estrutura)
1. Interface do Usuário (UI) e Experiência do Usuário (UX):

Painel Principal: Visão da fazenda (isométrica, 2D).

Dashboard de Dados da NASA: Uma área dedicada onde o jogador acessa os dados.


Mapa Interativo (Leaflet.js): Para visualização de dados como umidade do solo (Crop-CASMA), focos de seca (U.S. Drought Monitor) e saúde da vegetação. 


Gráficos Simples: Apresentar dados de temperatura e previsão de chuva de forma intuitiva.

Árvore Tecnológica (Tech Tree): Similar ao jogo "Top Crop", uma área onde os "Pontos de Pesquisa" podem ser gastos para desbloquear:


Novas Culturas: Adaptadas a diferentes condições. 


Tecnologias Sustentáveis: Irrigação por gotejamento, drones para monitoramento, fertilizantes de precisão. 


Acesso a Novos Datasets da NASA: Desbloquear camadas de dados mais avançadas para decisões mais precisas.


Alertas e Notificações: Informar o jogador sobre eventos importantes, como "Alerta de seca previsto para a próxima semana" ou "Sinais de pragas detectados via satélite". 

2. Mecânicas de Jogo:

Recursos para Gerenciar:

Dinheiro/Orçamento: Para comprar sementes, equipamentos e tecnologias.

Água: Um recurso finito, incentivando o uso consciente.

Pontos de Pesquisa: Ganhos ao final de cada colheita, com bônus por alta sustentabilidade.

Sistema de Eventos Aleatórios e Desafios:


Desafios baseados em dados históricos: Simular uma seca real que ocorreu em determinada região, desafiando o jogador a usar os dados da NASA para mitigar os danos. 

Eventos: Surgimento de pragas, chuvas inesperadas, mudanças no mercado de grãos.

Indicadores de Performance:

Produtividade (Yield): Quantidade de colheita.


Sustentabilidade: Uma pontuação que aumenta com práticas como rotação de culturas e uso de biopesticidas, e diminui com o uso excessivo de água ou fertilizantes químicos. 


A pontuação final do jogador é uma combinação de ambos, incentivando o equilíbrio.

3. Integração dos Dados da NASA (de forma simplificada):

O jogo não precisa processar dados em tempo real. Pode-se usar um conjunto de dados históricos ou pré-processados da NASA para criar os cenários.

Exemplo prático:

O jogador quer plantar.

Ele consulta o "Monitor de Umidade do Solo" (baseado no Crop-CASMA) no dashboard. 

O mapa mostra que uma área de sua fazenda está mais seca.

Decisão: O jogador pode instalar irrigação por gotejamento (tecnologia desbloqueada) naquela área específica ou escolher uma cultura mais resistente à seca.

Fase 3: Desenvolvimento e Conteúdo (Produção - Implementação)
1. Ciclos de Jogo (Rounds):

O jogo pode ser estruturado em "ciclos" ou "estações" (ex: 10 rodadas, como no "Top Crop"). 


Cada rodada tem fases:

Planejamento: Analisar os dados, comprar upgrades.

Ação: Plantar, irrigar, fertilizar.

Crescimento: Período de espera simulado onde eventos podem ocorrer.

Colheita e Resultados: Ver os scores e ganhar recompensas.

2. Conteúdo Educacional:


Tutoriais Interativos: Ensinar as mecânicas básicas e como interpretar os primeiros dados da NASA. 


"Você Sabia?": Pequenas caixas de informação que aparecem quando o jogador usa uma nova tecnologia ou dado, explicando sua aplicação no mundo real. 


Glossário: Um local para consultar termos técnicos de forma simples (ex: NDVI, umidade do solo, sensoriamento remoto). 


3. Elementos de Engajamento:


Metas e Conquistas: "Complete uma estação sem usar pesticidas químicos", "Alcance 95% de eficiência no uso da água". 

Progressão Visual: A fazenda do jogador deve evoluir visualmente, de um pequeno lote a uma fazenda moderna e tecnológica.

Feedback Claro: O jogador precisa entender por que sua pontuação de sustentabilidade caiu ou por que sua colheita foi bem-sucedida.

Fase 4: Pós-Produção e Lançamento

2. Documentação:

Criar uma pequena documentação explicando o jogo, os dados da NASA utilizados e como ele resolve o desafio proposto no Space Apps.


// misterios.js — dados completos dos quatro grupos de mistérios do terço

const MISTERIOS = {
  gozosos: {
    nome: 'Mistérios Gozosos',
    dias: ['Segunda-feira', 'Sábado'],
    cor: '#d97706',
    gradiente: 'from-yellow-600 to-amber-400',
    badge: 'badge-warning',
    icone: '✨',
    lista: [
      {
        titulo: '1º Mistério Gozoso',
        subtitulo: 'A Anunciação do Anjo a Maria Santíssima',
        meditacao:
          'O Anjo Gabriel anuncia a Maria que ela será a Mãe do Filho de Deus. Maria responde com humildade: "Eis aqui a escrava do Senhor; faça-se em mim segundo a tua palavra." (Lc 1,38)',
        fruto: 'Humildade',
      },
      {
        titulo: '2º Mistério Gozoso',
        subtitulo: 'A Visitação de Maria a Santa Isabel',
        meditacao:
          'Maria visita sua prima Isabel, que estava grávida de João Batista. Ao ouvir a saudação de Maria, o menino saltou de alegria no ventre de Isabel. (Lc 1,39-56)',
        fruto: 'Amor ao próximo',
      },
      {
        titulo: '3º Mistério Gozoso',
        subtitulo: 'O Nascimento de Nosso Senhor Jesus Cristo',
        meditacao:
          'Jesus nasce em Belém, em uma manjedoura, envolto em faixas. Os anjos anunciam aos pastores: "Hoje vos nasceu o Salvador, que é Cristo Senhor." (Lc 2,1-20)',
        fruto: 'Pobreza de espírito',
      },
      {
        titulo: '4º Mistério Gozoso',
        subtitulo: 'A Apresentação de Jesus no Templo',
        meditacao:
          'Maria e José apresentam o Menino Jesus no Templo de Jerusalém. Simeão reconhece o Salvador e profetiza: "Uma espada atravessará a tua alma." (Lc 2,22-38)',
        fruto: 'Obediência',
      },
      {
        titulo: '5º Mistério Gozoso',
        subtitulo: 'A Perda e o Encontro de Jesus no Templo',
        meditacao:
          'Aos doze anos, Jesus fica no Templo ensinando os doutores da Lei. Maria e José o procuram por três dias e o encontram entre os mestres. (Lc 2,41-52)',
        fruto: 'Piedade',
      },
    ],
  },

  dolorosos: {
    nome: 'Mistérios Dolorosos',
    dias: ['Terça-feira', 'Sexta-feira'],
    cor: '#991b1b',
    gradiente: 'from-red-900 to-red-600',
    badge: 'badge-error',
    icone: '✝️',
    lista: [
      {
        titulo: '1º Mistério Doloroso',
        subtitulo: 'A Agonia de Jesus no Horto',
        meditacao:
          'Jesus ora no jardim do Getsêmani. Sua angústia é tão grande que sua transpiração torna-se como gotas de sangue. "Pai, se queres, afasta de mim este cálice; todavia, não se faça a minha vontade, mas a tua." (Lc 22,39-46)',
        fruto: 'Contrição dos pecados',
      },
      {
        titulo: '2º Mistério Doloroso',
        subtitulo: 'A Flagelação de Jesus',
        meditacao:
          'Pilatos manda flagelar Jesus. Os soldados o açoitam cruelmente. Pelas Suas chagas fomos curados. (Mt 27,26; Is 53,5)',
        fruto: 'Mortificação dos sentidos',
      },
      {
        titulo: '3º Mistério Doloroso',
        subtitulo: 'A Coroação de Espinhos',
        meditacao:
          'Os soldados trançam uma coroa de espinhos e a colocam na cabeça de Jesus, escarnecendo-O: "Salve, Rei dos Judeus!" (Mt 27,27-31)',
        fruto: 'Desprezo do mundo',
      },
      {
        titulo: '4º Mistério Doloroso',
        subtitulo: 'Jesus carrega a Cruz',
        meditacao:
          'Jesus carrega a cruz pesada pelo caminho do Calvário — Via Dolorosa — caindo três vezes. Simão de Cirene é obrigado a ajudá-Lo. (Lc 23,26-32)',
        fruto: 'Paciência',
      },
      {
        titulo: '5º Mistério Doloroso',
        subtitulo: 'A Crucificação e Morte de Jesus',
        meditacao:
          'Jesus é crucificado entre dois ladrões no Calvário. Depois de três horas de agonia, entrega o espírito: "Pai, nas Tuas mãos entrego o Meu espírito." (Lc 23,33-46)',
        fruto: 'Salvação das almas',
      },
    ],
  },

  gloriosos: {
    nome: 'Mistérios Gloriosos',
    dias: ['Quarta-feira', 'Domingo'],
    cor: '#5b21b6',
    gradiente: 'from-purple-900 to-violet-500',
    badge: 'badge-secondary',
    icone: '👑',
    lista: [
      {
        titulo: '1º Mistério Glorioso',
        subtitulo: 'A Ressurreição de Nosso Senhor',
        meditacao:
          'No terceiro dia, Jesus ressuscita glorioso dos mortos. O anjo anuncia às mulheres: "Não está aqui, ressuscitou como havia dito." (Mt 28,1-10)',
        fruto: 'Fé',
      },
      {
        titulo: '2º Mistério Glorioso',
        subtitulo: 'A Ascensão de Jesus ao Céu',
        meditacao:
          'Quarenta dias após a Ressurreição, Jesus sobe ao Céu diante dos apóstolos no Monte das Oliveiras. "Eu estarei convosco todos os dias até a consumação dos séculos." (At 1,9-11)',
        fruto: 'Esperança',
      },
      {
        titulo: '3º Mistério Glorioso',
        subtitulo: 'A Vinda do Espírito Santo',
        meditacao:
          'No dia de Pentecostes, o Espírito Santo desce sobre Maria e os apóstolos sob a forma de línguas de fogo. Todos ficam cheios do Espírito Santo. (At 2,1-13)',
        fruto: 'Amor de Deus',
      },
      {
        titulo: '4º Mistério Glorioso',
        subtitulo: 'A Assunção de Maria ao Céu',
        meditacao:
          'Maria Santíssima, terminada a missão na terra, é elevada em corpo e alma ao Céu por seu Filho divino. (Ap 12,1)',
        fruto: 'Graça da boa morte',
      },
      {
        titulo: '5º Mistério Glorioso',
        subtitulo: 'A Coroação de Maria Rainha do Céu',
        meditacao:
          'Maria é coroada Rainha do Céu e da Terra, dos Anjos e dos Santos, pelo seu Filho Jesus Cristo. "Uma grande sinal apareceu no Céu: uma Mulher vestida de sol." (Ap 12,1)',
        fruto: 'Perseverança final',
      },
    ],
  },

  luminosos: {
    nome: 'Mistérios Luminosos',
    dias: ['Quinta-feira'],
    cor: '#1d4ed8',
    gradiente: 'from-blue-900 to-blue-400',
    badge: 'badge-info',
    icone: '💡',
    lista: [
      {
        titulo: '1º Mistério Luminoso',
        subtitulo: 'O Batismo de Jesus no Jordão',
        meditacao:
          'Jesus é batizado por João no Rio Jordão. O Espírito Santo desce sobre Ele como pomba e ouve-se a voz do Pai: "Este é o meu Filho amado, em quem me comprazo." (Mt 3,13-17)',
        fruto: 'Abertura ao Espírito Santo',
      },
      {
        titulo: '2º Mistério Luminoso',
        subtitulo: 'A Auto-revelação de Jesus nas Bodas de Caná',
        meditacao:
          'No festim de casamento em Caná, a pedido de Maria, Jesus transforma a água em vinho. É o primeiro milagre público de Jesus. (Jo 2,1-12)',
        fruto: 'Intercessão de Maria',
      },
      {
        titulo: '3º Mistério Luminoso',
        subtitulo: 'A Proclamação do Reino de Deus',
        meditacao:
          'Jesus proclama o Reino de Deus e chama todos à conversão: "O tempo está cumprido e o Reino de Deus está próximo; convertei-vos e crede no Evangelho." (Mc 1,15)',
        fruto: 'Conversão',
      },
      {
        titulo: '4º Mistério Luminoso',
        subtitulo: 'A Transfiguração de Jesus',
        meditacao:
          'No Monte Tabor, Jesus se transfigura diante de Pedro, Tiago e João. Seu rosto brilha como o sol e Suas vestes ficam brancas como a luz. (Mt 17,1-9)',
        fruto: 'Desejo de santidade',
      },
      {
        titulo: '5º Mistério Luminoso',
        subtitulo: 'A Instituição da Eucaristia',
        meditacao:
          'Na última Ceia, Jesus institui a Eucaristia: "Tomai e comei: isto é o Meu Corpo. Tomai e bebei: este é o cálice do Meu Sangue." (Mt 26,26-28)',
        fruto: 'Adoração',
      },
    ],
  },
};

function getMisteriosDoDia() {
  const dia = new Date().getDay(); // 0=Dom 1=Seg 2=Ter 3=Qua 4=Qui 5=Sex 6=Sáb
  const mapa = { 0: 'gloriosos', 1: 'gozosos', 2: 'dolorosos', 3: 'gloriosos', 4: 'luminosos', 5: 'dolorosos', 6: 'gozosos' };
  return MISTERIOS[mapa[dia]];
}

// oracoes.js — textos completos de todas as orações do terço

const ORACOES = {
  sinalDaCruz: {
    id: 'sinal-da-cruz',
    nome: 'Sinal da Cruz',
    texto: `Pelo sinal da Santa Cruz,\nlivrai-nos, Deus nosso Senhor,\ndos nossos inimigos.\n\nEm nome do Pai,\ne do Filho,\ne do Espírito Santo.\n\nAmém.`,
    tipo: 'abertura',
  },

  credoApostolico: {
    id: 'credo',
    nome: 'Creio em Deus Pai',
    texto: `Creio em Deus Pai todo-poderoso,\nCriador do céu e da terra.\nE em Jesus Cristo,\nSeu único Filho, Nosso Senhor,\nque foi concebido pelo poder do Espírito Santo,\nnasceu da Virgem Maria,\npadeceu sob Pôncio Pilatos,\nfoi crucificado, morto e sepultado,\ndesceu à mansão dos mortos,\nressuscitou ao terceiro dia,\nsubiu aos céus,\nestá sentado à direita de Deus Pai todo-poderoso,\nd'onde há de vir a julgar os vivos e os mortos.\n\nCreio no Espírito Santo,\nna Santa Igreja Católica,\nna comunhão dos santos,\nna remissão dos pecados,\nna ressurreição da carne,\nna vida eterna.\n\nAmém.`,
    tipo: 'abertura',
  },

  paiNosso: {
    id: 'pai-nosso',
    nome: 'Pai Nosso',
    texto: `Pai nosso que estais no céu,\nsantificado seja o Vosso nome,\nvenha a nós o Vosso reino,\nseja feita a Vossa vontade,\nassim na terra como no céu.\n\nO pão nosso de cada dia nos dai hoje,\nperdoai-nos as nossas ofensas,\nassim como nós perdoamos\na quem nos tem ofendido,\ne não nos deixeis cair em tentação,\nmas livrai-nos do mal.\n\nAmém.`,
    tipo: 'padre',
  },

  aveMaria: {
    id: 'ave-maria',
    nome: 'Ave Maria',
    texto: `Ave Maria, cheia de graça,\no Senhor é convosco,\nbendita sois vós entre as mulheres,\ne bendito é o fruto do vosso ventre, Jesus.\n\nSanta Maria, Mãe de Deus,\nrogai por nós pecadores,\nagora e na hora da nossa morte.\n\nAmém.`,
    tipo: 'ave',
  },

  gloriaAoPai: {
    id: 'gloria',
    nome: 'Glória ao Pai',
    texto: `Glória ao Pai,\ne ao Filho,\ne ao Espírito Santo.\n\nComo era no princípio,\nagora e sempre,\npor todos os séculos dos séculos.\n\nAmém.`,
    tipo: 'gloria',
  },

  fatima: {
    id: 'fatima',
    nome: 'Oração de Fátima',
    texto: `Ó meu Jesus,\nperdoai-nos os nossos pecados,\nlivrai-nos do fogo do inferno,\nlevai as alminhas todas para o céu,\nespecialmente as que mais precisarem\nda Vossa misericórdia.\n\nAmém.`,
    tipo: 'fatima',
  },

  salveRainha: {
    id: 'salve-rainha',
    nome: 'Salve Rainha',
    texto: `Salve, Rainha, Mãe de misericórdia,\nvida, doçura e esperança nossa, salve!\nA Vós bradamos, os degredados filhos de Eva.\nA Vós suspiramos, gemendo e chorando\nneste vale de lágrimas.\n\nEia pois, advogada nossa,\nessas Vossas misericordiosas vistas a nós voltai.\nE depois deste desterro,\nmostrai-nos Jesus, bendito fruto do Vosso ventre,\nó clemente, ó piedosa,\nó doce sempre Virgem Maria.\n\nRogai por nós, Santa Mãe de Deus,\npara que sejamos dignos das promessas de Cristo.\n\nAmém.`,
    tipo: 'enceramento',
  },

  oracao_final: {
    id: 'oracao-final',
    nome: 'Oração Final',
    texto: `Ó Deus, cuja Unigênito Filho,\ncom a Sua vida, morte e Ressurreição,\nnos conquistou o prêmio da salvação eterna,\nconcedei-nos, pedimos-Vos,\nque meditando estes mistérios\ndo Santíssimo Rosário da Virgem Maria,\nimitemos o que eles encerram\ne alcancemos o que prometem.\n\nPelo mesmo Cristo Nosso Senhor.\n\nAmém.`,
    tipo: 'enceramento',
  },

  agradecimento: {
    id: 'agradecimento',
    nome: 'Agradecimento',
    texto: `Graças Te damos, Senhor Deus nosso,\npor todos os Vossos benefícios,\na Vós que viveis e reinais por todos os séculos dos séculos.\n\nAmém.\n\nO divino auxílio permaneça sempre conosco.\n\nAmém.\n\nE as almas dos fiéis defuntos,\npela misericórdia de Deus,\ndescansem em paz.\n\nAmém.`,
    tipo: 'enceramento',
  },
};

// Retorna o texto de uma oração pelo ID
function getOracao(id) {
  return Object.values(ORACOES).find((o) => o.id === id) || null;
}

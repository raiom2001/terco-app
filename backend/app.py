"""
app.py — Backend Flask para o Terço Católico Interativo.

Endpoints:
  GET /api/liturgia         → retorna os mistérios do dia baseado no dia da semana
  GET /api/misterios/<tipo> → retorna um grupo específico de mistérios
  GET /api/oracoes          → retorna todos os textos das orações
  GET /api/saude            → health check
"""

import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime

# Aponta para a pasta frontend que está um nível acima do backend
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)  # permite chamadas do frontend (Capacitor / browser local)

# ---------------------------------------------------------------------------
# Dados dos mistérios
# ---------------------------------------------------------------------------

MISTERIOS = {
    "gozosos": {
        "nome": "Mistérios Gozosos",
        "dias": ["Segunda-feira", "Sábado"],
        "cor": "#d97706",
        "icone": "✨",
        "lista": [
            {
                "titulo": "1º Mistério Gozoso",
                "subtitulo": "A Anunciação do Anjo a Maria Santíssima",
                "meditacao": (
                    "O Anjo Gabriel anuncia a Maria que ela será a Mãe do Filho de Deus. "
                    "Maria responde com humildade: "
                    '"Eis aqui a escrava do Senhor; faça-se em mim segundo a tua palavra." (Lc 1,38)'
                ),
                "fruto": "Humildade",
            },
            {
                "titulo": "2º Mistério Gozoso",
                "subtitulo": "A Visitação de Maria a Santa Isabel",
                "meditacao": (
                    "Maria visita sua prima Isabel, que estava grávida de João Batista. "
                    "Ao ouvir a saudação de Maria, o menino saltou de alegria no ventre de Isabel. (Lc 1,39-56)"
                ),
                "fruto": "Amor ao próximo",
            },
            {
                "titulo": "3º Mistério Gozoso",
                "subtitulo": "O Nascimento de Nosso Senhor Jesus Cristo",
                "meditacao": (
                    "Jesus nasce em Belém, em uma manjedoura, envolto em faixas. "
                    'Os anjos anunciam aos pastores: "Hoje vos nasceu o Salvador, que é Cristo Senhor." (Lc 2,1-20)'
                ),
                "fruto": "Pobreza de espírito",
            },
            {
                "titulo": "4º Mistério Gozoso",
                "subtitulo": "A Apresentação de Jesus no Templo",
                "meditacao": (
                    "Maria e José apresentam o Menino Jesus no Templo de Jerusalém. "
                    'Simeão reconhece o Salvador e profetiza: "Uma espada atravessará a tua alma." (Lc 2,22-38)'
                ),
                "fruto": "Obediência",
            },
            {
                "titulo": "5º Mistério Gozoso",
                "subtitulo": "A Perda e o Encontro de Jesus no Templo",
                "meditacao": (
                    "Aos doze anos, Jesus fica no Templo ensinando os doutores da Lei. "
                    "Maria e José o procuram por três dias e o encontram entre os mestres. (Lc 2,41-52)"
                ),
                "fruto": "Piedade",
            },
        ],
    },

    "dolorosos": {
        "nome": "Mistérios Dolorosos",
        "dias": ["Terça-feira", "Sexta-feira"],
        "cor": "#991b1b",
        "icone": "✝️",
        "lista": [
            {
                "titulo": "1º Mistério Doloroso",
                "subtitulo": "A Agonia de Jesus no Horto",
                "meditacao": (
                    "Jesus ora no jardim do Getsêmani. Sua angústia é tão grande que sua transpiração "
                    'torna-se como gotas de sangue. "Pai, se queres, afasta de mim este cálice; '
                    'todavia, não se faça a minha vontade, mas a tua." (Lc 22,39-46)'
                ),
                "fruto": "Contrição dos pecados",
            },
            {
                "titulo": "2º Mistério Doloroso",
                "subtitulo": "A Flagelação de Jesus",
                "meditacao": (
                    "Pilatos manda flagelar Jesus. Os soldados o açoitam cruelmente. "
                    "Pelas Suas chagas fomos curados. (Mt 27,26; Is 53,5)"
                ),
                "fruto": "Mortificação dos sentidos",
            },
            {
                "titulo": "3º Mistério Doloroso",
                "subtitulo": "A Coroação de Espinhos",
                "meditacao": (
                    "Os soldados trançam uma coroa de espinhos e a colocam na cabeça de Jesus, "
                    'escarnecendo-O: "Salve, Rei dos Judeus!" (Mt 27,27-31)'
                ),
                "fruto": "Desprezo do mundo",
            },
            {
                "titulo": "4º Mistério Doloroso",
                "subtitulo": "Jesus carrega a Cruz",
                "meditacao": (
                    "Jesus carrega a cruz pesada pelo caminho do Calvário — Via Dolorosa — caindo três vezes. "
                    "Simão de Cirene é obrigado a ajudá-Lo. (Lc 23,26-32)"
                ),
                "fruto": "Paciência",
            },
            {
                "titulo": "5º Mistério Doloroso",
                "subtitulo": "A Crucificação e Morte de Jesus",
                "meditacao": (
                    "Jesus é crucificado entre dois ladrões no Calvário. Depois de três horas de agonia, "
                    'entrega o espírito: "Pai, nas Tuas mãos entrego o Meu espírito." (Lc 23,33-46)'
                ),
                "fruto": "Salvação das almas",
            },
        ],
    },

    "gloriosos": {
        "nome": "Mistérios Gloriosos",
        "dias": ["Quarta-feira", "Domingo"],
        "cor": "#5b21b6",
        "icone": "👑",
        "lista": [
            {
                "titulo": "1º Mistério Glorioso",
                "subtitulo": "A Ressurreição de Nosso Senhor",
                "meditacao": (
                    'No terceiro dia, Jesus ressuscita glorioso dos mortos. O anjo anuncia às mulheres: '
                    '"Não está aqui, ressuscitou como havia dito." (Mt 28,1-10)'
                ),
                "fruto": "Fé",
            },
            {
                "titulo": "2º Mistério Glorioso",
                "subtitulo": "A Ascensão de Jesus ao Céu",
                "meditacao": (
                    "Quarenta dias após a Ressurreição, Jesus sobe ao Céu diante dos apóstolos "
                    'no Monte das Oliveiras. "Eu estarei convosco todos os dias até a consumação dos séculos." (At 1,9-11)'
                ),
                "fruto": "Esperança",
            },
            {
                "titulo": "3º Mistério Glorioso",
                "subtitulo": "A Vinda do Espírito Santo",
                "meditacao": (
                    "No dia de Pentecostes, o Espírito Santo desce sobre Maria e os apóstolos "
                    "sob a forma de línguas de fogo. Todos ficam cheios do Espírito Santo. (At 2,1-13)"
                ),
                "fruto": "Amor de Deus",
            },
            {
                "titulo": "4º Mistério Glorioso",
                "subtitulo": "A Assunção de Maria ao Céu",
                "meditacao": (
                    "Maria Santíssima, terminada a missão na terra, é elevada em corpo e alma "
                    "ao Céu por seu Filho divino. (Ap 12,1)"
                ),
                "fruto": "Graça da boa morte",
            },
            {
                "titulo": "5º Mistério Glorioso",
                "subtitulo": "A Coroação de Maria Rainha do Céu",
                "meditacao": (
                    "Maria é coroada Rainha do Céu e da Terra, dos Anjos e dos Santos, pelo seu Filho Jesus Cristo. "
                    '"Uma grande sinal apareceu no Céu: uma Mulher vestida de sol." (Ap 12,1)'
                ),
                "fruto": "Perseverança final",
            },
        ],
    },

    "luminosos": {
        "nome": "Mistérios Luminosos",
        "dias": ["Quinta-feira"],
        "cor": "#1d4ed8",
        "icone": "💡",
        "lista": [
            {
                "titulo": "1º Mistério Luminoso",
                "subtitulo": "O Batismo de Jesus no Jordão",
                "meditacao": (
                    "Jesus é batizado por João no Rio Jordão. O Espírito Santo desce sobre Ele como pomba "
                    'e ouve-se a voz do Pai: "Este é o meu Filho amado, em quem me comprazo." (Mt 3,13-17)'
                ),
                "fruto": "Abertura ao Espírito Santo",
            },
            {
                "titulo": "2º Mistério Luminoso",
                "subtitulo": "A Auto-revelação de Jesus nas Bodas de Caná",
                "meditacao": (
                    "No festim de casamento em Caná, a pedido de Maria, Jesus transforma a água em vinho. "
                    "É o primeiro milagre público de Jesus. (Jo 2,1-12)"
                ),
                "fruto": "Intercessão de Maria",
            },
            {
                "titulo": "3º Mistério Luminoso",
                "subtitulo": "A Proclamação do Reino de Deus",
                "meditacao": (
                    "Jesus proclama o Reino de Deus e chama todos à conversão: "
                    '"O tempo está cumprido e o Reino de Deus está próximo; convertei-vos e crede no Evangelho." (Mc 1,15)'
                ),
                "fruto": "Conversão",
            },
            {
                "titulo": "4º Mistério Luminoso",
                "subtitulo": "A Transfiguração de Jesus",
                "meditacao": (
                    "No Monte Tabor, Jesus se transfigura diante de Pedro, Tiago e João. "
                    "Seu rosto brilha como o sol e Suas vestes ficam brancas como a luz. (Mt 17,1-9)"
                ),
                "fruto": "Desejo de santidade",
            },
            {
                "titulo": "5º Mistério Luminoso",
                "subtitulo": "A Instituição da Eucaristia",
                "meditacao": (
                    'Na última Ceia, Jesus institui a Eucaristia: "Tomai e comei: isto é o Meu Corpo. '
                    'Tomai e bebei: este é o cálice do Meu Sangue." (Mt 26,26-28)'
                ),
                "fruto": "Adoração",
            },
        ],
    },
}

# Mapa dia da semana (0=seg … 6=dom) → chave de mistério
_DIA_PARA_MISTERIO = {
    0: "gozosos",    # Segunda
    1: "dolorosos",  # Terça
    2: "gloriosos",  # Quarta
    3: "luminosos",  # Quinta
    4: "dolorosos",  # Sexta
    5: "gozosos",    # Sábado
    6: "gloriosos",  # Domingo
}

# ---------------------------------------------------------------------------
# Textos das orações
# ---------------------------------------------------------------------------

ORACOES = {
    "sinal_da_cruz": {
        "nome": "Sinal da Cruz",
        "texto": (
            "Pelo sinal da Santa Cruz,\nlivrai-nos, Deus nosso Senhor,\ndos nossos inimigos.\n\n"
            "Em nome do Pai,\ne do Filho,\ne do Espírito Santo.\n\nAmém."
        ),
    },
    "credo": {
        "nome": "Creio em Deus Pai",
        "texto": (
            "Creio em Deus Pai todo-poderoso,\nCriador do céu e da terra.\n"
            "E em Jesus Cristo,\nSeu único Filho, Nosso Senhor,\n"
            "que foi concebido pelo poder do Espírito Santo,\nnasceu da Virgem Maria,\n"
            "padeceu sob Pôncio Pilatos,\nfoi crucificado, morto e sepultado,\n"
            "desceu à mansão dos mortos,\nressuscitou ao terceiro dia,\nsubiu aos céus,\n"
            "está sentado à direita de Deus Pai todo-poderoso,\n"
            "d'onde há de vir a julgar os vivos e os mortos.\n\n"
            "Creio no Espírito Santo,\nna Santa Igreja Católica,\nna comunhão dos santos,\n"
            "na remissão dos pecados,\nna ressurreição da carne,\nna vida eterna.\n\nAmém."
        ),
    },
    "pai_nosso": {
        "nome": "Pai Nosso",
        "texto": (
            "Pai nosso que estais no céu,\nsantificado seja o Vosso nome,\n"
            "venha a nós o Vosso reino,\nseja feita a Vossa vontade,\nassim na terra como no céu.\n\n"
            "O pão nosso de cada dia nos dai hoje,\nperdoai-nos as nossas ofensas,\n"
            "assim como nós perdoamos\na quem nos tem ofendido,\n"
            "e não nos deixeis cair em tentação,\nmas livrai-nos do mal.\n\nAmém."
        ),
    },
    "ave_maria": {
        "nome": "Ave Maria",
        "texto": (
            "Ave Maria, cheia de graça,\no Senhor é convosco,\n"
            "bendita sois vós entre as mulheres,\ne bendito é o fruto do vosso ventre, Jesus.\n\n"
            "Santa Maria, Mãe de Deus,\nrogai por nós pecadores,\n"
            "agora e na hora da nossa morte.\n\nAmém."
        ),
    },
    "gloria": {
        "nome": "Glória ao Pai",
        "texto": (
            "Glória ao Pai,\ne ao Filho,\ne ao Espírito Santo.\n\n"
            "Como era no princípio,\nagora e sempre,\npor todos os séculos dos séculos.\n\nAmém."
        ),
    },
    "fatima": {
        "nome": "Oração de Fátima",
        "texto": (
            "Ó meu Jesus,\nperdoai-nos os nossos pecados,\nlivrai-nos do fogo do inferno,\n"
            "levai as alminhas todas para o céu,\nespecialmente as que mais precisarem\n"
            "da Vossa misericórdia.\n\nAmém."
        ),
    },
    "salve_rainha": {
        "nome": "Salve Rainha",
        "texto": (
            "Salve, Rainha, Mãe de misericórdia,\nvida, doçura e esperança nossa, salve!\n"
            "A Vós bradamos, os degredados filhos de Eva.\n"
            "A Vós suspiramos, gemendo e chorando\nneste vale de lágrimas.\n\n"
            "Eia pois, advogada nossa,\nessas Vossas misericordiosas vistas a nós voltai.\n"
            "E depois deste desterro,\nmostrai-nos Jesus, bendito fruto do Vosso ventre,\n"
            "ó clemente, ó piedosa,\nó doce sempre Virgem Maria.\n\n"
            "Rogai por nós, Santa Mãe de Deus,\npara que sejamos dignos das promessas de Cristo.\n\nAmém."
        ),
    },
    "oracao_final": {
        "nome": "Oração Final",
        "texto": (
            "Ó Deus, cuja Unigênito Filho,\ncom a Sua vida, morte e Ressurreição,\n"
            "nos conquistou o prêmio da salvação eterna,\nconcedei-nos, pedimos-Vos,\n"
            "que meditando estes mistérios\ndo Santíssimo Rosário da Virgem Maria,\n"
            "imitemos o que eles encerram\ne alcancemos o que prometem.\n\n"
            "Pelo mesmo Cristo Nosso Senhor.\n\nAmém."
        ),
    },
    "agradecimento": {
        "nome": "Agradecimento",
        "texto": (
            "Graças Te damos, Senhor Deus nosso,\npor todos os Vossos benefícios,\n"
            "a Vós que viveis e reinais por todos os séculos dos séculos.\n\nAmém.\n\n"
            "O divino auxílio permaneça sempre conosco.\n\nAmém.\n\n"
            "E as almas dos fiéis defuntos,\npela misericórdia de Deus,\ndescansem em paz.\n\nAmém."
        ),
    },
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _misterio_do_dia():
    """Retorna a chave do grupo de mistérios de acordo com o dia atual."""
    dia_semana = datetime.now().weekday()  # 0=seg … 6=dom
    return _DIA_PARA_MISTERIO[dia_semana]


def _nome_dia():
    nomes = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira",
             "Sexta-feira", "Sábado", "Domingo"]
    return nomes[datetime.now().weekday()]

# ---------------------------------------------------------------------------
# Rotas
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    """Serve o frontend."""
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/api/saude")
def saude():
    """Health check."""
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})


@app.route("/api/liturgia")
def liturgia():
    """Retorna os mistérios do dia atual e informações de contexto."""
    chave = _misterio_do_dia()
    return jsonify({
        "success": True,
        "data": {
            "dia": _nome_dia(),
            "chave_misterio": chave,
            "misterios": MISTERIOS[chave],
            "origem": "api",
        },
    })


@app.route("/api/misterios/<tipo>")
def misterios_por_tipo(tipo):
    """Retorna um grupo específico de mistérios pelo tipo."""
    if tipo not in MISTERIOS:
        return jsonify({
            "success": False,
            "erro": f"Tipo '{tipo}' inválido. Use: gozosos, dolorosos, gloriosos, luminosos.",
        }), 404

    return jsonify({
        "success": True,
        "data": MISTERIOS[tipo],
    })


@app.route("/api/oracoes")
def oracoes():
    """Retorna todos os textos das orações."""
    return jsonify({
        "success": True,
        "data": ORACOES,
    })


@app.route("/api/oracoes/<nome>")
def oracao_por_nome(nome):
    """Retorna o texto de uma oração específica pelo slug."""
    if nome not in ORACOES:
        disponiveis = list(ORACOES.keys())
        return jsonify({
            "success": False,
            "erro": f"Oração '{nome}' não encontrada.",
            "disponiveis": disponiveis,
        }), 404

    return jsonify({
        "success": True,
        "data": ORACOES[nome],
    })


# ---------------------------------------------------------------------------
# Liturgia do Dia (proxy para API externa)
# ---------------------------------------------------------------------------

@app.route("/api/liturgia-dia")
def liturgia_dia():
    """
    Busca as leituras litúrgicas do dia na API pública brasileira.
    Retorna os dados formatados para o frontend.
    """
    hoje = datetime.now()

    try:
        import requests as req
        # API pública de liturgia diária em português brasileiro
        url = "https://liturgia.up.railway.app/"
        resp = req.get(url, timeout=7)
        resp.raise_for_status()
        dados = resp.json()

        # Garante que a data está no retorno
        if "data" not in dados:
            dados["data"] = hoje.strftime("%d/%m/%Y")
        if "dia" not in dados and "liturgia" not in dados:
            dados["dia"] = _nome_dia()

        return jsonify({
            "success": True,
            "origem": "api-externa",
            "data": dados,
        })

    except ImportError:
        # requests não instalado
        return jsonify({
            "success": False,
            "erro": "Instale o pacote 'requests': pip install requests",
            "data": {"data": hoje.strftime("%d/%m/%Y"), "dia": _nome_dia()},
        }), 503

    except Exception as exc:
        return jsonify({
            "success": False,
            "erro": f"API de liturgia indisponível: {str(exc)}",
            "data": {"data": hoje.strftime("%d/%m/%Y"), "dia": _nome_dia()},
        }), 503


# ---------------------------------------------------------------------------
# Entrada
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

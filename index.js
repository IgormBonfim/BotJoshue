const Discord = require("discord.js"),
google = require("googleapis"),
configs = require("./config.json"),
ytdl = require("ytdl-core"),
Client = new Discord.Client(),
prefixo = configs.prefixo,

youtube = new google.youtube_v3.Youtube({
    version: "v3",
    auth: configs.chave_google
}),

servidores = {
    "server": {
        connection: null,
        dispatcher: null,
        fila: [],
        tocando: false,
        joshuavoltou: true,
        contadorligado: false
    }
}


Client.on("message", async (msg) => {

    // filtro

    if (!msg.guild) return;
    if (!msg.content.startsWith(prefixo)) return;

    // commandos
        
    if (msg.content.startsWith(prefixo + "joshua")) {
        let msgtxt = msg.content.slice(8)
        let numerotxt = msgtxt.split(" ")
        let numero = Number(numerotxt[0])

        if (msgtxt.length === 0 || numero/numero != 1){
            msg.channel.send("Valor invalido, não foi possível iniciar o contador")
        } else if (servidores.server.contadorligado === false) {
            let tempo = numero*60000;
            let atraso = 0;
            msg.reply(`Iniciando contagem de ${msgtxt}`);
            servidores.server.contadorligado = true;
            servidores.server.joshuavoltou = false;
            TempoMsg();
            console.log(`Começando contagem de ${tempo}`)
    
            function TempoMsg() {
                setTimeout(function() {
                    if (servidores.server.joshuavoltou === false) {
                        msg.channel.send(`Passaram-se ${msgtxt}, será que o Joshua irá se atrasar? (novamente)`);
                        Atrasador();
                    } else {
                        msg.channel.send(`Joshua voltou dentro do prazo estipulado de ${msgtxt}`)
                    }
                }, tempo)}
    
    
            const Atrasador = () => {
                if (servidores.server.joshuavoltou === false) {
                    console.log("Contador de atraso iniciado.")
                    tempoAtraso()
                    function tempoAtraso() {
                        setTimeout(function() {
                            if (servidores.server.joshuavoltou === false) {
                                atraso += 10
                                console.log("Tempo de atraso atual:" + atraso)
                                msg.channel.send(`Joshua está ${atraso} minutos atrasado`)
                                Atrasador()}
                        }, 600000)
                    }
                }
            } 
        } else {
            msg.channel.send(`O contador de atraso já está em funcionamento`)
        }

    }

    if (msg.content === prefixo + "voltou") {
        msg.reply("Joshua voltou? Finalmente")
        console.log("Contador encerrado")
        servidores.server.joshuavoltou = true;
        servidores.server.contadorligado = false;
    }

    if (msg.content === prefixo + "entrar") { //+entrar
        if (msg.member.voice.channel) {
            try {
                servidores.server.connection = await msg.member.voice.channel.join()
            }
            catch (err) {
                console.log("Erro ao entrar no canal de voz")
                console.log(err)

            }
        } else {
            msg.reply("Você precisa estar em um canal de voz para utilizar esse comando")
        }
    }
    if (msg.content.startsWith(prefixo + "p ")) { //+p <link>
        let musica = msg.content.slice(3);

        if (musica.length === 0) {
            msg.channel.send("É necessario de algo para tocar!");
            return;
        }

        if (servidores.server.connection === null) {
            if (msg.member.voice.channel) {
                try {
                    servidores.server.connection = await msg.member.voice.channel.join()
                }
                catch (err) {
                    console.log("Erro ao entrar no canal de voz")
                    console.log(err)
    
                }
            } 
            
        }

        if (ytdl.validateURL(musica)) {
            //Pegando as informações do video (Titulo e canal)
            youtube.search.list({
                q: musica,
                part: "snippet",
                fields: "items(snippet(title, channelTitle))",
                type: "video"
            }, function (err, resultado) {
                if (err) {
                    console.log(err)
                }
                if (resultado) {
                    const MusicaInfo = {
                        "titulo": resultado.data.items[0].snippet.title,
                        "canal": resultado.data.items[0].snippet.channelTitle,
                        "link": musica
                    }
                    servidores.server.fila.push(MusicaInfo)
                    console.log(servidores.server.fila)

                    const embed = new Discord.MessageEmbed()
                    .setColor([51,209,255])
                    .setDescription(`Música adicionada a fila:`)
                    .addField(
                        MusicaInfo.titulo,
                        MusicaInfo.canal
                    )

                    msg.channel.send(embed)
                    tocador()
                }
            });
        } else { //pegando as informações do video (titulo, canal e id)
            youtube.search.list({
                q: musica,
                part: "snippet",
                fields: "items(id(videoId),snippet(title, channelTitle))",
                type: "video"
            }, function (err, resultado) {
                if (err) {
                    console.log(err)
                }
                if (resultado) {
                    const MusicaInfo = {
                        "titulo": resultado.data.items[0].snippet.title,
                        "canal": resultado.data.items[0].snippet.channelTitle,
                        "link": "https://www.youtube.com/watch?v=" + resultado.data.items[0].id.videoId
                    }
                    servidores.server.fila.push(MusicaInfo)
                    console.log(servidores.server.fila)

                    const embed = new Discord.MessageEmbed()
                    .setColor([51,209,255])
                    .setDescription(`Música adicionada a fila:`)
                    .addField(
                        MusicaInfo.titulo,
                        MusicaInfo.canal
                    )

                    msg.channel.send(embed)
                    tocador()
                }
            });
        } 
    }

    if (msg.content === prefixo + "pausar") { // +pause
        servidores.server.dispatcher.pause()
        msg.channel.send(new Discord.MessageEmbed()
        .setColor([51,209,255])
        .setDescription("Música pausada :pause_button:")
        .addField(
            servidores.server.fila[0].titulo,
            servidores.server.fila[0].canal
        ))
    }
    if (msg.content === prefixo + "continuar") { // +continuar
        servidores.server.dispatcher.resume()
        msg.channel.send(new Discord.MessageEmbed()
        .setColor([51,209,255])
        .setDescription("Música pausada :arrow_forward:")
        .addField(
            servidores.server.fila[0].titulo,
            servidores.server.fila[0].canal
        ))
    }
    if (msg.content === prefixo + "sair") {
        parando()
        servidores.server.connection = null;
        servidores.server.dispatcher = null;
        servidores.server.tocando = false;
        msg.member.voice.channel.leave()
    }
    if (msg.content === prefixo + "proxima") {
        servidores.server.fila.shift()
        servidores.server.tocando = false
        console.log("comando de proximo utilizado")
        tocador()
    }
    if (msg.content === prefixo + "parar") { //+parar
        parando()
        msg.channel.send(new Discord.MessageEmbed()
        .setColor([51,209,255])
        .setDescription("Fila de músicas limpa :stop_button:"))
    }
    if (msg.content === prefixo + "fila") {
        if (servidores.server.fila.length > 0) {
            const embedFila = new Discord.MessageEmbed()
            .setColor([51,209,255])
            .setDescription("Músicas na fila:")
    
            for (let i in servidores.server.fila) {
                embedFila.addField(
                    `${Number(i) + 1}: ${servidores.server.fila[i].titulo}`,
                    servidores.server.fila[i].canal
                )
            }
            msg.channel.send(embedFila)
        }else {
            msg.channel.send(new Discord.MessageEmbed()
            .setColor([51,209,255])
            .setAuthor("Joshue")
            .setDescription(`Nenhuma música adicionada a fila, use ${prefixo}p <música> para adicionar a fila.`)
            )
        }
    }
    if (msg.content.startsWith(prefixo + "remover ")) {
        let remover = Number(msg.content.slice(9)) - 1;
        const embedRemovida = new Discord.MessageEmbed()
        .setColor([51,209,255])
        .setAuthor("JoshueBot")
        .setTitle("Música removida da fila:")
        .addField(
            servidores.server.fila[remover].titulo,
            servidores.server.fila[remover].canal
        )
        msg.channel.send(embedRemovida)
        delete servidores.server.fila[remover]
    }
});

// Função que toca as musicas na fila
const tocador = () => {
    console.log("Tocador Iniciado");
    if (servidores.server.tocando === false) {
        const lista = servidores.server.fila[0].link;
        servidores.server.tocando = true;
        servidores.server.dispatcher = servidores.server.connection.play(ytdl(lista, {filter:"audioonly"}));

        servidores.server.dispatcher.on("finish", () => {
            servidores.server.fila.shift()
            servidores.server.tocando = false;
            if (servidores.server.fila.length > 0) {
                console.log("Musica encerrada, proxima musica:" + servidores.server.fila[0].titulo)
                tocador()
            }
            else {
                servidores.server.dispatcher = null;
            }
    
        });
    }
}

const parando = () => {
    console.log("Comando Parando utilizado ")
    while (servidores.server.fila.length > 0) {
        servidores.server.fila.shift()
    } 
    servidores.server.tocando = false;
    servidores.server.dispatcher = servidores.server.connection.play(ytdl(servidores.server.fila[0], {filtar: "audioonly"}));
    servidores.server.dispatcher = null
}

Client.login(configs.token_discord)

Client.on("ready", () =>{
    console.log("JoshueBot está online")
} )
const Discord = require("discord.js"),
google = require("googleapis"),
configs = require("./config.json"),
ytdl = require("ytdl-core"),
Client = new Discord.Client(),
prefixo = configs.prefixo,

youtube = new google.youtube_v3.Youtube({
    version: "v3",
    auth: configs.chave_google
});

servidores = {
    "server": {
        connection: null,
        dispatcher: null,
        fila: [],
        tocando: false,
        joshuavoltou: true
    }
}


Client.on("message", async (msg) => {

    // filtro

    if (!msg.guild) return;
    if (!msg.content.startsWith(prefixo)) return;

    // commandos
    if (msg.content.startsWith(prefixo + "joshua")) {
        let msgtxt = msg.content.slice(8)
        msg.reply(`Iniciando contagem de ${msgtxt}`);
        let numerotxt = msgtxt.split(" ")
        let tempo = Number(numerotxt[0])*60000;
        let atraso = 0;
        console.log(tempo);
        TempoMsg();

        function TempoMsg() {
            setTimeout(function() {
                msg.channel.send(`Passaram-se ${msgtxt}, Joshua se atrasou (novamente)`);
                servidores.server.joshuavoltou = false;
                Atrasador();
            }, tempo)}


        const Atrasador = () => {
            if (servidores.server.joshuavoltou === false) {
                console.log("Contador de atraso iniciado.")
                tempoAtraso()
                function tempoAtraso() {
                    setTimeout(function() {
                        atraso += 10
                        console.log("Tempo de atraso atual:" + atraso)
                        msg.channel.send(`Joshua está ${atraso} minutos atrasado`)
                        Atrasador()
                    }, 600000)}}} 
    }

    if (msg.content === prefixo + "joshua voltou") {
        msg.reply("Finalmente")
        servidores.server.joshuavoltou = true;
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
            servidores.server.fila.push(musica)
            console.log("Música adicionada a fila:" + musica)
            tocador()
        } else {
            youtube.search.list({
                q: musica,
                part: "snippet",
                fields: "items(id(videoId),snippet(title))",
                type: "video"
            }, function (err, resultado) {
                if (err) {
                    console.log(err)
                }
                if (resultado) {
                    const nomepesquisa = resultado.data.items[0].snippet.title;
                    const id = resultado.data.items[0].id.videoId;
                    const musica = "https://www.youtube.com/watch?v=" + id;
                    servidores.server.fila.push(musica);
                    console.log("Música adicionada a fila:" + musica);
                    msg.channel.send("**Música adiconada a fila:** " + nomepesquisa)
                    tocador()
                }
            });
        } 
    }

    if (msg.content === prefixo + "pause") { // +pause
        servidores.server.dispatcher.pause()
        msg.channel.send("**Música pausada** :pause_button:")
    }
    if (msg.content === prefixo + "resume") { // +resume
        servidores.server.dispatcher.resume()
        msg.channel.send("**Música retomada** :arrow_forward:")
    }
    if (msg.content === prefixo + "sair") {
        msg.member.voice.channel.leave()
        servidores.server.connection = null;
        servidores.server.dispatcher = null;
        servidores.server.tocando = false;
        parando()
    }
    if (msg.content === prefixo + "proxima") {
        servidores.server.fila.shift()
        servidores.server.tocando = false
        tocador()
        console.log("comando de proximo utilizado")
    }
    if (msg.content === prefixo + "parar") { //+parar
        const parando = () => {
            console.log("Comando Parando utilizado ")
            while (servidores.server.fila.length > 0) {
                servidores.server.fila.shift()
            } servidores.server.tocando = false;
            parador()
        parando()
        }
    }
});


const tocador = () => {
    console.log("Tocador Iniciado");
    if (servidores.server.tocando === false) {
        const lista = servidores.server.fila[0];
        servidores.server.tocando = true;
        servidores.server.dispatcher = servidores.server.connection.play(ytdl(lista, {filter:"audioonly"}));

        servidores.server.dispatcher.on("finish", () => {
            servidores.server.fila.shift()
            console.log("Musica encerrada, proxima musica:" + servidores.server.fila[0])
            servidores.server.tocando = false;
            if (servidores.server.fila.length > 0) {
                tocador()
            }
            else {
                servidores.server.dispatcher = null;
            }
    
        });
    }
}

const parador = () => {
    console.log("Parador Iniciado");
    if (servidores.server.tocando === false) {
        const lista = servidores.server.fila[0];
        servidores.server.tocando = false;
        servidores.server.dispatcher = servidores.server.connection.play(ytdl(lista, {filter:"audioonly"}));

        servidores.server.dispatcher.on("finish", () => {
            servidores.server.fila.shift()
            console.log("Musica encerrada, proxima musica:" + servidores.server.fila[0])
            servidores.server.tocando = false;
            if (servidores.server.fila.length > 0) {
                parador()
            }
            else {
                servidores.server.dispatcher = null;
            }
    
        });
    }
}

Client.login(configs.token_discord)

Client.on("ready", () =>{
    console.log("JoshueBot está online")
} )
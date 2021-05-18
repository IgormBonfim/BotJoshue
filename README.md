![BotJoshue 2](https://user-images.githubusercontent.com/83429569/118735523-00ac9100-b817-11eb-8fb6-154282d2c22b.png)

> Status: Em Desenvolvimento ⚠️

<h2>Bot para Discord desenvolvido com proposito de colocar em prática os aprendizados em JavaScript/Node.js</h2>

<h3>Como surgiu a ideia?</h3> 
A ideia surgiu em uma brincadeira, sempre que um de nossos amigos dizia que voltaria em 10 minutos ficamos tentando acertar quanto tempo ele se atrasaria.
Por conta disso, surgiu a ideia de fazer um bot para o Discord que contasse quanto tempo ele iria demorar.

<h3>Tecnologias utilizadas</h3>

+ JavaScript
+ Node.js
+ Discord.js
+ Google API

<h3>O que ele pode fazer?</h3>

+ Contar um intervalo de tempo.
+ Conta quanto tempo de atraso após o intervalo de tempo.
+ Tocar músicas do youtube pela URL inserida.
+ Tocar músicas do youtube por via de pesquisa.
+ Pausar a música.
+ Continuar a música.
+ Criar uma fila de músicas para serem tocadas assim que acabar a que estiver tocando.

<h3>Como utilizar?</h3>

1) Primeiro deve ser instalada as dependencias do bot, no terminal, dentro da pasta, utilize npm install.
2) Deverá ser criado um arquivo config.json, nele será adicionado o token do discord, a chave do google, e o prefixo (qualquer um a escolha), assim como na imagem abaixo:
 
![image](https://user-images.githubusercontent.com/83429569/118722195-427f0c80-b802-11eb-982c-58c2ddb35939.png)

3) O bot deverá ser adicionado ao servidor.
4) Ao executar o index.js o bot já estará online e funcionando.

<h3>Comandos</h3>

+ Prefixo + entrar (Comando para o bot entrar no canal de voz)
+ Prefixo + p <link> (Comando para o bot tocar música pelo link do youtube)
+ Prefixo + p <nome> (Comando para o bot tocar música pela busca do google, tocará o primeiro vídeo encontrado no youtube)
+ Prefixo + pause (Comando para o bot pausar a música)
+ Prefixo + continuar (Comando para o bot continuar a tocar a música, deve ser utilizado após o pause)
+ Prefixo + proxima (Comando para o bot ir para a proxima música da fila)
+ Prefixo + parar (Comando para o bot parar de tocar música e limpar a fila de músicas)
+ Prefixo + sair (Comando para o bot sair do canal de voz)
+ Prefixo + joshua <tempo> minutos (Comando para inicar a contagem do valor do tempo, sempre contará em minutos)
+ Prefixo + voltou (Comando para parar a contagem de atraso)
  
> O prefixo deve ser o utilizado na pasta config.json.

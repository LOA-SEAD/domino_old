
define([],
    function () {

        var tiles,
        playerTiles,
        selectedTile, 
        right = {name: 'direita', value: null, place: 4},
        left = {name: 'esquerda', value: null, place: 4};

        /*
        * Inicializem o draggable/dropable.
        * Vou chamar esse método quando a sala for aberta, ou seja, quando os elementos referentes às pedras estiverem inseridos no documento. 
        */
        var setup = function () {
            tiles = $('.tile');
            if(tiles.length == 7)
            {
                tiles
                .draggable({
                    revert: true,
                    cursorAt: {top: 35, left: 17},
                    start: function() {
                        if(selectedTile == null)
                        {
                            //mostrarLugaresPossiveis(this);
                            selectedTile = this;
                        }   
                    },
                    stop: function() {
                        if(selectedTile != null)
                        {       
                            selectedTile = null;                     
                            //esconderLugaresPossiveis();
                        }
                    },
                })
            }
            else
            {
                 throw new Error("Player started with a different number of tiles");
            }
        },

        /*
        * Destruam o draggable/dropable.
        * Vou chamar esse método antes de fechar a sala (quando o jogo acabar).
        */
        shutdown = function () {
            $('.playerTile').draggable({
                disable: true,
            })
        },

        /*
        * Habilitem o draggable.
        * Será necessário quando o jogador estiver em sua vez de jogar.
        */
        enableDragging = function () {
            $('.playerTile')
            .draggable({
                revert: true,
                disable: false,
            })
        },

        /*
        * Desabilitem o draggable.
        * Será necessário após o jogador completar a jogada. 
        */
        disableDragging = function () {
            $('.playerTile')
            .draggable({
                revert: false,
                disable: true,
            })
        },

        /*
        * Coloquem a pedra no "tabuleiro" a partir dos parâmetros.
        * Os argumentos são os seguintes:
        * tile: string representando a pedra.
        * position: string ("left" ou "right") indicando se a pedra será colocada no início/fim do tabuleiro.
        * shouldRotate: boolean (true ou false) indicando se a pedra deve ser rotacionada. 
        */
        placeOnTable = function (tile, position, shouldRotate) {
            /*
            * Verificar como Alan fará a parte de verificação no servidor
            */
            if(position == 'right')
            {

            }
            else
            {
                if(position == 'left')
                {

                }
                else
                {
                    /* Deu erro */
                }
            }
        },

        /*
        * Esse método deve chamar o parâmetro callback (uma function) quando o jogador terminar sua jogada (acredito que no evento dropstop, mas vocês vêem como será melhor).
        * Chamem o callback passando como parâmetros tile, position e shouldRotate (o mesmo que os parâmetros do método anterior).
        * Esse método será utilizado para enviar as informações da jogada ao servidor.
        */
        onPlayCompleted = function (callback) {
            
        };

        return {
            setup: setup,
            shutdown: shutdown,
            enableDragging: enableDragging,
            disableDragging: disableDragging,
            placeOnTable: placeOnTable,
            onPlayCompleted: onPlayCompleted
        };

    });

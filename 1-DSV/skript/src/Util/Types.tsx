namespace Skript.Util {

    /**
     * Opções para move um elemento.
     */
    export enum BringTo {

        /**
         * Enviar para o fim do DOM e para cima dos outros elementos.
         */
        Front,

        /**
         * Enviar para o início do DOM e para baixo dos outros elementos.
         */
        Back
    }

    /**
     * Propriedades dos botões em uma mensagem de diálogo ao usuário.
     */
    export type DialogProps = {

        /**
         * Texto de exibição
         * @type {string}
         */
        text: string,

        /**
         * Título
         * @type {string}
         */
        title?: string,
        
        /**
         * Botões.
         * @type {DialogButton[]}
         */
        buttons?: DialogButton[],

        /**
         * Sinalizador.
         * @type {DialogFlag}
         */
        flag?: DialogFlag,

        /**
         * Sinaliza que deve receber um valor de entrada do usuário.
         * @type {boolean}
         */
        input?: boolean,

        /**
         * Valor inicial para entrada de dados do usuário.
         * @type {string}
         */
        inputDefault?: string,

        /**
         * Função para validar entrada de dados.
         * @type {(value: string) => boolean}
         */
        inputValidade?: (value: string) => boolean
    }
    

    /**
     * Propriedades dos botões em uma mensagem de diálogo ao usuário.
     */
    export type DialogResult = {
        
        /**
         * Botão acionado.
         * @type {DialogButton}
         */
        button: DialogButton,

        /**
         * Valor de entrada.
         * @type {string}
         */
        input: string
    }

    /**
     * Propriedades dos botões em uma mensagem de diálogo ao usuário.
     */
    export type DialogButton<T = any> = {
        
        /**
         * Ícone no formato Font Awesome.
         * @type {string}
         */
        icon?: string,
        
        /**
         * Nome
         * @type {string}
         */
        name?: string,

        /**
         * Classe CSS
         * @type {string}
         */
        className?: string,

        /**
         * Indica se o botão deve receber foco.
         * @type {boolean}
         */
        focus?: boolean,

        /**
         * Indica o botão padrão para a tecla ESC.
         * @type {boolean}
         */
        escape?: boolean,

        /**
         * Qualquer dado associado.
         * @type {T}
         */
        data?: T
    }

    /**
     * Sinalizadores para a mensagem de diálogo ao usuário
     */
    export enum DialogFlag {

        /**
         * Pergunta
         */
        Question,

        /**
         * Informativo.
         */
        Information,

        /**
         * Alerta.
         */
        Warning,

        /**
         * Erro.
         */
        Error
    }
}
namespace Skript.Business.Layout.Components.Toast {

    /**
     * Mensagem toast.
     */
    export type Message = {

        /**
         * Mensagem.
         * @type {string}
         */
        text: string,

        /**
         * Nível.
         * @type {Framework.Log.Level}
         */
        level: Framework.Log.Level, 

        /**
         * Data e hora.
         * @type {Date}
         */
        time: Date,

        /**
         * Flag para indicar que foi marcada para remoção da lista.
         * @type {boolean}
         */
        removed: boolean
    } 
}

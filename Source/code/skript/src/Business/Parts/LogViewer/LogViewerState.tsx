namespace Skript.Business.Parts.LogViewer {

    /**
     * State do componente.
     */
    export type LogViewerState = {

        /**
         * Mensagens de log.
         * @type {Framework.Log.Message[]}
         */
        messages: Framework.Log.Message[],
    }
}
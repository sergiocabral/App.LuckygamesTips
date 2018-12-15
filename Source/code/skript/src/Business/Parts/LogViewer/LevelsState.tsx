namespace Skript.Business.Parts.LogViewer {

    /**
     * State do componente.
     */
    export type LevelsState = {

        /**
         * Lista de níveis de log.
         */
        levels: Framework.Types.IndexValue<string, boolean>,
    }
}
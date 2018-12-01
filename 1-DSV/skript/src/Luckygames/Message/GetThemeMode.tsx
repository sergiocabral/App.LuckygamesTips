namespace Skript.Luckygames.Message {

    /**
     * Retorna o modo do tema da luckygames.io.
     */
    export class GetThemeMode extends Core.Bus.Message {

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Estado atual
             * @type {ThemeMode}
             */
            mode: ThemeMode 
        }
    }
}
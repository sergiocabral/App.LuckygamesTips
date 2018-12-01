namespace Skript.Luckygames.Message {

    /**
     * Define o modo do tema da luckygames.io.
     */
    export class SetThemeMode extends Core.Bus.Message {

        /**
         * Construtor.
         * @param {ThemeMode} mode Modo.
         */
        public constructor(mode: ThemeMode) {
            super();
            this.mode = mode;
        }

        /**
         * Modo.
         * @type {ThemeMode}
         */
        public mode: ThemeMode; 

        /**
         * Resultados.
         */
        public result?: { 
            
            /**
             * Estado definido
             * @type {ThemeMode}
             */
            mode: ThemeMode 
        }
    }
}
namespace Skript.Business.Luckygames.Messages {

    /**
     * Definido modo do tema
     */
    export class DidThemeSetted extends Framework.Bus.Message {
        
        /**
         * Constructor.
         * @param {ThemeMode} mode Modo
         */
        public constructor(public mode: ThemeMode) { 
            super();
        }
    }
}
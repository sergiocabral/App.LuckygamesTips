namespace Skript.Business.Luckygames.Messages {

    /**
     * Definir modo do tema
     */
    export class DoSetTheme extends Framework.Bus.Message {
        
        /**
         * Constructor.
         * @param {ThemeMode} mode Modo
         */
        public constructor(public mode: ThemeMode) { 
            super();
        }
    }
}
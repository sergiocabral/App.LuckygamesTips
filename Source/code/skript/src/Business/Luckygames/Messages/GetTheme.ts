namespace Skript.Business.Luckygames.Messages {

    /**
     * Retorna o valor definido para tema.
     */
    export class GetTheme extends Framework.Bus.Message {
        
        /**
         * Modo.
         * @type {ThemeMode}
         */
        public mode?: ThemeMode;
    }
}
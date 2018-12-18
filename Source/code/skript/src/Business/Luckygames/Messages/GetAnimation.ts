namespace Skript.Business.Luckygames.Messages {

    /**
     * Retorna o valor definido para animation.
     */
    export class GetAnimation extends Framework.Bus.Message {
        
        /**
         * Modo.
         * @type {Framework.Types.OffOn}
         */
        public mode?: Framework.Types.OffOn;
    }
}
namespace Skript.Business.Luckygames.Messages {

    /**
     * Definido modo de animação.
     */
    export class DidAnimationSetted extends Framework.Bus.Message {
        
        /**
         * Constructor.
         * @param {Framework.Types.OffOn} mode Modo
         */
        public constructor(public mode: Framework.Types.OffOn) { 
            super();
        }
    }
}
namespace Skript.Business.Luckygames.Messages {

    /**
     * Definir modo de animação.
     */
    export class DoSetAnimation extends Framework.Bus.Message {
        
        /**
         * Constructor.
         * @param {Framework.Types.OffOn} mode Modo
         */
        public constructor(public mode: Framework.Types.OffOn) { 
            super();
        }
    }
}
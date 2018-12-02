namespace Skript.Core.Message {

    /**
     * Tecla de atalho recebida.
     */
    export class ShortcutKey extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {KeyboardEvent} evt Informações sobre o evento recebido.
         */
        public constructor(evt: KeyboardEvent) {
            super();
            this.evt = evt;
        }

        /**
         * Informações sobre o evento recebido.
         * @type {KeyboardEvent}
         */
        public evt: KeyboardEvent;
    }
}
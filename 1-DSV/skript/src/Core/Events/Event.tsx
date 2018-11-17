namespace Core.Events {

    /**
     * Classe abstrata para eventos Demand ou Happened.
     */
    export abstract class Event {
        
        /**
         * Construtor.
         * @param {Type} type Tipo do evento.
         */
        public constructor (type: Type) {
            this.type = type;
        }

        /**
         * Tipo do evento.
         * @type {Type}
         */
        public type: Type;
    }
}
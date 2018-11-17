namespace Events {

    /**
     * Classe abstrata para eventos Demand ou Happened.
     */
    export abstract class Event {

        /**
         * Instância principal do sistema que tem acesso a todas as propriedades..
         * @type {Core.Main}
         */
        public static main: Core.Main;
        
        /**
         * Construtor.
         * @param {Type} type Tipo do evento.
         */
        public constructor (type: Type) {
            this.type = type;
            this.main = Event.main;
        }

        /**
         * Tipo do evento.
         * @type {Type}
         */
        public type: Type;

        /**
         * Instância principal do sistema que tem acesso a todas as propriedades..
         * @type {Core.Main}
         */
        public main: Core.Main;

    }
}
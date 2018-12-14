namespace Skript.Data {
    
    /**
     * Pacote de informações gravadas no storage.
     */
    export abstract class Packet {

        /**
         * Idioma atual.
         * @type {string}
         */
        public abstract language?: string;

        /**
         * Lista de parâmetros
         * @type {{[name: string]: Object}}
         */
        public abstract parameters?: {[name: string]: Object};
    }

    /**
     * Pacote de informações gravadas no storage.
     */
    export class PacketDefault extends Packet {

        /**
         * Construtor.
         */
        public constructor() {
            super();
            
            switch (Luckygames.General.language().trim().toLowerCase()) {
                case "pt":
                case "br": this.language = "pt"; break;
                default:   this.language = "en";
            }
        }

        /**
         * Idioma atual.
         * @type {string}
         */
        public language: string;

        /**
         * Lista de parâmetros
         * @type {{[name: string]: Object}}
         */
        public parameters: {[name: string]: Object} = { }
    }
}
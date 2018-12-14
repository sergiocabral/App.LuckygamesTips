namespace Skript.Framework.Data {
    
    /**
     * Pacote de informações gravadas no storage.
     */
    export abstract class StoragePacket {

        /**
         * Idioma atual.
         * @type {string}
         */
        public abstract language?: string;
    }

    /**
     * Pacote de informações gravadas no storage.
     */
    export class StoragePacketDefault extends StoragePacket {

        /**
         * Idioma atual.
         * @type {string}
         */
        public language: string = "en";
    }
}
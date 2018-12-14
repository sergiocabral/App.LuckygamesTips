namespace Skript.Business.Data {
    
    /**
     * Pacote de informações gravadas no storage.
     */
    export abstract class StoragePacket extends Skript.Framework.Data.StoragePacket {

    }

    /**
     * Pacote de informações gravadas no storage.
     */
    export class StoragePacketDefault extends Skript.Framework.Data.StoragePacketDefault {

        /**
         * Idioma atual.
         * @type {string}
         */
        public language: string = "pt";

    }
}
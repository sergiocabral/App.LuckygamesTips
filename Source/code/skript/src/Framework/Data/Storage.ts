namespace Skript.Framework.Data {

    /**
     * Manipula os dados no storage do browser.
     */
    export class Storage<TStoragePacket extends StoragePacket, TStoragePacketDefault extends StoragePacketDefault>{

        /**
         * Construtor.
         * @param {string} name Nome do repositório.
         * @param {TStoragePacketDefault} defaults Instância que retorna os valores padrão para os itens no storage.
         */
        public constructor(public name: string, public defaults: TStoragePacketDefault) {
        }

        /**
         * Pacote de informações gravadas no storage.
         * @param {TStoragePacket} value Dados para gravação. Propriedade undefined retornam ao valor padrão.
         * @returns {TStoragePacketDefault} Dados gravados.
         */
        public data(value?: TStoragePacket): TStoragePacketDefault {
            const defaults = Object.assign({ }, this.defaults);
            let data;

            const dataText = localStorage.getItem(this.name);
            try {
                data = JSON.parse(dataText as string);
                if (!data) throw new Errors.InvalidData(`JSON.parse(localStorage.getItem("${this.name}"))`);
            } catch (error) {
                data = defaults;
            }

            if (value !== undefined) {
                data = Object.assign(data, value);
                
                for (const key in data) if (data[key] === undefined) delete data[key];

                localStorage.setItem(this.name, JSON.stringify(data));
            }

            for (const key in defaults) {                
                if (data[key] === undefined) data[key] = (defaults as any)[key];
            }
            
            return data;
        }
    }

}
namespace Skript.Data {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Manipula os dados no storage do browser.
     */
    export class Storage {

        /**
         * Construtor.
         * @param name Nome do repositório.
         */
        public constructor(name: string) {            
            skript.storage = skript.storage ? skript.storage : this;

            this.name = name;
        }

        /**
         * Nome do repositório.
         * @type {string}
         */
        public name: string;

        /**
         * Pacote de informações gravadas no storage.
         * @param {Packet} value Dados para gravação. Propriedade undefined retornam ao valor padrão.
         * @returns {Packet} Dados gravados.
         */
        public data(value?: Packet): Packet {
            const defaults: Packet = this.defaults();
            let data;

            const dataText = localStorage.getItem(this.name);
            try {
                data = JSON.parse(dataText as string);
                if (!data) throw new Core.Errors.InvalidData("localStorage.getItem()");
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

        /**
         * Dados padrão.
         * @returns {Packet} Dados.
         */
        private defaults(): Packet {
            return {
                language: "en"
            };
        }
    }

}
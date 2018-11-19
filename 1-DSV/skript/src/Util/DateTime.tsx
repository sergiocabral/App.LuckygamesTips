namespace Skript.Util {

    /**
     * Utilitários para manipulação de datas.
     */
    export class DateTime {
        
        /**
         * Configurações padrão de formatação de data.
         */
        public static defaultDateFormat: Locale.Format.Date = {
            mask: "d/M/y h:m:s",
            day: "day",
            days: "days"
        };

        /**
         * Formata a exibição de uma data.
         * @param {Date} value Valor.
         * @param {any} config Configurações de formatação.
         * @returns {string} Data formatada como texto.
         */
        public static format(value: Date, config: any): string {
            const configuration = Object.assign({ }, DateTime.defaultDateFormat, config) as Locale.Format.Date;
    
            if (typeof(configuration.mask) !== "string") configuration.mask = DateTime.defaultDateFormat.mask; 
            else switch (configuration.mask) {
                case "running": configuration.mask = "D h:m:s"; break;
            }
        
            const date = value.toISOString();
            const y = date.substr(0, 4);
            const M = date.substr(5, 2);
            const d = date.substr(8, 2);
            const h = date.substr(11, 2);
            const m = date.substr(14, 2);
            const s = date.substr(17, 2);
            const z = date.substr(20, 3);
            let D = 0;
            let Dstr = "";
            if (configuration.mask.indexOf("D") >= 0) {
                D = (new Date(y + "-" + M + "-" + d).getTime() - new Date("1970-01-01").getTime()) / 1000 / 60 / 60 / 24;
                if (D === 0) Dstr = "";
                else if (Math.abs(D) === 1) { Dstr = configuration.day; }
                else { Dstr = configuration.days; }
            }
            return configuration.mask
                .replaceAll("y", y)
                .replaceAll("M", M)
                .replaceAll("d", d)
                .replaceAll("h", h)
                .replaceAll("m", m)
                .replaceAll("s", s)
                .replaceAll("z", z)
                .replaceAll("D", D === 0 ? "" : D + " " + Dstr)
                .trim();
        }
    }
}
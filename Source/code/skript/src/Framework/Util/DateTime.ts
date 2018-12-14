namespace Skript.Framework.Util {

    /**
     * Utilitários para manipulação de datas.
     */
    export class DateTime {

        /**
         * Formata a exibição de uma data.
         * @param {Date} value Valor.
         * @param {DateTimeFormat} format Configurações de formatação.
         * @returns {string} Data formatada como texto.
         */
        public static format(value: Date, format?: DateTimeFormat): string {
            const formatFullFill = DateTimeFormat.get(format);

            switch (formatFullFill.mask) {
                case "running": formatFullFill.mask = "D h:m:s"; break;
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
            let labelD = "";
            if ((formatFullFill.mask as string).indexOf("D") >= 0) {
                D = (new Date(y + "-" + M + "-" + d).getTime() - new Date("1970-01-01").getTime()) / 1000 / 60 / 60 / 24;
                if (D === 0) labelD = "";
                else if (Math.abs(D) === 1) { labelD = formatFullFill.day as string; }
                else { labelD = formatFullFill.days as string; }
            }

            return (formatFullFill.mask as string)
                .replaceAll("y", y)
                .replaceAll("M", M)
                .replaceAll("d", d)
                .replaceAll("h", h)
                .replaceAll("m", m)
                .replaceAll("s", s)
                .replaceAll("z", z)
                .replaceAll("D", D === 0 ? "" : D + " " + labelD)
                .trim();
        }
    }
}
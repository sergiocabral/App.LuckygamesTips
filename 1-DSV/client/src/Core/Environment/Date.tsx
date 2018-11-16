/**
 * Interface para extender propriedades de Date.
 */
interface Date {

    /**
     * Formata a exibição de uma data.
     * @param {any} config Configurações de formatação.
     * @returns {string} Data formatada como texto.
     */
    format(config: any): string;
}

/**
 * Configurações de formatação.
 */
type DateFormat = {
    /**
     * Máscara de formatação.
     * 
     * Use para compor a máscara:
     *   D = dias corridos
     *   d = dia
     *   M = mês
     *   y = ano
     *   h = hora
     *   m = minuto
     *   s = segundo
     *   z = milissegundo
     * 
     * Nomes de máscara:
     *   running = D h:m:s
     */
    mask: string,
    day: string,
    days: string
}

const defaultDateFormat: DateFormat = {
    mask: "d/M/y h:m:s",
    day: "day",
    days: "days"
};

Date.prototype.format = function(config: any = { }): string {
    const configuration = Object.assign({ }, defaultDateFormat, config) as DateFormat;
    
    if (typeof(configuration.mask) !== "string") configuration.mask = defaultDateFormat.mask; 
    else switch (configuration.mask) {
        case "running": configuration.mask = "D h:m:s"; break;
    }

    const date = this.toISOString();
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
};

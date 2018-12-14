namespace Skript.Framework.Util {

    /**
     * Utilitários envolvendo desenho, cores, etc.
     */
    export class Drawing {

        /**
         * Extrai os valores RGB de uma cor.
         * @param {string} color Cor. Formato #FFFFFF, #FFF, rgb(255,255,255), rgba(255,255,255,1)
         * @returns {number[]} Array com três elementos para sucesso. Zero elementos para falha.
         */
        public static extractRGB(color: string): number[] {
            const rgb: number[] = [];

            if (typeof(color) === 'string') {
                if (/^rgba?\s*\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*(?=,?\s*[0-9\.]*\)$)/i.exec(color)) {
                    rgb.push(Number.parseInt(color.substring(color.indexOf('(') + 1, color.indexOf(','))));
                    rgb.push(Number.parseInt(color.substring(color.indexOf(',') + 1, color.lastIndexOf(','))));
                    rgb.push(Number.parseInt(color.substring(color.lastIndexOf(',') + 1)));
                } else if (/^#?[0-9a-f]{6}$/i.exec(color) || /^#?[0-9a-f]{3}$/i.exec(color)) {
                    color = color.replace('#', '');
                    color = color.length !== 3 ? color : color[0].repeat(2) + color[1].repeat(2) + color[2].repeat(2);
                    rgb.push(Number.parseInt(color.substr(0, 2), 16));
                    rgb.push(Number.parseInt(color.substr(2, 2), 16));
                    rgb.push(Number.parseInt(color.substr(4, 2), 16));
                }
                for (let i = 0; i < rgb.length; i++) {
                    if (Number.isNaN(rgb[i]) || rgb[i] < 0 || rgb[i] > 255 || rgb[i] !== Math.trunc(rgb[i])) {
                        rgb.length = 0;
                        break;
                    }
                }
            }

            return rgb;
        }

        /**
         * Converte cor para RGB.
         * @param {number[]} rgb Conjunto RGB. Array de três elementos.
         * @param {number} rgba Opcional. Quando informado usa como opacity da função rgba()
         * @returns {string} Formato rgb(255,255,255) ou rgba(255,255,255,1)
         */
        public static colorToRGB(rgb: number[], rgba?: number): string {
            if (!rgb || rgb.length !== 3) throw new Errors.InvalidArgument('Color RGB need 3 elements. Actual: ' + (!rgb ? 0 : rgb.length));

            let result = rgba === undefined ? 'rgb(' : 'rgba(';
            result += rgb[0] + ',' + rgb[0] + ',' + rgb[0];
            result += rgba === undefined ? ')' : ',' + rgba + ')';

            return result;
        }

        /**
         * Converte formato hexadecimal para RGB.
         * @param {string} color Cor. Formato #FFFFFF, #FFF, rgb(255,255,255), rgba(255,255,255,1)
         * @param {number} rgba Opcional. Quando informado usa como opacity da função rgba()
         * @returns {string} Formato rgb(255,255,255) ou rgba(255,255,255,1)
         */
        public static colorHexToRGB(color: string, rgba?: number): string {
            const rgb = Drawing.extractRGB(color);
            if (!rgb.length) throw new Errors.InvalidArgument('Color: ' + color);
            return Drawing.colorToRGB(rgb, rgba);
        }

        /**
         * Converte cor para hexadecimal.
         * @param {number[]} rgb Conjunto RGB. Array de três elementos.
         * @param {boolean} useHash Opcional. Sinaliza se usa # ou não.
         * @returns {string} Formato #FFFFFF
         */
        public static colorToHex(rgb: number[], useHash: boolean = true): string {
            if (!rgb || rgb.length !== 3) throw new Errors.InvalidArgument('Color RGB need 3 elements. Actual: ' + (!rgb ? 0 : rgb.length));

            const digit = (value: number): string => {
                return ("0" + value.toString(16)).substr(-2);
            }

            let result = useHash ? '#' : '';
            result += digit(rgb[0]) + digit(rgb[1]) + digit(rgb[2]);

            return result;
        }

        /**
         * Converte formato hexadecimal para RGB.
         * @param {string} color Cor. Formato #FFFFFF, #FFF, rgb(255,255,255), rgba(255,255,255,1)
         * @param {boolean} useHash Opcional. Sinaliza se usa # ou não.
         * @returns {string} Formato 255,255,255
         */
        public static colorRGBToHex(color: string, useHash: boolean = true): any {
            const rgb = Drawing.extractRGB(color);
            if (!rgb.length) throw new Errors.InvalidArgument('Color: ' + color);
            return Drawing.colorToHex(rgb, useHash);
        }

        /**
         * Verifica se uma cor é mais clara do que escura.
         * @param {string} color Cor. Formato #FFFFFF, #FFF, rgb(255,255,255), rgba(255,255,255,1)
         * @returns {boolean} Retorna true para cor clara e false para cor escura.
         */
        public static isLight(color: string): boolean {
            const rgb = Drawing.extractRGB(color);
            if (!rgb.length) throw new Errors.InvalidArgument('Color: ' + color);
            return 155 < ((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000;
        }

        /**
         * Clareia, escurece ou mistura cores.
         * @param {number} percent Percentual de 0 a 1 para intensidade.
         * @param {string} color Cor em hexadecimal # ou rgb().
         * @param {string} colorToBlend Opcional. Cor para fazer uma mistura.
         */
        public static blend(percent: number, color: string, colorToBlend: string = ''): string {
            const rgb = Drawing.extractRGB(color);
            if (!rgb.length) throw new Errors.InvalidArgument('Color: ' + color);
            const rgbBlend = Drawing.extractRGB(colorToBlend ? colorToBlend : percent < 0 ? 'rgb(0,0,0)' : 'rgb(255,255,255)');
            if (!rgbBlend.length) throw new Errors.InvalidArgument('Color: ' + colorToBlend);

            const hex = color.length <= 7;

            percent = percent < 0 ? percent * -1 : percent;

            rgb[0] = Math.round((rgbBlend[0] - rgb[0]) * percent) + rgb[0];
            rgb[1] = Math.round((rgbBlend[1] - rgb[1]) * percent) + rgb[1];
            rgb[2] = Math.round((rgbBlend[2] - rgb[2]) * percent) + rgb[2];

            return hex ? Drawing.colorToHex(rgb) : Drawing.colorToRGB(rgb);
        }
    }
}
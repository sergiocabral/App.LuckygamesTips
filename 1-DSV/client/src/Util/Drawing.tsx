namespace Util {

    /**
     * Utilitários envolvendo desenho, cores, etc.
     */
    export class Drawing {

        /**
         * Verifica se uma cor é mais clara do que escura.
         * @param {string} hexColor Cor hexadecimal.
         * @returns {boolean} Retorna true para cor clara e false para cor escura.
         */
        public static isLight(hexColor: string): boolean {
            let hex = hexColor.replace('#', '');
            hex = hex.length !== 6 ? hex : hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2);

            const c_r = parseInt(hex.substr(0, 2), 16);
            const c_g = parseInt(hex.substr(2, 2), 16);
            const c_b = parseInt(hex.substr(4, 2), 16);

            const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
            
            return brightness > 155;
        }
        
        /**
         * Clareia, escurece ou mistura cores.
         * @param {number} percent Percentual de 0 a 1 para intensidade.
         * @param {string} color Cor em hexadecimal # ou rgb().
         * @param {string} colorToBlend Opcional. Cor para fazer uma mistura.
         */
        public static blend(percent: number, color: string, colorToBlend: string = ""): string {
            const n = percent < 0 ? percent * -1 : percent
            const u = Math.round
            const w = parseInt;

            if (color.length > 7) {
                const f = color.split(",");
                const t = (colorToBlend ? colorToBlend : percent < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)").split(",");
                const R = w(f[0].slice(4));
                const G = w(f[1]);
                const B = w(f[2]);

                return "rgb(" + 
                    (u((w(t[0].slice(4)) - R) * n) + R) + "," +
                    (u((w(t[1]) - G) * n) + G) + "," +
                    (u((w(t[2]) - B) * n) + B) + ")";
            } else {
                const f = w(color.slice(1), 16);
                const t = w((colorToBlend ? colorToBlend : percent < 0 ? "#000000" : "#FFFFFF").slice(1), 16);
                const R1 = f >> 16;
                const G1 = f >> 8 & 0x00FF;
                const B1 = f & 0x0000FF;
                
                return "#" +
                    (0x1000000 + (u(((t >> 16) - R1) * n) + R1) * 
                    0x10000 + (u(((t >> 8 & 0x00FF) - G1) * n) + G1) * 
                    0x100 + (u(((t & 0x0000FF) - B1) * n) + B1))
                    .toString(16).slice(1);
            }
        }
    }
}
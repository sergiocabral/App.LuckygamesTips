/**
 * Interface para extender propriedades de Console.
 */
interface Console {

    /**
     * Registra uma mensagem de log na instância padrão. (caso tenha sido definida);
     * @param {string} message Mensagem.
     * @param {any} values Opcional. Conjunto de valores para substituição na string.
     * @param {string} origin Opcional. Orígem do log. Nome do módulo ou arquivo.
     * @param {any} toConsoleLog Opcional. Qualquer coisas para ser passado como parâmetro para console.log
     * @param {Level} level Opcional. Nível da mensagem. Padrão Verbose.
     */
    Log(text: string, values?: any, origin?: string, toConsoleLog?: any, level?: Skript.Framework.Log.Level): void;

    /**
     * Mensagem de alerta.
     * @param {string} text Texto.
     * @param {string} title Título.
     */
    Alert(text?: string, title?: string): void;
    
    /**
     * Mensagem de alerta: Information
     * @param {string} text Texto.
     * @param {string} title Título.
     */
    Info(text?: string, title?: string): void;
    
    /**
     * Mensagem de alerta: Warning
     * @param {string} text Texto.
     * @param {string} title Título.
     */
    Warn(text?: string, title?: string): void;
    
    /**
     * Mensagem de alerta: Error
     * @param {string} text Texto.
     * @param {string} title Título.
     */
    Error(text?: string, title?: string): void;
    
    /**
     * Mensagem de confirmação.
     * @param {string} text Texto.
     * @param {string} title Título.
     * @returns {Promise<void>} Retorna apenas se a confirmação for verdadeira.
     */
    Confirm(text?: string, title?: string): Promise<void>;
    
    /**
     * Mensagem de pergunta Sim ou Não.
     * @param {string} text Texto.
     * @param {string} title Título.
     * @param {string} defaults Valor inicial.
     * @param {(value: string) => boolean} validate Valida o valor inserido.
     * @returns {Promise<string>} Retorna o valor inserido.
     */
    Prompt(text?: string, title?: string, defaults?: string, validate?: (value: string) => boolean): Promise<string>;
}

console.Log = function(text: string, values: any = { }, origin: string = '', toConsoleLog: any = undefined, level: Skript.Framework.Log.Level = Skript.Framework.Log.Level.Verbose): void {
    return Skript.Framework.Log.History.post(text, values, origin, toConsoleLog, level);
}

console.Alert = function(text?: string, title?: string): void {
    return Skript.Framework.Layout.Dialog.Alert.alert(text, title);
}

console.Info = function(text?: string, title?: string): void {
    return Skript.Framework.Layout.Dialog.Alert.info(text, title);
}

console.Warn = function(text?: string, title?: string): void {
    return Skript.Framework.Layout.Dialog.Alert.warn(text, title);
}

console.Error = function(text?: string, title?: string): void {
    return Skript.Framework.Layout.Dialog.Alert.error(text, title);
}

console.Confirm = function(text?: string, title?: string): Promise<void> {
    return Skript.Framework.Layout.Dialog.Alert.confirm(text, title);
}

console.Prompt = function(text?: string, title?: string, defaults?: string, validate?: (value: string) => boolean): Promise<string> {
    return Skript.Framework.Layout.Dialog.Alert.prompt(text, title, defaults, validate);
}
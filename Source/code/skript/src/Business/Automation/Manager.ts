namespace Skript.Business.Automation {

    /**
     * Gerencia a automação de módulos do sistema.
     */
    export class Manager {

        /**
         * Construtor.
         */
        public constructor() {
            Framework.Bus.Message.capture(Messages.DoAutomationApply, this, this.onDoAutomationApply);
            Framework.Bus.Message.capture(Messages.DoAutomationSave, this, this.onDoAutomationSave);
            Framework.Bus.Message.capture(Messages.DoAutomationDelete, this, this.onDoAutomationDelete);
            Framework.Bus.Message.capture(Messages.GetCurrentAutomations, this, this.onGetAutomations);
            Framework.Bus.Message.capture(Messages.GetSavedAutomations, this, this.onGetSavedAutomations);
        }

        /**
         * Nome da propriedade que engloba as ações.
         * @type {string}
         */
        public static actionProperty: string = "EXECUTE";

        /**
         * Ações e parâmetros para automação deste componente.
         * @type {Framework.Types.Index<Types.Automation>}
         */
        private sets: Framework.Types.Index<Set> = { };

        /**
         * Adiciona um cojunto e automação.
         * @param {string} name Nome
         * @param {Set} set Conjunto de dados para automação.
         */
        public add(name: string, set: Set): void {
            this.sets[name] = set;
        }

        /**
         * Mensagem: ao solicitar lista de automações.
         * @param {Messages.GetCurrentAutomations} message Mensagem.
         */
        private onGetAutomations(message: Messages.GetCurrentAutomations): void {
            message.automations = this.sets;
        }

        /**
         * Mensagem: ao solicitar lista de automações.
         * @param {Messages.DoAutomationApply} message Mensagem.
         */
        private onDoAutomationApply(message: Messages.DoAutomationApply): void {
            const result: Framework.Types.KeyValue<boolean>[] = [];

            for (const name in message.settings) {
                if (this.sets[name]) {
                    for (const parameter in message.settings[name]) {
                        if (this.sets[name].parameters[parameter]) {
                            if (this.sets[name].parameters[parameter].set(message.settings[name][parameter])) {
                                result.push({ value: true,  key: "Defined: {0}".translate(`"${name}"."${parameter}"`) });
                            } else {
                                result.push({ value: false,  key: "Invalid value for: {0}".translate(`"${name}"."${parameter}"`) });
                            }
                        } else if (parameter !== Automation.Manager.actionProperty) {
                            result.push({ value: false,  key: "Not exists: {0}".translate(`"${name}"."${parameter}"`) });
                        }
                    }
                    if (message.settings[name][Automation.Manager.actionProperty]) {
                        for (const action in message.settings[name][Automation.Manager.actionProperty]) {
                            if (this.sets[name].actions[action]) {
                                if (message.settings[name][Automation.Manager.actionProperty][action] === true) {
                                    this.sets[name].actions[action].execute();
                                    result.push({ value: true,  key: "Executed: {0}".translate(`"${name}".${Automation.Manager.actionProperty}."${action}"`) });
                                } else if (message.settings[name][Automation.Manager.actionProperty][action] === false) {
                                    result.push({ value: true,  key: "Not executed: {0}".translate(`"${name}".${Automation.Manager.actionProperty}."${action}"`) });
                                } else {
                                    result.push({ value: false,  key: "Invalid value for: {0}".translate(`"${name}".${Automation.Manager.actionProperty}."${action}"`) });
                                }
                            } else {
                                result.push({ value: false,  key: "Not exists: {0}".translate(`"${name}".${Automation.Manager.actionProperty}."${action}"`) });
                            }
                        }
                    }
                } else {
                    if (!Object.keys(message.settings[name]).length) {
                        result.push({ value: false,  key: "Not exists: {0}".translate(name) });
                    } else for (const parameter in message.settings[name]) {
                        if (parameter !== Automation.Manager.actionProperty) {
                            result.push({ value: false,  key: "Not exists: {0}".translate(`"${name}"."${parameter}"`) });
                        } else {
                            for (const action in message.settings[name][parameter]) {
                                result.push({ value: false,  key: "Not exists: {0}".translate(`"${name}".${Automation.Manager.actionProperty}."${action}"`) });
                            }
                        }
                    }
                }
            }

            message.success = result.filter(v => v.value).map(v => v.key);
            message.errors = result.filter(v => !v.value).map(v => v.key);

            if (message.verbose) {
                if (!message.success.length && !message.errors.length) Core.Main.instance.log.post("There were no settings to apply.", undefined, Framework.Log.Level.Warning, undefined, !Core.Main.instance.debug ? undefined : result);
                else if (message.errors.length === 0) Core.Main.instance.log.post("A total of {0} settings have been successfully applied to the modules.", message.success.length, Framework.Log.Level.Information, undefined, !Core.Main.instance.debug ? undefined : result);
                else if (message.success.length && message.errors.length !== message.success.length) Core.Main.instance.log.post("A total of {0} settings have been successfully applied to the modules. But there was an error in {1}.", [message.success.length, message.errors.length], Framework.Log.Level.Error, undefined, !Core.Main.instance.debug ? undefined : result);
                else Core.Main.instance.log.post("All {0} definitions have errors when applied to the modules.", message.errors.length, Framework.Log.Level.Error, undefined, !Core.Main.instance.debug ? undefined : result);
            }

            if (message.success.length) new Messages.DidAutomationApplied().send();
        }

        /**
         * Gravar definições em um conjunto de automação.
         * @param {Messages.DoAutomationSave} message Mensagem.
         */
        private onDoAutomationSave(message: Messages.DoAutomationSave): void {
            const automations = Core.Main.instance.storage.data().automations;
            message.created = automations[message.name] === undefined;
            message.edited = !message.created;
            automations[message.name] = message.settings;
            Core.Main.instance.storage.data({ automations: automations });

            if (message.verbose) {
                if (message.created) Core.Main.instance.log.post("Automation set \"{0}\" was successfully created.", message.name, Framework.Log.Level.Information);
                else if (message.edited) Core.Main.instance.log.post("Automation set \"{0}\" has been updated successfully.", message.name, Framework.Log.Level.Information);
                else throw new Framework.Errors.InvalidExecution("Messages.DoAutomationSave not work.");
            }

            new Messages.DidAutomationUpdated(message.name, message.created, message.edited, false).send();
        }

        /**
         * Retorna a lista de conjunto de automação gravadas.
         * @param {Messages.GetSavedAutomations} message Mensagem.
         */
        private onGetSavedAutomations(message: Messages.GetSavedAutomations): void {
            message.automations = Core.Main.instance.storage.data().automations;
        }

        /**
         * Apaga um conjunto de automação.
         * @param {Messages.DoAutomationDelete} message Mensagem.
         */
        private onDoAutomationDelete(message: Messages.DoAutomationDelete): void {
            const automations = Core.Main.instance.storage.data().automations;
            message.deleted = automations[message.name] !== undefined;
            delete automations[message.name];
            Core.Main.instance.storage.data({ automations: automations });

            if (message.verbose) {
                if (message.deleted) Core.Main.instance.log.post("Automation set \"{0}\" was deleted successfully.", message.name, Framework.Log.Level.Information);
                else throw new Framework.Errors.InvalidExecution("Messages.onDoAutomationDelete not work.");
            }

            new Messages.DidAutomationUpdated(message.name, false, false, message.deleted).send();
        }
    }
}
/// <reference path="Core/Environment/Window.tsx" />
/// script: initialize

/// <reference path="Core/Environment/String.tsx" />
/// script: initialize

/// <reference path="Core/Environment/Date.tsx" />
/// script: initialize

/// <reference path="Core/Environment/Number.tsx" />
/// script: initialize

/// <reference path="Locale/Format/Number.tsx" />
/// script: initialize

/// <reference path="Locale/Format/Date.tsx" />
/// script: initialize

/// <reference path="Locale/FormatSet.tsx" />
/// script: initialize

/// <reference path="Locale/Formats.tsx" />
/// script: initialize

/// <reference path="Locale/Translate.tsx" />
/// script: initialize

/// <reference path="Locale/Translates.tsx" />
/// script: initialize

/// <reference path="Core/Log/Level.tsx" />
/// script: initialize

/// <reference path="Core/Log/Message.tsx" />
/// script: initialize

/// <reference path="Core/Log/ConsoleLog.tsx" />
/// script: initialize

/// <reference path="Core/Log/History.tsx" />
/// script: initialize

/// <reference path="Core/Configuration.tsx" />
/// script: initialize

/// <reference path="Core/Data.tsx" />
/// script: initialize

/// <reference path="Util/Number.tsx" />
/// script: initialize

/// <reference path="Util/DateTime.tsx" />
/// script: initialize

/// <reference path="Util/String.tsx" />
/// script: initialize

/// <reference path="Util/DOM.tsx" />
/// script: initialize

/// <reference path="Util/Drawing.tsx" />
/// script: initialize

/// <reference path="Util/LoadReferences.tsx" />
/// script: initialize

/// <reference path="Layout/Theme/Colors.tsx" />
/// script: initialize

/// <reference path="Layout/Theme/Stylesheet.tsx" />
/// script: initialize

/// <reference path="Layout/Component/Master.tsx" />
/// script: react

/// <reference path="Layout/Component/Dialog.tsx" />
/// script: react

/// <reference path="Core/Bus/Command.tsx" />
/// script: initialize

/// <reference path="Core/Bus/CommandHandler.tsx" />
/// script: initialize

/// <reference path="Core/Bus/Router.tsx" />
/// script: initialize

/// <reference path="Layout/Command/CreateDialog.tsx" />
/// script: initialize

/// <reference path="Layout/PresentationRouter.tsx" />
/// script: initialize

/// <reference path="Layout/Presentation.tsx" />
/// script: initialize

/// <reference path="Core/Api/ScriptContext.tsx" />
/// script: initialize

/// <reference path="Core/Api/Data.tsx" />
/// script: initialize

/// <reference path="Core/Api/DataType.tsx" />
/// script: initialize

/// <reference path="Core/Api/Request.tsx" />
/// script: initialize

/// <reference path="Core/Main.tsx" />
/// script: initialize

/// <reference path="Core/Infrastructure.tsx" />
/// script: initialize

/// <reference path="Core/All.tsx" />
/// script: initialize

const all: Core.All = new Core.All();
all.infrastructure = new Core.Infrastructure({
    name: "Luckygames Tips",
    debug: true,
    welcome: true,
    server: "https://dsv.luckygames.tips/"
});

import { ExtensionContext } from "vscode";
import { Reporter } from "./Reporter";

export class MTFReporter extends Reporter {
    constructor(context: ExtensionContext, enabled: boolean = true) {
        // following key just allows you to send events to azure insights API
        // so it does not need to be protected
        // but obfuscating anyways - bots scan github for keys, but if you want my key you better work for it, damnit!
        const ik = Buffer.from("ODNiZmQzODEtOTllYy00MzJjLTlkNTctZmJjZWQ0Yjk4YjFl", "base64").toString()
        super('fcrespo82.markdown-table-formatter', ik, context, enabled)
        context.subscriptions.push(this)
    }
}
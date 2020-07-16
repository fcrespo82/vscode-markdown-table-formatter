import { extensions, ExtensionContext, Disposable, env, ExtensionMode } from "vscode";
import TelemetryReporter from "vscode-extension-telemetry";
import { userInfo } from "os";
import { sep } from "path";

export class Reporter implements Disposable {
    private telemetry!: TelemetryReporter;
    private enabled: boolean;
    private lastStackTrace?: string;
    // TODO: Leave it that way until I can see some versions of the vscode of my users
    // After that use engine ^1.47 extensionMode on context
    private readonly inDevelopmentMode: boolean = false; // env.sessionId === "someValue.sessionId";


    constructor(extensionId: string, instrumentationKey: string, context: ExtensionContext, enabled = true) {
        this.inDevelopmentMode = context.extensionMode === ExtensionMode.Development;
        const extensionMetadata = extensions.getExtension(extensionId)
        const extensionVersion = extensionMetadata?.packageJSON.version
        this.enabled = enabled;
        this.telemetry = new TelemetryReporter(extensionId, extensionVersion, instrumentationKey)
        context.subscriptions.push(this.telemetry)
    }

    dispose(): void {
        // This will ensure all pending events get flushed
        this.telemetry.dispose();
    }

    sendTelemetryEvent(eventName: string, properties: { [key: string]: string; } | undefined, measurements: { [key: string]: number; } | undefined): void {
        console.log
        if (this.enabled && !this.inDevelopmentMode) {
            this.telemetry.sendTelemetryEvent(eventName, properties, measurements)
        }
    }

    sendError(error: Error, code = 0, category = 'typescript'): void {
        console.error(`${category} error: ${error.name} code ${code}\n${error.stack}`)
        if (this.enabled && !this.inDevelopmentMode) {

            error.stack = this.anonymizePaths(error.stack)

            // no point in sending same error twice (and we want to stay under free API limit)
            if (error.stack == this.lastStackTrace) return

            this.telemetry.sendTelemetryException(error, {
                code: code.toString(),
                category,
            })

            this.lastStackTrace = error.stack
        }
    }

    sendTelemetryException(error: Error, properties: { [key: string]: string; } | undefined, measurements: { [key: string]: number; } | undefined): void {
        if (this.enabled && !this.inDevelopmentMode) {
            this.telemetry.sendTelemetryException(error, properties, measurements)
        }
    }

    /**
     * replace username with anon
     */
    anonymizePaths(input?: string): string | undefined {
        if (input == null) return input
        return input.replace(new RegExp('\\' + sep + userInfo().username, 'g'), sep + 'anon')
    }
}
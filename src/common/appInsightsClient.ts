"use strict";
import appInsights = require("applicationinsights");
import * as vscode from "vscode";
import { Utility } from "./utility";

export class AppInsightsClient {
    public static sendEvent(eventName: string, properties?: { [key: string]: string; }): void {
        if (this._enableTelemetry) {
            this._client.trackEvent(eventName, properties);
        }
    }

    private static _client = appInsights.getClient("2cfbc794-dfe4-4007-b93a-a2edcd0b2739");
    private static _enableTelemetry = Utility.getConfiguration().get<boolean>("enableTelemetry");
}

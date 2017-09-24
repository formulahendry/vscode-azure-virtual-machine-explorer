"use strict";
import * as vscode from "vscode";

export class Utility {
    public static getConfiguration(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration("azure-virtual-machine-explorer");
    }

    public static appendLine(message: string) {
        this._outputChannel.show();
        this._outputChannel.appendLine(message);
    }

    private static _outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel("Azure Virtual Machine");
}

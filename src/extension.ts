"use strict";
import * as vscode from "vscode";
import { AppInsightsClient } from "./common/appInsightsClient";
import { INode } from "./model/INode";
import { VirtualMachineNode } from "./model/virtualMachineNode";
import { VirtualMachineTreeDataProvider} from "./virtualMachineTreeDataProvider";

export function activate(context: vscode.ExtensionContext) {
    AppInsightsClient.sendEvent("loadExtension");

    const virtualMachineTreeDataProvider = new VirtualMachineTreeDataProvider(context);

    context.subscriptions.push(vscode.window.registerTreeDataProvider("azureVirtualMachine", virtualMachineTreeDataProvider));

    context.subscriptions.push(vscode.commands.registerCommand("azure-virtual-machine-explorer.selectSubscriptions", () => {
        AppInsightsClient.sendEvent("selectSubscriptions");
        vscode.commands.executeCommand("azure-account.selectSubscriptions");
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-virtual-machine-explorer.refresh", (node: INode) => {
        AppInsightsClient.sendEvent("refresh");
        virtualMachineTreeDataProvider.refresh(node);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-virtual-machine-explorer.start", (virtualMachineNode: VirtualMachineNode) => {
        AppInsightsClient.sendEvent("start");
        virtualMachineNode.start(virtualMachineTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-virtual-machine-explorer.powerOff", (virtualMachineNode: VirtualMachineNode) => {
        AppInsightsClient.sendEvent("powerOff");
        virtualMachineNode.powerOff(virtualMachineTreeDataProvider);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("azure-virtual-machine-explorer.deallocate", (virtualMachineNode: VirtualMachineNode) => {
        AppInsightsClient.sendEvent("deallocate");
        virtualMachineNode.deallocate(virtualMachineTreeDataProvider);
    }));
}

export function deactivate() {
}

import computeManagementClient = require("azure-arm-compute");
import * as path from "path";
import * as vscode from "vscode";
import * as VirtualMachineModels from "../../node_modules/azure-arm-compute/lib/models";
import * as VirtualMachineOperations from "../../node_modules/azure-arm-compute/lib/Operations";
import { VirtualMachineTreeDataProvider } from "../virtualMachineTreeDataProvider";
import { INode } from "./INode";
import { SubscriptionNode } from "./subscriptionNode";

export class VirtualMachineNode implements INode {
    private readonly resourceGroupName;

    constructor(private readonly virtualMachines: VirtualMachineOperations.VirtualMachines,
                private readonly virtualMachine: VirtualMachineModels.VirtualMachine,
                private readonly subscriptionNode: SubscriptionNode) {
        this.resourceGroupName = this.getResourceGroupNameById(this.virtualMachine.id);
    }

    public async getTreeItem(): Promise<vscode.TreeItem> {
        let statusCode = await this.virtualMachines.get(this.resourceGroupName, this.virtualMachine.name, { expand: "instanceView" }).then((virtualMachine) => {
            return virtualMachine.instanceView.statuses.find((status) => status.code.startsWith("PowerState")).code;
        });
        statusCode = statusCode.substr(statusCode.indexOf("/") + 1);
        const image = statusCode === "running" ? "vm-on.png" : "vm-off.png";
        return {
            label: `${this.virtualMachine.name} (${statusCode})`,
            contextValue: "virtualMachine",
            iconPath: path.join(__filename, "..", "..", "..", "..", "resources", image),
        };
    }

    public getChildren(): INode[] {
        return [];
    }

    public start(virtualMachineTreeDataProvider: VirtualMachineTreeDataProvider): void {
        vscode.window.withProgress({
            title: `Starting VM [${this.virtualMachine.name}]`,
            location: vscode.ProgressLocation.Window,
        }, async (progress) => {
            await new Promise((resolve, reject) => {
                this.virtualMachines.start(this.resourceGroupName, this.virtualMachine.name).then((response) => {
                    if (response.error) {
                        reject(response.error.message);
                    } else {
                        virtualMachineTreeDataProvider.refresh(this.subscriptionNode);
                        resolve();
                    }
                });
            });
        });
    }

    public powerOff(virtualMachineTreeDataProvider: VirtualMachineTreeDataProvider): void {
        vscode.window.withProgress({
            title: `Stopping VM [${this.virtualMachine.name}]`,
            location: vscode.ProgressLocation.Window,
        }, async (progress) => {
            await new Promise((resolve, reject) => {
                this.virtualMachines.powerOff(this.resourceGroupName, this.virtualMachine.name).then((response) => {
                    if (response.error) {
                        reject(response.error.message);
                    } else {
                        virtualMachineTreeDataProvider.refresh(this.subscriptionNode);
                        resolve();
                    }
                });
            });
        });
    }

    private getResourceGroupNameById(id: string): string {
        const result = /\/resourceGroups\/([^/]+)\//.exec(id);
        return result ? result[1] : "";
    }
}

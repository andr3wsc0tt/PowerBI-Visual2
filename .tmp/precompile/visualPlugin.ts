import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api"
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];

var barChart8C5BE8B346A241EBBFE0BDE229445A68_DEBUG: IVisualPlugin = {
    name: 'barChart8C5BE8B346A241EBBFE0BDE229445A68_DEBUG',
    displayName: 'BarChart',
    class: 'Visual',
    apiVersion: '2.6.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }

        throw 'Visual instance not found';
    },
    custom: true
};

if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["barChart8C5BE8B346A241EBBFE0BDE229445A68_DEBUG"] = barChart8C5BE8B346A241EBBFE0BDE229445A68_DEBUG;
}

export default barChart8C5BE8B346A241EBBFE0BDE229445A68_DEBUG;
/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";
import DataViewTableRow = powerbi.DataViewTableRow;
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;
import * as d3 from "d3";

export interface TestItem {
  Country: string;
  Gross_Sales: number;
}

/**
 * Interface for BarCharts viewmodel.
 *
 * @interface
 * @property {BarChartDataPoint[]} dataPoints - Set of data points the visual will render.
 * @property {number} dataMax                 - Maximum data value in the set of data points.
 */
interface BarChartViewModel {
  dataPoints: BarChartDataPoint[];
  dataMax: number;
}

/**
 * Interface for BarChart data points.
 *
 * @interface
 * @property {number} value    - Data value for point.
 * @property {string} category - Coresponding category of data value.
 */
interface BarChartDataPoint {
  value: number;
  category: string;
}

export class Visual implements IVisual {
  private target: HTMLElement;
  private myVisualProp: boolean;
  private svg: Selection<SVGElement>;
  private g: Selection<SVGElement>;
  private margin = { top: 20, right: 20, bottom: 200, left: 70 };

  constructor(options: VisualConstructorOptions) {
    this.svg = d3.select(options.element).append("svg");
    this.g = this.svg.append("g");
  }

  public update(options: VisualUpdateOptions) {
    var _this = this;

    _this.svg.attr("width", options.viewport.width);
    _this.svg.attr("height", options.viewport.width);

    var gHeight =
      options.viewport.height - _this.margin.top - _this.margin.bottom;

    var gWidth =
      options.viewport.width - _this.margin.right - _this.margin.left;

    _this.g.attr("width", gWidth);
    _this.g.attr("height", gHeight);
    _this.g.attr(
      "transform",
      "translate(" + _this.margin.left + "," + _this.margin.top + ")"
    );

    var dat = Visual.converter(options.dataViews[0].table.rows);

    var xScale = d3
      .scaleBand()
      .domain(dat.map(d => d.Country))
      .rangeRound([0, gWidth])
      .padding(0.1);

    var yMax = d3.max(dat, d => d.Gross_Sales + 10);

    var yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([gHeight, 0]);

    _this.svg.selectAll(".axis").remove();
    _this.svg.selectAll(".bar").remove();

    var xAxis = d3.axisBottom(xScale);
    _this.g
      .append("g")
      .attr("class", "x axis")
      .style("fill", "black")
      .attr("transform", "translate(0," + (gHeight - 1) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.6em")
      .attr("transform", "rotate(-90)");

    var yAxis = d3.axisLeft(yScale);
    _this.g
      .append("g")
      .attr("class", "y axis")
      .style("fill", "black")
      .call(yAxis);

    var shapes = _this.g
      .append("g")
      .selectAll(".bar")
      .data(dat);

    shapes
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", "green")
      .attr("stroke", "black")
      .attr("x", d => xScale(d.Country))
      .attr("width", xScale.bandwidth())
      .attr("y", d => yScale(d.Gross_Sales))
      .attr("height", d => gHeight - yScale(d.Gross_Sales));

    shapes.exit().remove();
  }

  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    let objectName = options.objectName;
    let objectEnumeration: VisualObjectInstance[] = [];

    switch (objectName) {
      case "myCustomObj":
        objectEnumeration.push({
          objectName: objectName,
          properties: {
            myprop: this.myVisualProp
          },
          selector: null
        });
        break;
    }

    return objectEnumeration;
  }

  public destroy(): void {
    //TODO: Perform any cleanup tasks here
  }

  public static converter(rows: DataViewTableRow[]): TestItem[] {
    var resultData: TestItem[] = [];

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      resultData.push({
        Country: row[0] as string,
        Gross_Sales: row[1] as number
      });
    }

    return resultData;
  }
}

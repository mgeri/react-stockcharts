"use strict";

import { nest } from "d3-collection";

import React, { PropTypes, Component } from "react";

import GenericChartComponent, { getAxisCanvas } from "../GenericChartComponent";
import { first, last, hexToRGBA, isDefined, functor } from "../utils";

class SARSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		var { mouseXY, currentItem, chartConfig: { yScale } } = moreProps;
		var { yAccessor } = this.props;
		var y = mouseXY[1];
		var currentY = yScale(yAccessor(currentItem));
		return y <  currentY + 5 && y > currentY - 5;
	}
	drawOnCanvas(ctx, moreProps) {
		var { yAccessor, fallingStroke, risingStroke } = this.props;
		var { xAccessor, plotData, xScale, chartConfig: { yScale }, hovering } = moreProps;

		var width = xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)));

		var d = (width / plotData.length) * 0.8 / 2;
		var r = Math.min(3, Math.max(0.5,  d));

		ctx.lineWidth = hovering ? 8 : 3;
		plotData.forEach(each => {
			var centerX = xScale(xAccessor(each));
			var centerY = yScale(yAccessor(each));
			ctx.strokeStyle = yAccessor(each) > each.close
				? fallingStroke
				: risingStroke;

			ctx.beginPath();
			ctx.moveTo(centerX - r, centerY);
			ctx.lineTo(centerX + r, centerY);

			// ctx.arc(centerX, centerY, r, 0, 2 * Math.PI, false);
			ctx.closePath();
			// ctx.fill();
			ctx.stroke();
		});
	}
	renderSVG(moreProps) {
		var { className, yAccessor } = this.props;
		var { xAccessor, plotData, xScale, chartConfig: { yScale } } = moreProps;
		// console.log(moreProps);

		return <g className={className}>
			{plotData.map((each, idx) => {
				return <circle key={idx} cx={xScale(xAccessor(each))}
					cy={yScale(yAccessor(each))} r={3} fill="green" />;
			})}
		</g>;
	}

	render() {
		return <GenericChartComponent
			canvasToDraw={getAxisCanvas}
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			isHover={this.isHover}
			onClick={this.props.onClick}
			onDoubleClick={this.props.onDoubleClick}
			onContextMenu={this.props.onContextMenu}
			drawOnPan
			/>;
	}
}

SARSeries.propTypes = {
	className: PropTypes.string,
	fallingStroke: PropTypes.string.isRequired,
	risingStroke: PropTypes.string.isRequired,
	yAccessor: PropTypes.func.isRequired,
	opacity: PropTypes.number.isRequired,
	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onContextMenu: PropTypes.func,
};

SARSeries.defaultProps = {
	className: "react-stockcharts-sar",
	fallingStroke: "#4682B4",
	risingStroke: "#15EC2E",
	opacity: 0.5,
	onClick: function(e) { console.log("Click", e); },
	onDoubleClick: function(e) { console.log("Double Click", e); },
	onContextMenu: function(e) { console.log("Right Click", e); },
};

export default SARSeries;

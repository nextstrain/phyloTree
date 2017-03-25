export const removeLabels = function(tree){
    tree.svg.selectAll(".tipLabel").remove();
    tree.svg.selectAll(".branchLabel").remove();
}

export const branchLabels = function(tree, labelText, fontSize, yPad, xPad, align){
    const tmpYPad = yPad || 0.0;
    const tmpXPad = xPad || 0.0;
    const tmpAlign = align || "end";
    tree.branchLabels = tree.svg.selectAll(".branchLabel")
        .data(tree.nodes.filter(function(d){return (fontSize(d) && labelText(d).length);}))
        .enter().append("text")
        .text(labelText)
        .attr("class", "branchLabel")
        .attr("x", function(d){return d.SVGcoords.xTip + xPad;})
        .attr("y", function(d){return d.SVGcoords.yTip + yPad;})
        .style("text-anchor", tmpAlign)
        .style("font-size", function(d){return fontSize(d).toString()+"px";});
}



export const tipLabels = function(tree, labelText, fontSize, yPad, xPad, align){
    const tmpYPad = yPad || 0.0;
    const tmpXPad = xPad || 0.0;
    const tmpAlign = align || "start";
    if (tree.layout==="rect"){
        tree.branchLabels = tree.svg.selectAll(".tipLabel")
            .data(tree.nodes.filter(function(d){return (fontSize(d) && labelText(d).length);}))
            .enter().append("text")
            .text(labelText)
            .attr("class", "tipLabel")
            .attr("x", function(d){return d.SVGcoords.xTip + xPad;})
            .attr("y", function(d){return d.SVGcoords.yTip + yPad;})
            .style("text-anchor", tmpAlign)
            .style("font-size", function(d){return fontSize(d).toString()+"px";});
    }else if (tree.layout==="radial"){
        tree.branchLabels = tree.svg.selectAll(".tipLabel")
            .data(tree.nodes.filter(function(d){return (fontSize(d) && labelText(d).length);}))
            .enter().append("text")
            .text(labelText)
            .attr("class", "tipLabel")
            .attr("x", function(d){return d.SVGcoords.xTip + xPad;})
            .attr("y", function(d){return d.SVGcoords.yTip + yPad;})
            .attr("rotate",function(d){return d.layout.angle;})
            .style("text-anchor", tmpAlign)
            .style("font-size", function(d){return fontSize(d).toString()+"px";});

    }
}
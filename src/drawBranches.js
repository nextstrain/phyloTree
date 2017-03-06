import d3 from "d3";


const defaultBranchStroke = "#555";
const defaultBranchStrokeWidth = 2.0;

/**
 *
 * @param  {object} tree the phyloTree data structure
 * @param  {object} callbacks object with callback that specify the appearance of each tip
 */
export const drawBranches = function(tree, callbacks){
    if (!tree.branchSElements){
        setupBranches(tree);
    }
    makePathS(tree);
    makePathT(tree);
	const tmp_callbacks = Object.assign({}, callbacks);
	if (!tmp_callbacks.stroke){tmp_callbacks.stroke = function(d){return defaultBranchStroke;}};
    if (!tmp_callbacks.strokeWidth){tmp_callbacks.strokeWidth = function(d){return defaultBranchStrokeWidth;}};

    tree.nodes.forEach(function(d){
        d.branchAttributes.stroke = tmp_callbacks.stroke(d);
        d.branchAttributes["stroke-width"] = tmp_callbacks.strokeWidth(d);
    });
    tree.branchSElements.data(tree.nodes)
        .attr("d", function(d){return d.branchAttributes.pathS;})
        .style("stroke", function(d){return d.branchAttributes.stroke;})
        .style("stroke-width", function(d){return d.branchAttributes["stroke-width"];});
    tree.branchTElements.data(tree.internals)
        .attr("d", function(d){return d.branchAttributes.pathT;})
        .style("stroke", function(d){return d.branchAttributes.stroke;})
        .style("stroke-width", function(d){return d.branchAttributes["stroke-width"];});
}

/**
 * create the d3 objects for tips and bind the callbacks
 * @param  {[type]} tree [description]
 * @return {[type]}      [description]
 */
export const setupBranches = function(tree){
    tree.branchSElements = tree.svg.append("g").selectAll(".branch2 S")
        .data(tree.nodes)
        .enter()
        .append("path")
        .attr("class", "branch2 S")
        .attr("id", function(d) {return "branch_S_" + d.n.clade;})
        .on("mouseover", function(d) {tree.callbacks.onBranchHover(d);})
        .on("mouseout", function(d) {tree.callbacks.onBranchLeave(d);})
        .on("click", function(d) {tree.callbacks.onBranchClick(d);})
        .style("fill","none")
        .style("pointer-events", "auto")
        .style("cursor", "pointer");

    tree.branchTElements = tree.svg.append("g").selectAll(".branch2 T")
        .data(tree.nodes)
        .enter()
        .append("path")
        .attr("class", "branch2 T")
        .attr("id", function(d) {return "branch_S_" + d.n.clade;})
        .on("mouseover", function(d) {tree.callbacks.onBranchHover(d);})
        .on("mouseout", function(d) {tree.callbacks.onBranchLeave(d);})
        .on("click", function(d) {tree.callbacks.onBranchClick(d);})
        .style("fill","none")
        .style("pointer-events", "auto")
        .style("cursor", "pointer");
}


export const makePathS = function(tree){
    tree.nodes.forEach(function(d){
        d.branchAttributes.pathS = `M ${d.SVGcoords.xBase}, ${d.SVGcoords.yBase}
                                    L ${d.SVGcoords.xTip}, ${d.SVGcoords.yTip}`;
    });
}

export const makePathT = function(tree){
    if (tree.layout === "rect"){
        tree.internals.forEach(function(d){
            d.branchAttributes.pathT = `M ${d.SVGcoords.xTBarStart}, ${d.SVGcoords.yTBarStart} L ${d.SVGcoords.xTBarEnd}, ${d.SVGcoords.yTBarEnd}`;
        });
    }else if (tree.layout === "radial"){
        tree.internals.forEach(function(d){
            d.branchAttributes.pathT = `M ${d.SVGcoords.xTBarStart}, ${d.SVGcoords.yTBarStart} A ${d.SVGcoords.rx} ${d.SVGcoords.ry} 0  ${(d.smallBigArc?" 1 ":" 0 ")} 0  ${d.SVGcoords.xTBarEnd}, ${d.SVGcoords.yTBarEnd}`;
        });
    }
}

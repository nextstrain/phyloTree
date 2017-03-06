import treeLayout from "./treeLayout";
import treeCanvas from "./treeCanvas";
import {preOrderIteration} from "./treeHelpers";

/**
 * takes an augur json and converts it into the a tree structure
 * that included information needed for drawing and manipulation
 * of the tree.
 * @param  {object} nodes hierarchical json where .children are the descending branches
 * @return {object}       object storing nodes and other information about tree display
 */
const phyloTree = function(nodes, params) {
    const phyloNodes = [];
    const nodeArray = [];
    const makeNodeArray = function(node){
        nodeArray.push(node);
    }
    preOrderIteration(nodes[0], makeNodeArray);
    nodeArray.forEach(function(d){
        const nodeShell = {n:d, stats:{}, layout:{}, SVGcoords:{}, tipAttributes:{}, branchAttributes:{}};
        d.shell = nodeShell;
        nodeShell.parent = d.parent.shell;
        phyloNodes.push(nodeShell);
    });

    phyloNodes.forEach(function(d){
        d.terminal = (d.n.children)?false:true;
        if (d.terminal){
            d.children = null;
        }else{
            d.children = d.n.children.map(function(x){return x.shell;});
        }
    });
    const newTree = Object.assign(
                        {nodes:phyloNodes,
                         layout:"rect",
                         distance:"div",
                         xScale: d3.scale.linear(),
                         yScale: d3.scale.linear(),
                         orientation:1,
                         callbacks:{},
                        },
                        params);
    if (!newTree.dimension && newTree.svg){
        newTree.dimensions = {width:parseInt(this.svg.attr("width"), 10),
                              height:parseInt(this.svg.attr("height"), 10)};
    }
    // calculate layout and coordinates using defaults if not otherwise specified
    treeLayout(newTree);
    treeCanvas(newTree);
    return newTree;
}


export default phyloTree;
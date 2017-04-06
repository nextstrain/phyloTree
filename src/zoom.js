import d3 from "d3";
import {preOrderIteration} from "./treeHelpers";
import {updateGeometry} from "./updateTree";

/**
 * restrict the visible rectangle to a particular clade
 * @param  {[type]} tree tree objecct
 * @param  {[type]} d    clade to zoom into
 * @param  {[type]} dt   transition duration
 */
export const zoomIntoClade = function(tree, d, dt, setSelected){
    tree.nodes.forEach(function (d){d.state.inView = false;});
    preOrderIteration(d, function(d){d.state.inView=true;})
    if (setSelected){
        tree.nodes.forEach(function (d){d.state.selected = d.state.inView;});
    }
    visibleRectangleFromNodes(tree);
    updateGeometry(tree, dt);
}

/**
 * calculate the visible rectangle based on a selection of nodes marked "inView"
 * @param  {[type]} tree [description]
 */
export const visibleRectangleFromNodes = function(tree){
    const xVals = tree.nodes.filter(function(d){return d.state.inView;})
                            .map(function (d){return d.layout.x;});
    const yVals = tree.nodes.filter(function(d){return d.state.inView;})
                            .map(function (d){return d.layout.y;});
    tree.visibleTips = tree.tips.filter(function(d){return d.state.inView;});
    if (yVals.length){
        tree.visibleRectangle = {top:d3.max(yVals), bottom:d3.min(yVals),
                                 left:d3.min(xVals), right:d3.max(xVals)};

    }else{
        tree.visibleRectangle = null;
    }
}

/**
 * determine the "inView" state of nodes from a rectanglet that is visible
 * @param  {[type]} tree tree object
 */
export const inViewFromVisibleRectangle = function(tree, setSelected){
    const visR = tree.visibleRectangle;
    tree.nodes.forEach(function(d){
        d.state.inView = ((d.layout.x>=visR.left)&&(d.layout.x<=visR.right)
                        &&(d.layout.y>=visR.bottom)&&(d.layout.y<=visR.top));
        if (setSelected){d.state.selected = d.state.inView;}
     });
    tree.visibleTips = tree.tips.filter(function(d){return d.state.inView;});
}

/**
 * determine the full extend of the tree by taking min and max of x and y coordinates of every node
 * @param  {array} nodes array of all nodes
 * @return {object}       object with min/max x/y as left, right, top, bottom
 */
export const resetView = function(tree){
    tree.nodes.forEach(function (d){d.state.inView = true;});
    visibleRectangleFromNodes(tree, true);
}


/**
 * zomming functions. either zoom both directions by the same factor,
 * or zoom x and y separatly
 * @param  {float} factor factor to zoom
 * @param  {object}} tree   the tree object, this function will change visibleRectabgle
 * @param  {int} dt     transition duration
 */
export const zoomIn = function(tree, factor, dt, setSelected){
    const cX = 0.5*(tree.visibleRectangle.right + tree.visibleRectangle.left);
    const dX = 0.5*(tree.visibleRectangle.right - tree.visibleRectangle.left);
    const cY = 0.5*(tree.visibleRectangle.top + tree.visibleRectangle.bottom);
    const dY = 0.5*(tree.visibleRectangle.top - tree.visibleRectangle.bottom);

    tree.visibleRectangle.bottom = cY - dY/factor;
    tree.visibleRectangle.top = cY + dY/factor;
    tree.visibleRectangle.right = cX + dX/factor;
    tree.visibleRectangle.left = cX - dX/factor;
    inViewFromVisibleRectangle(tree, setSelected);
    updateGeometry(tree, dt);
}



export const zoomInY = function(tree, factor, dt, setSelected){
    const cY = 0.5*(tree.visibleRectangle.top + tree.visibleRectangle.bottom);
    const dY = 0.5*(tree.visibleRectangle.top - tree.visibleRectangle.bottom);

    tree.visibleRectangle.bottom = cY - dY/factor;
    tree.visibleRectangle.top = cY + dY/factor;
    inViewFromVisibleRectangle(tree, setSelected);
    updateGeometry(tree, dt);
}


export const zoomInX = function(tree, factor, dt, setSelected){
    const cX = 0.5*(tree.visibleRectangle.right + tree.visibleRectangle.left);
    const dX = 0.5*(tree.visibleRectangle.right - tree.visibleRectangle.left);

    tree.visibleRectangle.left = cX - dX/factor;
    tree.visibleRectangle.right = cX + dX/factor;
    inViewFromVisibleRectangle(tree, setSelected);
    updateGeometry(tree, dt);
}


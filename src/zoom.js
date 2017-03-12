import d3 from "d3";
import {preOrderIteration} from "./treeHelpers";
import {updateGeometry} from "./updateTree";

export const zoomIntoClade = function(d, tree, dt){
    tree.nodes.forEach(function (d){d.state.inView = false;});
    preOrderIteration(d, function(d){d.state.inView=true;})
    visibleRectangleFromNodes(tree);
    updateGeometry(tree, dt);
}


export const visibleRectangleFromNodes = function(tree){
    const xVals = tree.nodes.filter(function(d){return d.state.inView;})
                            .map(function (d){return d.layout.x;});
    const yVals = tree.nodes.filter(function(d){return d.state.inView;})
                            .map(function (d){return d.layout.y;});
    if (yVals.length){
        tree.visibleRectangle = {top:d3.max(yVals), bottom:d3.min(yVals),
                                 left:d3.min(xVals), right:d3.max(xVals)};

    }else{
        tree.visibleRectangle = null;
    }
}


export const inViewFromVisibleRectangle = function(tree){
    const visR = tree.visibleRectangle;
    tree.nodes.forEach(function(d){
        d.state.inView = ((d.layout.x>=visR.left)&&(d.layout.x<visR.right)
                        &&(d.layout.y>=visR.bottom)&&(d.layout<visR.top));
     });
}

/**
 * determine the full extend of the tree by taking min and max of x and y coordinates of every node
 * @param  {array} nodes array of all nodes
 * @return {object}       object with min/max x/y as left, right, top, bottom
 */
export const resetView = function(tree){
    tree.nodes.forEach(function (d){d.state.inView = true;});
    visibleRectangleFromNodes(tree);
}


/**
 * zomming functions. either zoom both directions by the same factor,
 * or zoom x and y separatly
 * @param  {float} factor factor to zoom
 * @param  {object}} tree   the tree object, this function will change visibleRectabgle
 * @param  {int} dt     transition duration
 */
export const zoomIn = function(factor, tree, dt){
    const cX = 0.5*(tree.visibleRectangle.right + tree.visibleRectangle.left);
    const dX = 0.5*(tree.visibleRectangle.right - tree.visibleRectangle.left);
    const cY = 0.5*(tree.visibleRectangle.top + tree.visibleRectangle.bottom);
    const dY = 0.5*(tree.visibleRectangle.top - tree.visibleRectangle.bottom);

    tree.visibleRectangle.bottom = cY - dY/factor;
    tree.visibleRectangle.top = cY + dY/factor;
    tree.visibleRectangle.right = cX + dX/factor;
    tree.visibleRectangle.left = cX - dX/factor;
    inViewFromVisibleRectangle(tree);
    updateGeometry(tree, dt);
}



export const zoomInY = function(factor, tree, dt){
    const cY = 0.5*(tree.visibleRectangle.top + tree.visibleRectangle.bottom);
    const dY = 0.5*(tree.visibleRectangle.top - tree.visibleRectangle.bottom);

    tree.visibleRectangle.bottom = cY - dY/factor;
    tree.visibleRectangle.top = cY + dY/factor;
    inViewFromVisibleRectangle(tree);
    updateGeometry(tree, dt);
}


export const zoomInX = function(factor, tree, dt){
    const cX = 0.5*(tree.visibleRectangle.right + tree.visibleRectangle.left);
    const dX = 0.5*(tree.visibleRectangle.right - tree.visibleRectangle.left);

    tree.visibleRectangle.left = cX - dX/factor;
    tree.visibleRectangle.right = cX + dX/factor;
    inViewFromVisibleRectangle(tree);
    updateGeometry(tree, dt);
}


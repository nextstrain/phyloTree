import d3 from "d3";
import phyloTree from "./phyloTree";
import drawTree from "./drawTree";
import {zoomIntoClade, zoomIn} from "./zoom";
import {changeLayout, changeDistance, updateGeometry,
        updateTipAttribute, updateTipStyle, updateTips,
        updateBranchAttribute, updateBranchStyle, updateBranches} from "./updateTree";
const colors = [
  "#60AA9E", "#D9AD3D", "#5097BA", "#E67030", "#8EBC66", "#E59637", "#AABD52", "#DF4327", "#C4B945", "#75B681"
];

var dummy=0;
var myTree;
var treeplot = d3.select("#treeplot");

const zoomClade = function(d){
    zoomIntoClade(myTree, d);
    updateGeometry(myTree, 1000);
}

const zoom = function(){
    zoomIn(myTree, 1.4);
    updateGeometry(myTree, 1000);
}

d3.json("/data/zika_tree.json", function(err, data){
    console.log(data, err);
    if (data){
        myTree = phyloTree(data, {svg:treeplot, margins:{top:10, bottom:10, left:10, right:10},
                                  callbacks:{onBranchClick:zoomClade,
                                            onBranchHover:function(d){console.log(d.n.strain);},
                                            onBranchLeave:function(d){console.log(d.n.strain);},
                                            onTipHover:function(d){console.log(d.n.strain);},
                                            onTipLeave:function(d){console.log(d.n.strain);}
                                            }
                                 }
                           );
        console.log(myTree);
    }else{
        console.log("error loading data",err);
    }
    drawTree(myTree);
});

d3.select("#layout").on("change", function(){
    var layout = document.getElementById("layout").value;
    changeLayout(myTree, 1000, layout);
;});

d3.select("#distance").on("change", function(){
    var distance = document.getElementById("distance").value;
    changeDistance(myTree, 1000, distance);
    console.log(myTree);
;});

d3.select("#size").on("click", function(){
    myTree.tips.forEach(function(d,i){
        d.tipAttributes.r = (dummy+i)%8+2;
    });
    dummy++;
    updateTipAttribute(myTree, 'r', 1000);
});


d3.select("#color").on("click", function(){
    myTree.nodes.forEach(function(d,i){
        if (d.terminal){
            d.tipAttributes.fill = colors[(dummy+i)%10];
            d.tipAttributes.stroke = d3.rgb(colors[(dummy+i)%10]).darker();
            d.branchAttributes.stroke = d.tipAttributes.stroke;
        }else{
            d.branchAttributes.stroke = d3.rgb(colors[(dummy+i)%10]).darker();
        }
    });
    dummy++;
    updateTips(myTree, [], ['fill', 'stroke'], 1000);
    updateBranchStyle(myTree, 'stroke', 1000);
});

d3.select("#both").on("click", function(){
    myTree.tips.forEach(function(d,i){
        d.tipAttributes.fill = colors[(dummy+i)%10];
        d.tipAttributes.stroke = d3.rgb(colors[(dummy+i)%10]).darker();
        d.tipAttributes.r = (dummy+i)%8+2;
        d.branchAttributes.stroke = d.tipAttributes.stroke;
    });
    dummy++;
    updateTips(myTree, ['r'], ['fill', 'stroke'], 1000);
    updateBranchStyle(myTree, 'stroke', 1000);
});

d3.select("#reset").on("click", function(){
    zoomClade(myTree.nodes[0]);
});

d3.select("#treeplot").on("dblclick", function(d,e,f,g){
    console.log("zoom", d, e, f, g);
    zoom();
});

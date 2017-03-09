### phyloTree: interactive phylogenetic tree viewer

phyloTree takes tree in json format as input. Each internal node as a `.children` array with descendent nodes. Furthermore, each node has a `.attr` attribute that stores meta data and branch length information.

phyloTree is built around a data structure that stores the data and current state of the tree.
```
tree = {
	nodes: [node1, node2, ...],			//linear array of nodes
	tips: [tip1, tip2, ...],			//terminal nodes, subset of all nodes
	internals: [node1, node2, ...],		//internal nodes, subset of all nodes
	tipAttributes: { } ,				//object storing styles and attributes of tips
	branchAttributes: { } ,				//object storing styles and attributes of branches
	tipElements: { } ,				 	//d3 elements corresponding to the tips
	branchTbarElements: { } ,			//d3 elements corresponding to the branches
	branchStemElements: { } ,		 	//d3 elements corresponding to the branches
}
```
Upon instantiation, phyloTree generates this data structure and wraps the input tree into a custom node structure where the original node is stored as `.n`.


#### different layouts
Phylotree support different tree layouts including rectangular layout, radial layout, unrooted layout and the possibility to plot a distance attribute against sampling time


#### different distances
PhyloTree can use any numerical parameter as branch length. Such quantities can be stored in `attr`. In addition phyloTree implements a cladogram view, discrete number of branchings to the root is used as distance.
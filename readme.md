[Treehehe](http://chelsea.lol/treehehe/)


Overview:
---

This work began as the a project for a course on Visual Analytics that I took at the University of Ottawa in fall 2018.

The main goal of the project is to provide a tool for visualizing proof trees and providing a walk-through of the reasoning process. It is my hope that this work can have multiple uses. the initial motivation is to help beginners on their journey of understanding logic. A second goal is that it can be used by those more familiar with logic as a tool to view a large proof tree in a convenient format, possibly providing new insights and at least allowing convenient documentation of proofs. A third goal is to allow user to build proofs which can then be exported to LaTeX or other markup for display elsewhere.

I wrote a [report](http://chelsea.lol/Resources/COMP5209_BattellC_report.pdf) and gave a [presentation](http://chelsea.lol/Resources/VA_presentation_final.pdf) that provide more information on this project.


Important files:
---

index.html

- contains the markup for the main page

Resources/scripts/d3Tree.js

- D3 code for making the tree visualization in the centre of the main page
- constants and program mode variables at the top
- TreeDataMaker: function (what pattern?) for building tree data
- constant of examples of trees
  * problem here: how can this be added to if we want to allow more to be made?
- make a concrete TreeBuilder
  * TreeBuilder builds the d3 thing; bad form? all side effects?
- function to update tree selection
- InteractionManager to handle updates
- Tree traversal code for handling different tree traversals (a tree traversal is a function)
- event handling

Resources/scripts/ruleSets.js

- contains the data for different sets of rules

Resources/scripts/treeExamples.js

- contains tree examples

---

<!--
Think about:

- tree data vs d3 thing
-->

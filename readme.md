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
- is this used by the main script?

---


Think about:

- tree data vs d3 thing


Dec 13 goals:

- ~~start writing initial thoughts on intro (note form?)~~

- ~~summary of paper in intro~~

- ~~objective for readers of paper~~

- ~~more on tool description~~

- ~~try to finish tool description and user tasks section~~



Dec 17 goals:

- ~~finish first draft of Technology (describing modifications and challenges)~~

- ~~start writing tutorial (moved from Dec 13)~~

- ~~list of terms for glossary or special note~~



Dec 18 goals:

- copy content from proposal

- tutorial and examples (moved from Dec 13)

- discussion: first draft (future work, in particular) (moved from Dec 17)

- review and make notes on presentation that are not already included

- ~~introduction: first draft~~

- infovis elements: first draft

- conclusion: first draft


Dec 19 goals:

- figures / graphics

- begin review for final draft


Dec 20 goals:

- tool updates

- final draft



===

- todo: merge in presentation notes?
- todo: omit proposal notes that are no longer relevant


Presentation notes:
---

Application domain:

- argument _obeying_ logic rules
- objective: gain insight on proofs and proof systems by exploring proof trees
- formula, inference rule, proof tree, as in paper


User tasks:

- figures for sequent and proof
- viewing supplementary info on selected node
- reviewing rule sets


InfoVis elements:

- TR for layout
- F+C: relationship between focus and its children and parent (check in source paper)
- colour:
  * highlight focused node and related nodes
  * categorizing nodes (e.g. children, visited) (attention on visually separated elements)


Design sketches:

- instead do screen shots?


Technology:

- bottom rooted tree (mention in technology section, or better in InfoVis elements when discussing TR?)



Discussion:

- consequences of logic choice (but this doesn't have to be made ahead of time... the tool can handle anything that can be written, although it doesn't check correctness)
- reasoning direction (forward more natural, but backward more conducive to automated reasoning and more standard reading for logic programs)
- impact of different traversals on cognition
- future work: hiding subtrees, structure view, (GUI builder)





Proposal notes:
---


Reading review:

(possibly copy some to infovis elements, remainder likely to future work)

- Herman et al. paper: techniques for visualizing trees
  * TR algorithm: visually rooted tree, unlike other space-saving layouts;
    + proof tree drawings must adhere to a specific structure
    + inverted so root is at the bottom
    + TR vertically aligns nodes at the same depth in a proof
  * incremental exploration and navigation to display only a subtree (future work)
  * focus+context?
- Ware: colour in visualization
  * used to highlight focused node
  * in proof walk-through, explain and justify colouring of nodes in past, colouring of children
    + want reader to focus mostly on focused node, slightly on future, not at all on past
- Figueiras taxonomy of interaction
  * we use abstract/elaborate (future), select, overview/explore
- Duval discussion of opinions on visualizations
  * interaction elevates visualization to provide comprehension, etc
- Lin and Yang facets of proof comprehension
- Yie et al. on processes for gaining insight
  * discuss how each process leads to insight in this project


Problem domain:

DONE


Use of visualization:

DONE


Design outline (approach):

- description of inference rules (for intro or logic background or conclusion)
- sequent
- natural deduction examples come from Huth and Ryan
- in TR algorithm, can depend on root of tree being in the same location
- discussion of traversal choice

(possibly copy some paragraphs?)


Design outline (technology):

DONE
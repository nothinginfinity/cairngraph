# CairnGraph Vision

CairnGraph is a visual operating system for CairnStone.

CairnStone compresses, stores, indexes, verifies, and links knowledge. CairnGraph makes that knowledge visible, navigable, and explainable.

## Why it exists

Most diagrams are decorative. CairnGraph diagrams must be evidentiary.

A CairnGraph node is not just a label. It is a doorway into:

- a stone hash
- a chain
- a HEAD marker
- a source file
- an exact ref
- a line window
- a receipt
- a commit
- a workflow
- a verification event
- a graph edge

## Design principles

### Grounded before inferred

If CairnStone has a chain manifest, HEAD, refs, or edge data, CairnGraph must use it before inference.

### HEAD before timestamps

The canonical node is the graph HEAD, not the newest timestamp.

### Evidence in every node

A node without evidence is allowed only when explicitly marked as inferred.

### Blast radius is a first-class view

Impact analysis should be visible, not hidden inside logs or prose.

### Navigation is the product

A diagram is useful only when it lets the user move through the graph.

## North star

A user should be able to click any node and answer:

Where did this come from?
What does it affect?
What verifies it?
What superseded it?
What does it reference?
What exact source window does it represent?

# Node Types

## Canonical node kinds

- `chain`
- `head`
- `stone`
- `ref`
- `raw_source`
- `file`
- `commit`
- `receipt`
- `workflow`
- `test`
- `deployment`
- `diagram`
- `agent`
- `byte_bundle`
- `verification`
- `inferred`

## Stone node

A stone node should include:

- hash
- short_hash
- title
- chain
- is_head
- lod5
- lod4 when available
- repo
- path
- commit
- related count
- ref count

## Ref node

A ref node should include:

- ref_id
- stone_hash
- path
- line_start
- line_end
- keywords
- preview
- raw_key

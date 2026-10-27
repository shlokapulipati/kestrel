// Checks the catalog files against their schemas and a few extra rules.
// Run with: npm run catalog:check
import { readFileSync } from "node:fs"
import path from "node:path"
import Ajv from "ajv"

const root = path.resolve(import.meta.dirname, "..")
const readJson = (relativePath) =>
  JSON.parse(readFileSync(path.join(root, relativePath), "utf8"))

const ajv = new Ajv({ allErrors: true })
const problems = []

function checkSchema(label, schemaPath, dataPath) {
  const validate = ajv.compile(readJson(schemaPath))
  const data = readJson(dataPath)
  if (!validate(data)) {
    for (const error of validate.errors ?? []) {
      const where = error.instancePath || "(top level)"
      problems.push(`${label}: ${where} ${error.message}`)
    }
  }
  return data
}

const catalog = checkSchema(
  "tools.json",
  "catalog/tools.schema.json",
  "catalog/tools.json",
)
const versions = checkSchema(
  "versions.sample.json",
  "catalog/versions.schema.json",
  "catalog/versions.sample.json",
)

// Extra rules, only meaningful when the shapes above are valid.
if (problems.length === 0) {
  const categoryIds = new Set()
  for (const category of catalog.categories) {
    if (categoryIds.has(category.id)) {
      problems.push(`duplicate category id "${category.id}"`)
    }
    categoryIds.add(category.id)
  }

  const toolIds = new Set()
  for (const tool of catalog.tools) {
    if (toolIds.has(tool.id)) problems.push(`duplicate tool id "${tool.id}"`)
    toolIds.add(tool.id)

    if (!categoryIds.has(tool.category)) {
      problems.push(`tool "${tool.id}" uses unknown category "${tool.category}"`)
    }

    try {
      const pattern = new RegExp(tool.detection.versionPattern)
      if (!tool.detection.versionPattern.includes("(")) {
        problems.push(`tool "${tool.id}": versionPattern needs a capture group`)
      }
      void pattern
    } catch {
      problems.push(`tool "${tool.id}": versionPattern is not a valid regex`)
    }

    for (const platform of tool.platforms) {
      if (platform.status === "supported" && platform.installMethods.length === 0) {
        problems.push(
          `tool "${tool.id}": a platform marked "supported" has no install method`,
        )
      }
    }
  }

  for (const toolId of Object.keys(versions.tools)) {
    if (!toolIds.has(toolId)) {
      problems.push(`versions file lists unknown tool "${toolId}"`)
    }
  }
}

if (problems.length > 0) {
  console.error("Catalog check FAILED:")
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(
  `Catalog OK: ${catalog.tools.length} tools, ${catalog.categories.length} categories ` +
    `(tools: ${catalog.dataStatus}, versions: ${versions.dataStatus})`,
)
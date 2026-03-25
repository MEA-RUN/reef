const { writeFileSync, readdirSync, existsSync, readFileSync } = require('fs')
const { join } = require('path')

/**
 * Scan public directory for tools and generate metadata
 */
function scanPublicTools() {
  const publicDir = join(process.cwd(), 'public', "tools")
  const tools = []

  try {
    const entries = readdirSync(publicDir, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

      const toolPath = join(publicDir, entry.name)
      const indexPath = join(toolPath, 'index.html')

      if (existsSync(indexPath)) {
        let toolMetadata = {
          id: entry.name,
          name: entry.name.charAt(0).toUpperCase() + entry.name.slice(1),
          version: '1.0.0',
          category: 'tool'
        }

        const metadataPath = join(toolPath, 'metadata.json')
        if (existsSync(metadataPath)) {
          try {
            const metadataContent = readFileSync(metadataPath, 'utf-8')
            const parsed = JSON.parse(metadataContent)
            toolMetadata = { ...toolMetadata, ...parsed }
          } catch (err) {
            console.warn(`Failed to parse metadata for ${entry.name}:`, err)
          }
        }

        tools.push({
          id: toolMetadata.id || entry.name,
          name: toolMetadata.name || entry.name,
          icon: toolMetadata.icon || 'i-heroicons-cube',
          description: toolMetadata.description || `Interactive ${entry.name} tool`,
          githubUrl: toolMetadata.githubUrl || '',
          version: toolMetadata.version || '1.0.0',
          category: toolMetadata.category || 'tool',
          path: `/${entry.name}/index.html`,
          localPath: `public/tools/${entry.name}`
        })
      }
    }

    return {
      title: 'Reef Documentation Template',
      description: 'Interactive documentation template with tool support',
      tools,
      assets: {
        logo: null,
        images: []
      }
    }
  } catch (err) {
    console.error('Failed to scan public directory:', err)
    return {
      title: 'Reef Documentation Template',
      description: 'Interactive documentation template with tool support',
      tools: [],
      assets: { logo: null, images: [] }
    }
  }
}

/**
 * Generate tools.json in public/ directory
 */
function generateToolsMetadata() {
  console.log('Generating tools metadata...')

  const metadata = scanPublicTools()
  const outputPath = join(process.cwd(), 'public', 'tools', 'manifests.json')

  writeFileSync(outputPath, JSON.stringify(metadata, null, 2))

  console.log(`✓ Generated manifests.json with ${metadata.tools.length} tools`)
  if (metadata.tools.length > 0) {
    console.log('Tools found:', metadata.tools.map(t => t.name).join(', '))
  }
}

// Run the generation
generateToolsMetadata()

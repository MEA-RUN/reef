#!/usr/bin/env node

/**
 * Script to download tools from GitHub based on metadata.json
 * Usage: node download-tools.js <path-to-metadata.json>
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function downloadTools(metadataPath) {
  // Read metadata
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

  console.log(`Processing ${metadata.tools.length} tools...`);

  for (const tool of metadata.tools) {
    console.log(`\nProcessing tool: ${tool.name}`);

    // Create tool directory
    const toolDir = path.join('public', 'tools', tool.id);
    fs.mkdirSync(toolDir, { recursive: true });

    // Check if tool has local files (in public/ directory)
    const localToolPath = path.join('public', tool.id);
    if (fs.existsSync(localToolPath) && fs.statSync(localToolPath).isDirectory()) {
      console.log(`  Found local tool at: ${localToolPath}`);
      // Copy local files to tools directory
      const files = fs.readdirSync(localToolPath);
      for (const file of files) {
        const srcPath = path.join(localToolPath, file);
        const destPath = path.join(toolDir, file);

        if (fs.statSync(srcPath).isDirectory()) {
          // Recursively copy directory
          fs.cpSync(srcPath, destPath, { recursive: true });
          console.log(`  ✓ Copied directory: ${file}`);
        } else {
          fs.copyFileSync(srcPath, destPath);
          console.log(`  ✓ Copied file: ${file}`);
        }
      }
      continue;
    }

    // If tool has files specified, download them from GitHub
    if (tool.files && tool.files.length > 0) {
      for (const file of tool.files) {
        // Construct GitHub raw URL
        // Example: https://raw.githubusercontent.com/owner/repo/main/path/to/file
        const repoMatch = tool.githubUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
        if (!repoMatch) {
          console.error(`  Invalid GitHub URL: ${tool.githubUrl}`);
          continue;
        }

        const repo = repoMatch[1];
        const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${file}`;
        const destPath = path.join(toolDir, path.basename(file));

        console.log(`  Downloading: ${file}`);
        try {
          await downloadFile(rawUrl, destPath);
          console.log(`  ✓ Downloaded: ${path.basename(file)}`);
        } catch (err) {
          console.error(`  ✗ Failed to download ${file}:`, err.message);
        }
      }
    } else {
      // If no specific files, create a metadata file
      const toolMetadata = {
        id: tool.id,
        name: tool.name,
        version: tool.version,
        githubUrl: tool.githubUrl,
        description: tool.description
      };

      fs.writeFileSync(
        path.join(toolDir, 'metadata.json'),
        JSON.stringify(toolMetadata, null, 2)
      );
      console.log(`  ✓ Created metadata file`);
    }
  }

  console.log('\n✓ All tools processed successfully');

  // Save processed metadata
  const processedMetadata = {
    ...metadata,
    processedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    'public/subject-metadata.json',
    JSON.stringify(processedMetadata, null, 2)
  );

  console.log('✓ Saved processed metadata to public/subject-metadata.json');
}

// Main execution
const metadataPath = process.argv[2];

if (!metadataPath) {
  console.error('Error: Please provide path to metadata.json');
  console.error('Usage: node download-tools.js <path-to-metadata.json>');
  process.exit(1);
}

if (!fs.existsSync(metadataPath)) {
  console.error(`Error: File not found: ${metadataPath}`);
  process.exit(1);
}

downloadTools(metadataPath)
  .then(() => {
    console.log('\n✓ Build process completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n✗ Build process failed:', err);
    process.exit(1);
  });

/**
 * SOURCE VERIFICATION TEST SUITE
 * 
 * This script fetches each source URL and verifies that the quoted text
 * actually appears on the page.
 * 
 * Usage: node test-sources.js
 */

const https = require('https');
const http = require('http');
const { SOURCES } = require('./sources.js');
const includeBackup = process.argv.includes('--include-backup');
let BACKUP_SOURCES = {};
if (includeBackup) {
    try {
        ({ BACKUP_SOURCES } = require('./sources-backup.js'));
    } catch (error) {
        console.error('Failed to load sources-backup.js:', error.message);
        process.exit(1);
    }
}

// ANSI color codes for terminal output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    dim: '\x1b[2m'
};

// Results tracking
const results = {
    passed: [],
    failed: [],
    skipped: [],
    errors: []
};

/**
 * Normalize text for comparison
 * Removes extra whitespace, lowercases, removes punctuation variations
 */
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/['']/g, "'")
        .replace(/[""]/g, '"')
        .trim();
}

/**
 * Check if quote exists in page content
 * 
 * Quotes can contain "..." to indicate separate parts that must all exist.
 * Example: "Risk per 10,000 ... Receptive vaginal ... 8"
 * Each part separated by "..." is verified independently.
 */
function quoteExistsInContent(quote, content) {
    const normalizedContent = normalizeText(content);
    
    // Split quote by "..." to get parts that must all be verified
    const parts = quote.split('...').map(p => p.trim()).filter(p => p.length > 0);
    
    if (parts.length === 0) {
        return { found: false, method: 'empty-quote', missingParts: [] };
    }
    
    const missingParts = [];
    
    for (const part of parts) {
        const normalizedPart = normalizeText(part);
        if (!normalizedContent.includes(normalizedPart)) {
            missingParts.push(part);
        }
    }
    
    if (missingParts.length === 0) {
        return { 
            found: true, 
            method: parts.length > 1 ? 'all-parts-found' : 'exact',
            partsVerified: parts.length
        };
    } else {
        return { 
            found: false, 
            method: 'missing-parts',
            missingParts: missingParts,
            partsFound: parts.length - missingParts.length,
            partsTotal: parts.length
        };
    }
}

/**
 * Fetch a webpage and return its text content
 */
function fetchPageContent(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SourceVerifier/1.0)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: 15000
        };
        
        const req = protocol.get(url, options, (res) => {
            // Handle redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                fetchPageContent(res.headers.location).then(resolve).catch(reject);
                return;
            }
            
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode}`));
                return;
            }
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Strip HTML tags to get text content
                const textContent = data
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'");
                
                resolve(textContent);
            });
        });
        
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

/**
 * Test a single source
 */
async function testSource(source) {
    const { id, name, url, quote, type } = source;
    
    console.log(`\n${colors.blue}Testing:${colors.reset} ${name}`);
    console.log(`${colors.dim}  URL: ${url}${colors.reset}`);
    
    // Skip PDFs - can't easily verify
    if (type === 'pdf') {
        console.log(`${colors.yellow}  ⊘ SKIPPED${colors.reset} (PDF - manual verification required)`);
        results.skipped.push({ id, name, reason: 'PDF format' });
        return;
    }
    
    // Skip abstracts on PubMed - often require login for full text
    if (type === 'abstract' && url.includes('pubmed.ncbi.nlm.nih.gov')) {
        // Still try to verify against the abstract
        console.log(`${colors.dim}  (Checking abstract only)${colors.reset}`);
    }
    
    try {
        const content = await fetchPageContent(url);
        const result = quoteExistsInContent(quote, content);
        
        if (result.found) {
            const extra = result.partsVerified > 1 ? `, ${result.partsVerified} parts verified` : '';
            console.log(`${colors.green}  ✓ PASSED${colors.reset} (${result.method}${extra})`);
            results.passed.push({ id, name, method: result.method });
        } else {
            console.log(`${colors.red}  ✗ FAILED${colors.reset} - Quote not found on page`);
            if (result.missingParts && result.missingParts.length > 0) {
                console.log(`${colors.dim}  Found ${result.partsFound}/${result.partsTotal} parts. Missing:${colors.reset}`);
                result.missingParts.forEach(part => {
                    console.log(`${colors.red}    → "${part}"${colors.reset}`);
                });
            } else {
                console.log(`${colors.dim}  Expected: "${quote.substring(0, 60)}..."${colors.reset}`);
            }
            results.failed.push({ id, name, quote: quote.substring(0, 100), missingParts: result.missingParts });
        }
    } catch (error) {
        console.log(`${colors.red}  ✗ ERROR${colors.reset} - ${error.message}`);
        results.errors.push({ id, name, error: error.message });
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║          SOURCE VERIFICATION TEST SUITE                     ║');
    console.log('║          Know Your Numbers - Sexual Health                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    const sourcesToTest = includeBackup
        ? { ...SOURCES, ...BACKUP_SOURCES }
        : SOURCES;
    const backupNote = includeBackup ? ' (including backup sources)' : '';
    console.log(`\nTesting ${Object.keys(sourcesToTest).length} sources${backupNote}...\n`);
    
    const startTime = Date.now();
    
    for (const sourceId of Object.keys(sourcesToTest)) {
        await testSource(sourcesToTest[sourceId]);
        // Small delay to be respectful to servers
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('SUMMARY');
    console.log('═'.repeat(60));
    console.log(`${colors.green}Passed:${colors.reset}  ${results.passed.length}`);
    console.log(`${colors.red}Failed:${colors.reset}  ${results.failed.length}`);
    console.log(`${colors.yellow}Skipped:${colors.reset} ${results.skipped.length}`);
    console.log(`${colors.red}Errors:${colors.reset}  ${results.errors.length}`);
    console.log(`\nCompleted in ${elapsed}s`);
    
    if (results.failed.length > 0) {
        console.log(`\n${colors.red}FAILED SOURCES:${colors.reset}`);
        results.failed.forEach(f => {
            console.log(`  - ${f.name}`);
            console.log(`    ${colors.dim}Quote: "${f.quote}..."${colors.reset}`);
        });
    }
    
    if (results.errors.length > 0) {
        console.log(`\n${colors.red}ERROR SOURCES:${colors.reset}`);
        results.errors.forEach(e => {
            console.log(`  - ${e.name}: ${e.error}`);
        });
    }
    
    // Exit with error code if any failures
    if (results.failed.length > 0 || results.errors.length > 0) {
        process.exit(1);
    }
}

// Run tests
runTests().catch(error => {
    console.error('Test suite crashed:', error);
    process.exit(1);
});

const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Directory paths (relative to project root)
const PROJECT_ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(PROJECT_ROOT, '_posts');
const INDEX_FILE = path.join(PROJECT_ROOT, 'index.html');

// Read all markdown files from _posts directory
function getPostFiles() {
    if (!fs.existsSync(POSTS_DIR)) {
        console.error('_posts directory not found!');
        return [];
    }
    
    return fs.readdirSync(POSTS_DIR)
        .filter(file => file.endsWith('.md'))
        .sort()
        .reverse(); // Most recent first
}

// Parse frontmatter and content from markdown
function parseMarkdown(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { metadata: {}, content: content };
    }
    
    const frontmatter = match[1];
    const markdown = match[2];
    
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            metadata[key.trim()] = value;
        }
    });
    
    return { metadata, content: markdown };
}

// Generate HTML for blog posts list
function generateBlogHTML() {
    const postFiles = getPostFiles();
    
    if (postFiles.length === 0) {
        return '<p class="intro-text">No blog posts yet. Check back soon!</p>';
    }
    
    let html = '<ul class="post-list">\n';
    
    postFiles.forEach(file => {
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { metadata } = parseMarkdown(content);
        
        const postId = file.replace('.md', '');
        const title = metadata.title || 'Untitled Post';
        let date = metadata.date || 'No date';
        
        // Add current time and timezone if date doesn't have time
        if (date && !date.includes(':')) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const timezoneOffset = now.getTimezoneOffset();
            const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
            const offsetMinutes = Math.abs(timezoneOffset % 60);
            const offsetSign = timezoneOffset <= 0 ? '+' : '-';
            const timezoneAbbr = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
            date = `${date} ${hours}:${minutes} (${timezoneAbbr})`;
        }
        
        const excerpt = metadata.excerpt || 'No description available.';
        
        html += `
                        <li class="post-item" data-aos="fade-up">
                            <span class="post-meta">${date}</span>
                            <h2 class="post-title">
                                <a href="#" class="post-link" onclick="showBlogPost('${postId}'); return false;">${title}</a>
                            </h2>
                            <p class="post-excerpt">${excerpt}</p>
                            <a href="#" class="read-more-btn" onclick="showBlogPost('${postId}'); return false;">
                                Read more <i class="fas fa-arrow-right"></i>
                            </a>
                        </li>\n`;
    });
    
    html += '                    </ul>';
    
    return html;
}

// Generate individual blog post pages HTML
function generateBlogPostsData() {
    const postFiles = getPostFiles();
    const postsData = {};
    
    postFiles.forEach(file => {
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { metadata, content: markdown } = parseMarkdown(content);
        
        const postId = file.replace('.md', '');
        const htmlContent = marked.parse(markdown);
        
        let date = metadata.date || 'No date';
        
        // Add current time and timezone if date doesn't have time
        if (date && !date.includes(':')) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const timezoneOffset = now.getTimezoneOffset();
            const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
            const offsetMinutes = Math.abs(timezoneOffset % 60);
            const offsetSign = timezoneOffset <= 0 ? '+' : '-';
            const timezoneAbbr = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
            date = `${date} ${hours}:${minutes} (${timezoneAbbr})`;
        }
        
        postsData[postId] = {
            title: metadata.title || 'Untitled Post',
            date: date,
            content: htmlContent
        };
    });
    
    return postsData;
}

// Update index.html with generated blog content
function updateIndexHTML() {
    let indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');
    
    // Generate blog list HTML
    const blogListHTML = generateBlogHTML();
    
    // Replace blog list section
    const blogListRegex = /(<!-- BLOG_LIST_START -->)([\s\S]*?)(<!-- BLOG_LIST_END -->)/;
    if (blogListRegex.test(indexContent)) {
        indexContent = indexContent.replace(
            blogListRegex,
            `$1\n${blogListHTML}\n                    $3`
        );
    } else {
        console.warn('Blog list markers not found in index.html');
    }
    
    // Generate blog posts data for JavaScript
    const postsData = generateBlogPostsData();
    const postsDataJS = `const BLOG_POSTS = ${JSON.stringify(postsData, null, 2)};`;
    
    // Replace or add blog posts data script
    const scriptRegex = /(<!-- BLOG_DATA_START -->)([\s\S]*?)(<!-- BLOG_DATA_END -->)/;
    if (scriptRegex.test(indexContent)) {
        indexContent = indexContent.replace(
            scriptRegex,
            `$1\n        <script>\n        ${postsDataJS}\n        </script>\n        $3`
        );
    } else {
        console.warn('Blog data markers not found in index.html');
    }
    
    // Write updated content back to index.html
    fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8');
    console.log('✅ Blog content updated successfully!');
    console.log(`📝 Processed ${Object.keys(postsData).length} blog post(s)`);
}

// Run the build
try {
    updateIndexHTML();
} catch (error) {
    console.error('❌ Error building blog:', error.message);
    process.exit(1);
}

const fs = require('fs');

// Configuration
const GITHUB_USERNAME = 'davidecantavenera'; // Change this to your GitHub username
const INDEX_FILE = './index.html';

// Fetch repositories from GitHub API
async function fetchGitHubRepos() {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Filter and sort repos (public only, exclude forks if desired)
        return repos
            .filter(repo => !repo.private && !repo.fork) // Only public, non-forked repos
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Most recently updated first
            .slice(0, 12); // Limit to 12 repos
    } catch (error) {
        console.error('Error fetching GitHub repos:', error.message);
        return [];
    }
}

// Generate HTML for repositories
function generateReposHTML(repos) {
    if (repos.length === 0) {
        return '<p class="intro-text">No repositories found.</p>';
    }
    
    let html = '<div class="repo-grid">\n';
    
    repos.forEach(repo => {
        const name = repo.name;
        const description = repo.description || 'No description available';
        const url = repo.html_url;
        const language = repo.language || 'Unknown';
        const stars = repo.stargazers_count;
        const forks = repo.forks_count;
        const watchers = repo.watchers_count;
        const updated = new Date(repo.updated_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Get language color (simplified)
        const languageColors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'TypeScript': '#2b7489',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C': '#555555',
            'R': '#198CE7',
            'Shell': '#89e051',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Ruby': '#701516',
            'Jupyter Notebook': '#DA5B0B'
        };
        const langColor = languageColors[language] || '#8b949e';
        
        html += `
                        <div class="repo-card glass-panel" data-aos="fade-up">
                            <div class="repo-header">
                                <h3>
                                    <a href="${url}" target="_blank" rel="noopener noreferrer">
                                        <i class="fab fa-github"></i> ${name}
                                    </a>
                                </h3>
                            </div>
                            <p class="repo-description">${description}</p>
                            <div class="repo-stats">
                                <span class="repo-language">
                                    <span class="language-dot" style="background-color: ${langColor};"></span>
                                    ${language}
                                </span>
                                <span class="repo-stat">
                                    <i class="fas fa-star"></i> ${stars}
                                </span>
                                <span class="repo-stat">
                                    <i class="fas fa-code-branch"></i> ${forks}
                                </span>
                                <span class="repo-stat">
                                    <i class="fas fa-eye"></i> ${watchers}
                                </span>
                            </div>
                            <div class="repo-footer">
                                <span class="repo-updated">Updated ${updated}</span>
                            </div>
                        </div>\n`;
    });
    
    html += '                    </div>';
    
    return html;
}

// Update index.html with repositories
async function updateIndexHTML() {
    console.log(`📡 Fetching repositories for ${GITHUB_USERNAME}...`);
    
    const repos = await fetchGitHubRepos();
    
    if (repos.length === 0) {
        console.log('⚠️  No repositories found or API error');
        return;
    }
    
    console.log(`✅ Found ${repos.length} repositories`);
    
    let indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');
    
    // Generate repos HTML
    const reposHTML = generateReposHTML(repos);
    
    // Replace repos section
    const reposRegex = /(<!-- REPOS_START -->)([\s\S]*?)(<!-- REPOS_END -->)/;
    if (reposRegex.test(indexContent)) {
        indexContent = indexContent.replace(
            reposRegex,
            `$1\n${reposHTML}\n                    $3`
        );
        
        fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8');
        console.log('✅ Repositories updated successfully!');
    } else {
        console.warn('⚠️  Repository markers not found in index.html');
        console.log('Add <!-- REPOS_START --> and <!-- REPOS_END --> markers in your code section');
    }
}

// Run the update
updateIndexHTML().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});

// 마크다운 에디터 및 미리보기 기능

class BlogEditor {
  constructor() {
    this.editor = document.getElementById('markdownEditor');
    this.preview = document.getElementById('previewContent');
    this.titleInput = document.getElementById('postTitle');
    this.tagsInput = document.getElementById('postTags');
    this.previewPanel = document.getElementById('previewPanel');
    
    this.init();
  }

  init() {
    // 이벤트 리스너 설정
    this.editor.addEventListener('input', () => this.updatePreview());
    this.titleInput.addEventListener('input', () => this.updatePreview());
    
    // 버튼 이벤트
    document.getElementById('previewBtn').addEventListener('click', () => this.togglePreview());
    document.getElementById('closePreviewBtn').addEventListener('click', () => this.hidePreview());
    document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('saveBtn').addEventListener('click', () => this.showSaveModal());
    document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPost());
    
    // 모달 이벤트
    document.getElementById('closeModal').addEventListener('click', () => this.hideSaveModal());
    document.getElementById('cancelSaveBtn').addEventListener('click', () => this.hideSaveModal());
    document.getElementById('saveToGitHubBtn').addEventListener('click', () => this.saveToGitHub());
    document.getElementById('closePostsModal').addEventListener('click', () => this.hidePostsModal());
    
    // 포스트 목록 버튼
    const postsBtn = document.getElementById('loadPostsBtn');
    if (postsBtn) {
      postsBtn.addEventListener('click', () => this.showPostsModal());
    }
    
    // 도움말 버튼
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => this.showHelpModal());
    }
    
    const closeHelpBtn = document.getElementById('closeHelpModal');
    if (closeHelpBtn) {
      closeHelpBtn.addEventListener('click', () => this.hideHelpModal());
    }
    
    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S: 저장
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.showSaveModal();
      }
      // Ctrl/Cmd + P: 미리보기 토글
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        this.togglePreview();
      }
      // Ctrl/Cmd + D: 다운로드
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        this.downloadPost();
      }
      // Esc: 모달 닫기
      if (e.key === 'Escape') {
        this.hideSaveModal();
        this.hidePostsModal();
        this.hideHelpModal();
      }
    });
    
    // 로컬 스토리지에서 복원
    this.loadFromLocalStorage();
    
    // 자동 저장
    let saveInterval = setInterval(() => {
      if (this.editor.value || this.titleInput.value) {
        this.saveToLocalStorage();
        this.showAutoSaveNotification();
      }
    }, 30000); // 30초마다
    
    // 마크다운 설정
    marked.setOptions({
      breaks: true,
      gfm: true,
      highlight: function(code, lang) {
        if (lang && window.Prism) {
          return Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup, lang);
        }
        return code;
      }
    });
  }

  updatePreview() {
    const markdown = this.editor.value;
    const title = this.titleInput.value;
    const tags = this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    
    let html = '';
    
    if (title) {
      html += `<h1>${this.escapeHtml(title)}</h1>`;
    }
    
    if (tags.length > 0) {
      html += `<div class="preview-tags">${tags.map(t => `<span class="tag">${this.escapeHtml(t)}</span>`).join('')}</div>`;
    }
    
    if (markdown) {
      const parsed = marked.parse(markdown);
      html += DOMPurify.sanitize(parsed);
    } else {
      html += '<p class="preview-placeholder">내용을 입력하면 미리보기가 표시됩니다.</p>';
    }
    
    this.preview.innerHTML = html;
    
    // 코드 하이라이팅
    if (window.Prism) {
      Prism.highlightAllUnder(this.preview);
    }
  }

  togglePreview() {
    this.previewPanel.classList.toggle('active');
    if (this.previewPanel.classList.contains('active')) {
      this.updatePreview();
    }
  }

  hidePreview() {
    this.previewPanel.classList.remove('active');
  }

  toggleFullscreen() {
    const editorPanel = this.editor.closest('.editor-panel');
    editorPanel.classList.toggle('fullscreen');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  generateFrontMatter() {
    const title = this.titleInput.value;
    const tags = this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    const date = new Date().toISOString().split('T')[0];
    
    let frontMatter = `---
layout: post
title: "${title || 'Untitled'}"
date: ${date}`;
    
    if (tags.length > 0) {
      frontMatter += `\ntags: [${tags.map(t => `"${t}"`).join(', ')}]`;
    }
    
    frontMatter += '\n---\n\n';
    
    return frontMatter;
  }

  getPostContent() {
    return this.generateFrontMatter() + this.editor.value;
  }

  getFileName() {
    const title = this.titleInput.value || 'untitled';
    const date = new Date().toISOString().split('T')[0];
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `${date}-${slug}.md`;
  }

  downloadPost() {
    const content = this.getPostContent();
    const filename = this.getFileName();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification('파일이 다운로드되었습니다!');
  }

  showSaveModal() {
    document.getElementById('githubModal').classList.add('active');
  }

  hideSaveModal() {
    document.getElementById('githubModal').classList.remove('active');
    document.getElementById('githubToken').value = '';
  }

  async saveToGitHub() {
    const token = document.getElementById('githubToken').value.trim();
    const commitMessage = document.getElementById('commitMessage').value || '새 포스트 추가';
    
    if (!token) {
      alert('GitHub Token을 입력해주세요.');
      return;
    }

    const content = this.getPostContent();
    const filename = this.getFileName();
    const path = `_posts/${filename}`;
    
    // Base64 인코딩
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    try {
      // 먼저 파일이 존재하는지 확인
      let sha = null;
      try {
        const checkResponse = await fetch(
          `https://api.github.com/repos/black940514/black940514.github.io/contents/${path}`,
          {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );
        
        if (checkResponse.ok) {
          const fileData = await checkResponse.json();
          sha = fileData.sha;
        }
      } catch (e) {
        // 파일이 없으면 새로 생성
      }

      // 파일 업로드/업데이트
      const response = await fetch(
        `https://api.github.com/repos/black940514/black940514.github.io/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: commitMessage,
            content: encodedContent,
            ...(sha && { sha: sha })
          })
        }
      );

      if (response.ok) {
        this.showNotification('GitHub에 성공적으로 저장되었습니다!');
        this.hideSaveModal();
        this.clearLocalStorage();
        
        // 몇 초 후 페이지 새로고침
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        const error = await response.json();
        throw new Error(error.message || '저장에 실패했습니다.');
      }
    } catch (error) {
      alert(`오류: ${error.message}`);
      console.error(error);
    }
  }

  saveToLocalStorage() {
    const data = {
      title: this.titleInput.value,
      tags: this.tagsInput.value,
      content: this.editor.value,
      timestamp: Date.now()
    };
    localStorage.setItem('blogEditor_draft', JSON.stringify(data));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('blogEditor_draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // 24시간 이내의 초안만 복원
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          this.titleInput.value = data.title || '';
          this.tagsInput.value = data.tags || '';
          this.editor.value = data.content || '';
          this.updatePreview();
        } else {
          localStorage.removeItem('blogEditor_draft');
        }
      } catch (e) {
        console.error('초안 복원 실패:', e);
      }
    }
  }

  clearLocalStorage() {
    localStorage.removeItem('blogEditor_draft');
  }

  async showPostsModal() {
    const modal = document.getElementById('postsModal');
    const list = document.getElementById('postsList');
    modal.classList.add('active');
    
    list.innerHTML = '<p class="loading">로딩 중...</p>';
    
    try {
      // GitHub API로 포스트 목록 가져오기
      const response = await fetch(
        'https://api.github.com/repos/black940514/black940514.github.io/contents/_posts',
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (response.ok) {
        const files = await response.json();
        const posts = files
          .filter(file => file.name.endsWith('.md') && file.name !== 'TEMPLATE.md')
          .sort((a, b) => b.name.localeCompare(a.name));
        
        if (posts.length === 0) {
          list.innerHTML = '<p>포스트가 없습니다.</p>';
          return;
        }
        
        list.innerHTML = posts.map(post => {
          const date = post.name.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || '';
          const title = post.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
          return `
            <div class="post-item-small">
              <div class="post-item-info">
                <h4>${this.escapeHtml(title)}</h4>
                <span class="post-date">${date}</span>
              </div>
              <div class="post-item-actions">
                <button class="btn btn-sm" onclick="editor.loadPost('${post.name}')">불러오기</button>
                <a href="https://github.com/black940514/black940514.github.io/blob/main/_posts/${post.name}" 
                   target="_blank" class="btn btn-sm btn-outline">GitHub에서 보기</a>
              </div>
            </div>
          `;
        }).join('');
      } else {
        list.innerHTML = '<p>포스트 목록을 불러올 수 없습니다.</p>';
      }
    } catch (error) {
      list.innerHTML = `<p>오류: ${error.message}</p>`;
    }
  }

  hidePostsModal() {
    document.getElementById('postsModal').classList.remove('active');
  }

  showHelpModal() {
    document.getElementById('helpModal').classList.add('active');
  }

  hideHelpModal() {
    document.getElementById('helpModal').classList.remove('active');
  }

  async loadPost(filename) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/black940514/black940514.github.io/contents/_posts/${filename}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (response.ok) {
        const file = await response.json();
        const content = decodeURIComponent(escape(atob(file.content)));
        
        // Front matter 파싱
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (frontMatterMatch) {
          const frontMatter = frontMatterMatch[1];
          const body = frontMatterMatch[2];
          
          // 제목 추출
          const titleMatch = frontMatter.match(/title:\s*["'](.+?)["']/);
          if (titleMatch) {
            this.titleInput.value = titleMatch[1];
          }
          
          // 태그 추출
          const tagsMatch = frontMatter.match(/tags:\s*\[(.+?)\]/);
          if (tagsMatch) {
            const tags = tagsMatch[1].replace(/["']/g, '').split(',').map(t => t.trim()).join(', ');
            this.tagsInput.value = tags;
          }
          
          this.editor.value = body;
          this.updatePreview();
          this.hidePostsModal();
          this.showNotification('포스트를 불러왔습니다!');
        }
      } else {
        throw new Error('포스트를 불러올 수 없습니다.');
      }
    } catch (error) {
      alert(`오류: ${error.message}`);
    }
  }

  showAutoSaveNotification() {
    // 자동 저장 알림은 조용하게 (이미 저장됨 표시만)
    const existing = document.querySelector('.auto-save-indicator');
    if (existing) {
      existing.classList.add('active');
      setTimeout(() => existing.classList.remove('active'), 2000);
      return;
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'auto-save-indicator';
    indicator.textContent = '자동 저장됨';
    document.querySelector('.editor-header').appendChild(indicator);
    
    setTimeout(() => {
      indicator.classList.add('active');
      setTimeout(() => {
        indicator.classList.remove('active');
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
          }
        }, 300);
      }, 1500);
    }, 10);
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// 전역 변수로 에디터 인스턴스 저장
let editor;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  editor = new BlogEditor();
});


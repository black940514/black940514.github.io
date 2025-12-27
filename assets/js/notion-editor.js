// 노션 스타일 WYSIWYG 에디터

class NotionEditor {
  constructor() {
    this.editor = document.getElementById('notionEditor');
    this.titleInput = document.getElementById('postTitle');
    this.tagsInput = document.getElementById('postTags');
    this.toolbar = document.getElementById('toolbar');
    this.imageInput = document.getElementById('imageInput');
    this.currentPostFile = null; // 현재 수정 중인 포스트 파일명
    
    this.init();
  }

  init() {
    this.setupEditor();
    this.setupToolbar();
    this.setupKeyboardShortcuts();
    this.setupSlashCommands();
    this.setupImageUpload();
    this.loadFromLocalStorage();
    
    // 자동 저장
    setInterval(() => this.saveToLocalStorage(), 30000);
  }

  setupEditor() {
    // 플레이스홀더
    this.updatePlaceholder();
    this.editor.addEventListener('input', () => {
      this.updatePlaceholder();
      this.saveToLocalStorage();
    });
    
    // 포커스 스타일
    this.editor.addEventListener('focus', () => {
      this.editor.classList.add('focused');
    });
    
    this.editor.addEventListener('blur', () => {
      this.editor.classList.remove('focused');
    });
  }

  updatePlaceholder() {
    if (this.editor.textContent.trim() === '') {
      this.editor.classList.add('empty');
    } else {
      this.editor.classList.remove('empty');
    }
  }

  setupToolbar() {
    this.toolbar.addEventListener('click', (e) => {
      const btn = e.target.closest('.toolbar-btn');
      if (!btn) return;
      
      const command = btn.dataset.command;
      const level = btn.dataset.level;
      
      e.preventDefault();
      document.execCommand('formatBlock', false, null);
      
      switch(command) {
        case 'bold':
          document.execCommand('bold', false, null);
          break;
        case 'italic':
          document.execCommand('italic', false, null);
          break;
        case 'underline':
          document.execCommand('underline', false, null);
          break;
        case 'strike':
          document.execCommand('strikeThrough', false, null);
          break;
        case 'heading':
          const headingTag = `h${level}`;
          document.execCommand('formatBlock', false, headingTag);
          break;
        case 'bulletList':
          document.execCommand('insertUnorderedList', false, null);
          break;
        case 'orderedList':
          document.execCommand('insertOrderedList', false, null);
          break;
        case 'blockquote':
          document.execCommand('formatBlock', false, 'blockquote');
          break;
        case 'codeBlock':
          this.insertCodeBlock();
          break;
        case 'image':
          this.insertImage();
          break;
        case 'link':
          this.insertLink();
          break;
        case 'fullscreen':
          this.toggleFullscreen();
          break;
      }
      
      this.editor.focus();
    });
  }

  setupKeyboardShortcuts() {
    this.editor.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + B: 굵게
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        document.execCommand('bold', false, null);
      }
      // Ctrl/Cmd + I: 기울임
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        document.execCommand('italic', false, null);
      }
      // Ctrl/Cmd + U: 밑줄
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        document.execCommand('underline', false, null);
      }
      // Ctrl/Cmd + S: 저장
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        editor.showSaveModal();
      }
      // Ctrl/Cmd + D: 다운로드
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        editor.downloadPost();
      }
      // Tab: 들여쓰기
      if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('indent', false, null);
      }
      // Shift + Tab: 내어쓰기
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        document.execCommand('outdent', false, null);
      }
    });
  }

  setupSlashCommands() {
    let slashCommand = '';
    let isSlashMode = false;
    
    this.editor.addEventListener('input', (e) => {
      const text = this.editor.textContent;
      const lastChar = text[text.length - 1];
      
      if (lastChar === '/') {
        isSlashMode = true;
        this.showSlashMenu();
      } else if (isSlashMode) {
        if (lastChar === ' ' || lastChar === '\n') {
          this.executeSlashCommand(slashCommand);
          isSlashMode = false;
          this.hideSlashMenu();
          slashCommand = '';
        } else {
          slashCommand += lastChar;
          this.updateSlashMenu(slashCommand);
        }
      }
    });
  }

  showSlashMenu() {
    // 슬래시 메뉴는 나중에 구현
  }

  hideSlashMenu() {
    // 슬래시 메뉴 숨기기
  }

  updateSlashMenu(command) {
    // 슬래시 메뉴 업데이트
  }

  executeSlashCommand(command) {
    const commands = {
      'h1': () => document.execCommand('formatBlock', false, 'h1'),
      'h2': () => document.execCommand('formatBlock', false, 'h2'),
      'h3': () => document.execCommand('formatBlock', false, 'h3'),
      'quote': () => document.execCommand('formatBlock', false, 'blockquote'),
      'code': () => this.insertCodeBlock(),
      'ul': () => document.execCommand('insertUnorderedList', false, null),
      'ol': () => document.execCommand('insertOrderedList', false, null),
    };
    
    if (commands[command]) {
      commands[command]();
    }
  }

  insertCodeBlock() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const codeBlock = document.createElement('pre');
    codeBlock.className = 'code-block';
    codeBlock.contentEditable = 'true';
    codeBlock.textContent = selection.toString() || '코드를 입력하세요...';
    range.deleteContents();
    range.insertNode(codeBlock);
    codeBlock.focus();
  }

  insertLink() {
    const url = prompt('링크 URL을 입력하세요:');
    if (url) {
      const text = window.getSelection().toString() || url;
      const link = document.createElement('a');
      link.href = url;
      link.textContent = text;
      link.target = '_blank';
      link.rel = 'noopener';
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(link);
      }
    }
  }

  toggleFullscreen() {
    const panel = this.editor.closest('.editor-panel');
    panel.classList.toggle('fullscreen');
  }

  getContent() {
    return this.editor.innerHTML;
  }

  setContent(html) {
    this.editor.innerHTML = html;
    this.updatePlaceholder();
  }

  getMarkdown() {
    // HTML을 마크다운으로 변환
    let markdown = this.editor.innerHTML;
    
    // 제목 변환
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    
    // 강조 변환
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    markdown = markdown.replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>');
    markdown = markdown.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
    
    // 링크 변환
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    
    // 리스트 변환
    markdown = markdown.replace(/<ul[^>]*>/gi, '');
    markdown = markdown.replace(/<\/ul>/gi, '\n');
    markdown = markdown.replace(/<ol[^>]*>/gi, '');
    markdown = markdown.replace(/<\/ol>/gi, '\n');
    markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    
    // 인용문 변환
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');
    
    // 코드 블록 변환
    markdown = markdown.replace(/<pre[^>]*class="code-block"[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n\n');
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    
    // 줄바꿈 정리
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    markdown = markdown.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');
    
    // HTML 태그 제거
    markdown = markdown.replace(/<[^>]+>/g, '');
    
    // 연속된 줄바꿈 정리
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();
    
    return markdown;
  }

  saveToLocalStorage() {
    const data = {
      title: this.titleInput.value,
      tags: this.tagsInput.value,
      content: this.getContent(),
      timestamp: Date.now()
    };
    localStorage.setItem('notionEditor_draft', JSON.stringify(data));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('notionEditor_draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          this.titleInput.value = data.title || '';
          this.tagsInput.value = data.tags || '';
          if (data.content) {
            this.setContent(data.content);
          }
        } else {
          localStorage.removeItem('notionEditor_draft');
        }
      } catch (e) {
        console.error('초안 복원 실패:', e);
      }
    }
  }

  clearLocalStorage() {
    localStorage.removeItem('notionEditor_draft');
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
    return this.generateFrontMatter() + this.getMarkdown();
  }

  getFileName() {
    // 수정 모드면 기존 파일명 사용
    if (this.currentPostFile) {
      return this.currentPostFile;
    }
    
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
    this.loadTokenFromLocalStorage();
  }

  hideSaveModal() {
    document.getElementById('githubModal').classList.remove('active');
    if (!document.getElementById('saveToken').checked) {
      document.getElementById('githubToken').value = '';
    }
  }

  saveTokenToLocalStorage(token) {
    localStorage.setItem('github_token', token);
  }

  loadTokenFromLocalStorage() {
    const token = localStorage.getItem('github_token');
    if (token) {
      document.getElementById('githubToken').value = token;
      document.getElementById('saveToken').checked = true;
    } else {
      document.getElementById('saveToken').checked = false;
    }
  }

  removeTokenFromLocalStorage() {
    localStorage.removeItem('github_token');
  }

  async saveToGitHub() {
    const token = document.getElementById('githubToken').value.trim();
    let commitMessage = document.getElementById('commitMessage').value;
    
    // 커밋 메시지 자동 설정
    if (!commitMessage) {
      commitMessage = this.currentPostFile ? '포스트 수정' : '새 포스트 추가';
      document.getElementById('commitMessage').value = commitMessage;
    }
    
    const saveToken = document.getElementById('saveToken').checked;
    
    if (!token) {
      alert('GitHub Token을 입력해주세요.');
      return;
    }

    if (saveToken) {
      this.saveTokenToLocalStorage(token);
    } else {
      this.removeTokenFromLocalStorage();
    }

    const content = this.getPostContent();
    const filename = this.getFileName();
    const path = `_posts/${filename}`;
    
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    try {
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
        const action = this.currentPostFile ? '수정' : '저장';
        this.showNotification(`GitHub에 성공적으로 ${action}되었습니다!`);
        this.hideSaveModal();
        this.clearLocalStorage();
        this.currentPostFile = null; // 수정 모드 해제
        
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

  async showPostsModal() {
    const modal = document.getElementById('postsModal');
    const list = document.getElementById('postsList');
    modal.classList.add('active');
    
    list.innerHTML = '<p class="loading">로딩 중...</p>';
    
    try {
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
        
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (frontMatterMatch) {
          const frontMatter = frontMatterMatch[1];
          const body = frontMatterMatch[2];
          
          const titleMatch = frontMatter.match(/title:\s*["'](.+?)["']/);
          if (titleMatch) {
            this.titleInput.value = titleMatch[1];
          }
          
          const tagsMatch = frontMatter.match(/tags:\s*\[(.+?)\]/);
          if (tagsMatch) {
            const tags = tagsMatch[1].replace(/["']/g, '').split(',').map(t => t.trim()).join(', ');
            this.tagsInput.value = tags;
          }
          
          // 마크다운을 HTML로 변환
          const html = this.markdownToHtml(body);
          this.setContent(html);
          
          // 수정 모드 설정
          this.currentPostFile = filename;
          this.updateEditModeIndicator();
          
          this.hidePostsModal();
          this.showNotification('포스트를 불러왔습니다! 수정 모드로 전환되었습니다.');
        }
      } else {
        throw new Error('포스트를 불러올 수 없습니다.');
      }
    } catch (error) {
      alert(`오류: ${error.message}`);
    }
  }

  updateEditModeIndicator() {
    // 헤더에 수정 모드 표시
    const header = document.querySelector('.editor-header h1');
    if (this.currentPostFile) {
      if (!header.querySelector('.edit-badge')) {
        const badge = document.createElement('span');
        badge.className = 'edit-badge';
        badge.textContent = '수정 모드';
        header.appendChild(badge);
      }
    } else {
      const badge = header.querySelector('.edit-badge');
      if (badge) badge.remove();
    }
  }

  markdownToHtml(markdown) {
    // 간단한 마크다운 파서
    let html = markdown;
    
    // 코드 블록
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre class="code-block">$2</pre>');
    
    // 인라인 코드
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 이미지
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; display: block;">');
    
    // 제목
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // 강조
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');
    
    // 링크
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // 인용문
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // 리스트
    html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // 줄바꿈
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    html = '<p>' + html + '</p>';
    
    return html;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// 전역 변수
let editor;

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
  editor = new NotionEditor();
  
  // 버튼 이벤트
  document.getElementById('saveBtn').addEventListener('click', () => editor.showSaveModal());
  document.getElementById('downloadBtn').addEventListener('click', () => editor.downloadPost());
  document.getElementById('loadPostsBtn').addEventListener('click', () => editor.showPostsModal());
  
  // 모달 이벤트
  document.getElementById('closeModal').addEventListener('click', () => editor.hideSaveModal());
  document.getElementById('cancelSaveBtn').addEventListener('click', () => editor.hideSaveModal());
  document.getElementById('saveToGitHubBtn').addEventListener('click', () => editor.saveToGitHub());
  document.getElementById('closePostsModal').addEventListener('click', () => editor.hidePostsModal());
  
  // Esc 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      editor.hideSaveModal();
      editor.hidePostsModal();
    }
  });
});


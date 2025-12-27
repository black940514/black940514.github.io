#!/usr/bin/env python3
"""
Jekyll 블로그 포스트 생성 스크립트
사용법: python scripts/new_post.py "포스트 제목" [태그1,태그2,...]
"""

import sys
import os
from datetime import datetime
import re

def slugify(text):
    """제목을 파일명으로 변환"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def create_post(title, tags=None):
    """새 포스트 파일 생성"""
    # 날짜 형식: YYYY-MM-DD
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    # 파일명 생성
    slug = slugify(title)
    filename = f"{date_str}-{slug}.md"
    
    # _posts 디렉토리 경로
    posts_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "_posts")
    os.makedirs(posts_dir, exist_ok=True)
    
    filepath = os.path.join(posts_dir, filename)
    
    # 태그 처리
    if tags:
        if isinstance(tags, str):
            tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
        else:
            tag_list = tags
        tags_yaml = f"tags: {tag_list}"
    else:
        tag_list = []
        tags_yaml = ""
    
    # 포스트 템플릿
    front_matter = f"""---
layout: post
title: "{title}"
date: {date_str}"""
    
    if tags_yaml:
        front_matter += f"\n{tags_yaml}"
    
    front_matter += "\n---"
    
    template = f"""{front_matter}


# {title}

여기에 포스트 내용을 작성하세요.

## 소제목

본문 내용...

```python
# 코드 예제
def example():
    print("Hello, World!")
```

## 마무리

감사합니다!
"""
    
    # 파일 생성
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(template)
    
    print(f"✅ 포스트가 생성되었습니다: {filepath}")
    print(f"📝 파일을 열어서 내용을 작성하세요!")
    
    return filepath

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python scripts/new_post.py \"포스트 제목\" [태그1,태그2,...]")
        print("\n예시:")
        print('  python scripts/new_post.py "Python으로 시작하는 AI 개발" "Python,AI,개발"')
        sys.exit(1)
    
    title = sys.argv[1]
    tags = sys.argv[2] if len(sys.argv) > 2 else None
    
    create_post(title, tags)


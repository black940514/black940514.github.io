# AI Developer Blog

AI 개발자 블로그 - Jekyll 기반 GitHub Pages 블로그

## 로컬에서 실행하기

```bash
# 의존성 설치
bundle install

# 로컬 서버 실행
bundle exec jekyll serve

# 브라우저에서 http://localhost:4000 접속
```

## 포스트 작성하기

### 방법 1: 스크립트 사용 (추천)

**Python 스크립트:**
```bash
python scripts/new_post.py "포스트 제목" "태그1,태그2,태그3"
```

**Shell 스크립트:**
```bash
./scripts/new_post.sh "포스트 제목" "태그1,태그2,태그3"
```

### 방법 2: 직접 작성

`_posts/` 디렉토리에 `YYYY-MM-DD-post-title.md` 형식으로 파일을 생성하세요.

템플릿은 `_posts/TEMPLATE.md`를 참고하세요.

```markdown
---
layout: post
title: "포스트 제목"
date: 2024-01-01
tags: [태그1, 태그2]
---

포스트 내용...
```

## 배포

GitHub에 푸시하면 자동으로 GitHub Pages에 배포됩니다.

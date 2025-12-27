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

### 방법 1: 웹 에디터 사용 (가장 편리) ⭐

블로그 내에서 직접 포스트를 작성할 수 있습니다!

1. 블로그에서 **"작성하기"** 메뉴 클릭
2. 제목, 태그, 내용 입력
3. 실시간 미리보기로 확인
4. **저장** 버튼 클릭 → GitHub Token 입력 → 자동 저장
   - 또는 **다운로드** 버튼으로 파일 다운로드 후 수동 커밋

**주요 기능:**
- ✅ 실시간 마크다운 미리보기
- ✅ 자동 저장 (로컬 스토리지, 30초마다)
- ✅ GitHub에 직접 저장 (Personal Access Token 필요)
- ✅ 기존 포스트 불러오기 및 편집
- ✅ 파일 다운로드
- ✅ 전체화면 모드
- ✅ 코드 하이라이팅

**GitHub Token 생성:**
1. [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. "Generate new token (classic)" 클릭
3. `repo` 권한 체크
4. 토큰 생성 후 복사

### 방법 2: 스크립트 사용

**Python 스크립트:**
```bash
python scripts/new_post.py "포스트 제목" "태그1,태그2,태그3"
```

**Shell 스크립트:**
```bash
./scripts/new_post.sh "포스트 제목" "태그1,태그2,태그3"
```

### 방법 3: 직접 작성

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

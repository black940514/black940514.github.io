#!/bin/bash
# Jekyll 블로그 포스트 생성 스크립트 (Shell 버전)
# 사용법: ./scripts/new_post.sh "포스트 제목" "태그1,태그2"

TITLE="$1"
TAGS="$2"

if [ -z "$TITLE" ]; then
    echo "사용법: ./scripts/new_post.sh \"포스트 제목\" [태그1,태그2,...]"
    echo ""
    echo "예시:"
    echo '  ./scripts/new_post.sh "Python으로 시작하는 AI 개발" "Python,AI,개발"'
    exit 1
fi

# 날짜 형식: YYYY-MM-DD
DATE=$(date +%Y-%m-%d)

# 파일명 생성 (제목을 소문자로, 공백을 하이픈으로)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
FILENAME="${DATE}-${SLUG}.md"

# _posts 디렉토리 경로
POSTS_DIR="$(dirname "$0")/../_posts"
mkdir -p "$POSTS_DIR"
FILEPATH="${POSTS_DIR}/${FILENAME}"

# 태그 처리
if [ -z "$TAGS" ]; then
    TAGS_YAML=""
else
    TAGS_YAML="tags: [$TAGS]"
fi

# 포스트 템플릿
cat > "$FILEPATH" << EOF
---
layout: post
title: "$TITLE"
date: $DATE
$TAGS_YAML
---

# $TITLE

여기에 포스트 내용을 작성하세요.

## 소제목

본문 내용...

\`\`\`python
# 코드 예제
def example():
    print("Hello, World!")
\`\`\`

## 마무리

감사합니다!
EOF

echo "✅ 포스트가 생성되었습니다: $FILEPATH"
echo "📝 파일을 열어서 내용을 작성하세요!"


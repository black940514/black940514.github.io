#!/bin/bash
# 로컬 저장소와 GitHub 동기화 스크립트

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR" || exit 1

echo "🔄 GitHub에서 최신 변경사항 가져오는 중..."

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 현재 브랜치: $CURRENT_BRANCH"

# 변경사항이 있으면 stash
if ! git diff-index --quiet HEAD --; then
    echo "💾 로컬 변경사항을 임시 저장 중..."
    git stash
    STASHED=true
else
    STASHED=false
fi

# GitHub에서 pull
git pull origin "$CURRENT_BRANCH"

# stash한 변경사항 복원
if [ "$STASHED" = true ]; then
    echo "📦 임시 저장한 변경사항 복원 중..."
    git stash pop
fi

echo "✅ 동기화 완료!"
echo ""
echo "📝 최근 변경사항:"
git log --oneline -5


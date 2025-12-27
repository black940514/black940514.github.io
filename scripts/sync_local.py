#!/usr/bin/env python3
"""
로컬 저장소와 GitHub 동기화 스크립트
웹에서 작성한 포스트를 로컬로 가져옵니다.
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, cwd=None):
    """명령어 실행"""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ 오류: {e.stderr}")
        return None

def sync_repo():
    """저장소 동기화"""
    # 스크립트 위치에서 저장소 루트 찾기
    script_dir = Path(__file__).parent
    repo_dir = script_dir.parent
    
    print(f"📂 저장소 디렉토리: {repo_dir}")
    os.chdir(repo_dir)
    
    # 현재 브랜치 확인
    current_branch = run_command("git branch --show-current", cwd=repo_dir)
    if not current_branch:
        print("❌ Git 저장소가 아닙니다.")
        return False
    
    print(f"📍 현재 브랜치: {current_branch}")
    
    # 변경사항 확인
    status = run_command("git status --porcelain", cwd=repo_dir)
    has_changes = bool(status)
    
    if has_changes:
        print("💾 로컬 변경사항을 임시 저장 중...")
        run_command("git stash", cwd=repo_dir)
        stashed = True
    else:
        stashed = False
    
    # GitHub에서 pull
    print("🔄 GitHub에서 최신 변경사항 가져오는 중...")
    pull_result = run_command(f"git pull origin {current_branch}", cwd=repo_dir)
    
    if pull_result is None:
        print("❌ Pull 실패")
        if stashed:
            run_command("git stash pop", cwd=repo_dir)
        return False
    
    # stash한 변경사항 복원
    if stashed:
        print("📦 임시 저장한 변경사항 복원 중...")
        run_command("git stash pop", cwd=repo_dir)
    
    print("✅ 동기화 완료!")
    print()
    print("📝 최근 변경사항:")
    run_command("git log --oneline -5", cwd=repo_dir)
    
    return True

if __name__ == "__main__":
    success = sync_repo()
    sys.exit(0 if success else 1)


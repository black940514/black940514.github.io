---
layout: default
title: 모든 포스트
---

<div class="posts-page">
  <div class="page-header">
    <h1 class="page-title">모든 포스트</h1>
    <p class="page-description">총 {{ site.posts.size }}개의 포스트</p>
  </div>

  <div class="posts">
    {% if site.posts.size > 0 %}
    <ul class="post-list">
      {% for post in site.posts %}
      <li class="post-item">
        <div class="post-header-meta">
          <span class="post-meta">{{ post.date | date: "%Y년 %m월 %d일" }}</span>
          {% if post.tags %}
          <div class="post-tags">
            {% for tag in post.tags %}
            <span class="tag">{{ tag }}</span>
            {% endfor %}
          </div>
          {% endif %}
        </div>
        <h3 class="post-title">
          <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h3>
        <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
      </li>
      {% endfor %}
    </ul>
    {% else %}
    <div class="empty-state">
      <p>아직 작성된 포스트가 없습니다.</p>
      <p class="empty-hint">새 포스트를 작성해보세요!</p>
    </div>
    {% endif %}
  </div>
</div>


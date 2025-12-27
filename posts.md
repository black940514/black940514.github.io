---
layout: default
title: Posts
---

# 모든 포스트

{% for post in site.posts %}
## [{{ post.title }}]({{ post.url | relative_url }})

**{{ post.date | date: "%Y년 %m월 %d일" }}**

{{ post.excerpt }}

{% if post.tags %}
태그: {% for tag in post.tags %}{{ tag }} {% endfor %}
{% endif %}

---

{% endfor %}


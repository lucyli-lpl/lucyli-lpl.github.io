# content/notes/ — 笔记

笔记是站点仓库自己的内容（不在三个内容仓库里）。一篇一个 `.md` 文件，文件名即 URL slug（小写、连字符）。

```yaml
---
title: 反例不是在收紧边界        # 必填
date: 2026-09-17                # 建议填，YYYY-MM-DD，站点按它排序
tags: [prompt, 复盘]             # 可选
summary: 一两句话，列表里 hover 时显示   # 可选
---

正文 markdown。
```

推送后站点约 90 秒更新。以 `_` 开头的文件不会渲染，可以放草稿。

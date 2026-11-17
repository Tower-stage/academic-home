# academic-home（boboxiao.cn）

这是 Bo Xiao 的个人学术主页仓库：零依赖 Node 构建，`content/` 放数据、`templates/` 放模板，生成 `site/` 后由 GitHub Actions 部署。

**要发布内容，先读 [SKILL.md](SKILL.md)** —— 里面有完整的改文件路径表、新增文章格式、密码位置和验证方法。

最短路径：

```bash
node build.mjs                 # 构建，失败会报行号
git add -A && git commit -m "..." && git push origin main
```

推送后约 60–90 秒自动上线到 <https://boboxiao.cn>。

三条硬规矩：

1. 不要提交 `content/.secret.js`（Essay 密码），也不要手改 `site/`（构建产物）。
2. 中文段落不要折行，换行会渲染成一个空格。
3. 改完必须验证线上（抓页面查关键字；Essay 内容要解密验证，方法见 SKILL.md），不要只看 Actions 变绿。

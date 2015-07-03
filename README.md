# fis3-hook-relative
让 fis3 产出能够支持相对路径。

## 如何使用？

### 1. 安装插件

全局安装

```
npm install -g fis3-hook-relative
```

或者，局部安装

```
npm install fis3-hook-relative
```

### 2. 配置启动

```javascript
// 启用插件
fis.hook('relative');

// 让所有文件，都使用相对路径。
fis.match('**', {
  relative: true
})
```

### 如何解决 html 性质文件，访问路径与实际服务端存放路径不一致，导致相对路径错误？

比如： /templates/xxx.tpl 发布到服务端后，是通过 `http://domain.com/user` 访问的，为了让 /templates/xxx.html 中的相对路径正确。请加上如下配置：

```javascript
fis.match('/templates/xxx.tpl', {
  relative: '/user/' // 服务端访问路径
});
```

### 注意

如果 js 文件中有引用其他资源的情况。相对路径相对的其实不是 js 所在目录，而是页面所在目录。所以这块，如果要正确处理，也需要配置 relative 属性。


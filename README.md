# fis3-plugin-relative
让 fis 产出能够支持相对路径。

## 如何使用？

### 1. 安装插件

全局安装

```
npm install -g fis3-plugin-relative
```

或者，局部安装

```
npm install fis3-plugin-relative
```

### 2. 配置启动

```javascript
// 别丢失已配置的插件。
fis.set('modules.plugin', fis.get('modules.plugin') + ', relative');

// 让所有文件，都使用相对路径。
fis.match('**', {
  relative: true
})
```

### 如何解决 html 性质文件，访问路径与实际服务端存放路径不一致，导致相对路径错误？

比如： /path/xxx.html 发布到服务端后，是通过 `http://domain.com/` 放问的，为了让 /path/xxx.html 中的相对路径正确。请加上如下配置：

```javascript
fis.match('/path/xxx.html', {
  relative: '/' // 服务端访问路径
});
```



var rUrl = /__relative<<<([\s\S]*?)>>>/g;
var path = require('path');
var rFile = /\.[^\.]+$/;

function wrap(value) {
  return '__relative<<<' + value + '>>>';
}

function getRelativeUrl(file, host) {
  var url;

  if (typeof file === 'string') {
    url = file;
  } else {
    var url = file.getUrl();

    if (file.domain) {
      return url;
    }
  }

  var relativeFrom = typeof host.relative === 'string' ? host.relative : host.release;
  if (rFile.test(relativeFrom)) {
    relativeFrom = path.dirname(relativeFrom);
  }

  url = path.relative(relativeFrom, url);
  return url.replace(/\\/g, '/');
}

function convert(content, file, host) {
  return content.replace(rUrl, function(all, value) {
    var info = fis.project.lookup(value);

    if (!info.file) {
      return info.origin;
    }

    // 再编译一遍，为了保证 hash 值是一样的。
    fis.compile(info.file);

    var query = info.query;
    var hash = info.hash || info.file.hash;
    var url = /*/__sprite/.test(info.origin) ? info.file.getUrl() : */getRelativeUrl(info.file, host || file);

    var parts = url.split('?');

    if (parts.length > 1 && query)  {
      url = parts[0] + query + '&amp;' + parts[1];
    } else if (query) {
      url += query;
    }

    return info.quote + url + hash + info.quote;
  });
}

function combineQuery(query1, query2) {
  query1 = query1.replace(/^\?/, '');
  query2 = query2.replace(/^\?/, '');
  var arr = [];
  query1 && arr.push(query1);
  query2 && arr.push(query2);
  var query = arr.join('&');
  return query ? '?' + query : '';
}

function onStandardRestoreUri(message) {
  var value = message.value;
  var file = message.file;
  var info = message.info;

  // 没有配置，不开启。
  // 或者目标文件不存在
  if (!file.relative || !info.file) {
    return;
  }

  message.ret = wrap(info.quote + info.file.subpath + info.query + info.quote);
};

function onProcessEnd(file) {
  // 没有配置，不开启。
  if (!file.relative || !file.isText() || file.isInline) {
    return;
  }

  var content = file.getContent();
  file.relativeBody = content;
  content = convert(content, file);
  file.setContent(content);
}

function onPackFile(message) {
  var file = message.file;
  var content = message.content;
  var pkg = message.pkg;

  // 没有配置，不开启。
  if (!file.relative || !file.relativeBody) {
    return;
  }

  content = convert(file.relativeBody, file, pkg);
  message.content = content;
}

function onFetchRelativeUrl(message) {
  var target = message.target;
  var host = message.file;

  if (!host.relative) {
    return;
  }

  message.ret = getRelativeUrl(target, host);
}

module.exports = function(fis, opts) {

  fis.on('process:end', onProcessEnd);
  fis.on('standard:restore:uri', onStandardRestoreUri);
  fis.on('pack:file', onPackFile);

  // 给其他插件用的
  fis.on('plugin:relative:fetch', onFetchRelativeUrl);
};

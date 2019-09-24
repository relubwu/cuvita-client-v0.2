module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { __MODS__[modId].m.exports.__proto__ = m.exports.__proto__; Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; Object.defineProperty(m.exports, k, { set: function(val) { __MODS__[modId].m.exports[k] = val; }, get: function() { return __MODS__[modId].m.exports[k]; } }); }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1569356870727, function(require, module, exports) {


module.exports = require('./loose-envify')(process.env);

}, function(modId) {var map = {"./loose-envify":1569356870728}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1569356870728, function(require, module, exports) {


var stream = require('stream');
var util = require('util');
var replace = require('./replace');

var jsonExtRe = /\.json$/;

module.exports = function(rootEnv) {
  rootEnv = rootEnv || process.env;
  return function (file, trOpts) {
    if (jsonExtRe.test(file)) {
      return stream.PassThrough();
    }
    var envs = trOpts ? [rootEnv, trOpts] : [rootEnv];
    return new LooseEnvify(envs);
  };
};

function LooseEnvify(envs) {
  stream.Transform.call(this);
  this._data = '';
  this._envs = envs;
}
util.inherits(LooseEnvify, stream.Transform);

LooseEnvify.prototype._transform = function(buf, enc, cb) {
  this._data += buf;
  cb();
};

LooseEnvify.prototype._flush = function(cb) {
  var replaced = replace(this._data, this._envs);
  this.push(replaced);
  cb();
};

}, function(modId) { var map = {"./replace":1569356870729}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1569356870729, function(require, module, exports) {


var jsTokens = require('js-tokens').default;

var processEnvRe = /\bprocess\.env\.[_$a-zA-Z][$\w]+\b/;
var spaceOrCommentRe = /^(?:\s|\/[/*])/;

function replace(src, envs) {
  if (!processEnvRe.test(src)) {
    return src;
  }

  var out = [];
  var purge = envs.some(function(env) {
    return env._ && env._.indexOf('purge') !== -1;
  });

  jsTokens.lastIndex = 0
  var parts = src.match(jsTokens);

  for (var i = 0; i < parts.length; i++) {
    if (parts[i    ] === 'process' &&
        parts[i + 1] === '.' &&
        parts[i + 2] === 'env' &&
        parts[i + 3] === '.') {
      var prevCodeToken = getAdjacentCodeToken(-1, parts, i);
      var nextCodeToken = getAdjacentCodeToken(1, parts, i + 4);
      var replacement = getReplacementString(envs, parts[i + 4], purge);
      if (prevCodeToken !== '.' &&
          nextCodeToken !== '.' &&
          nextCodeToken !== '=' &&
          typeof replacement === 'string') {
        out.push(replacement);
        i += 4;
        continue;
      }
    }
    out.push(parts[i]);
  }

  return out.join('');
}

function getAdjacentCodeToken(dir, parts, i) {
  while (true) {
    var part = parts[i += dir];
    if (!spaceOrCommentRe.test(part)) {
      return part;
    }
  }
}

function getReplacementString(envs, name, purge) {
  for (var j = 0; j < envs.length; j++) {
    var env = envs[j];
    if (typeof env[name] !== 'undefined') {
      return JSON.stringify(env[name]);
    }
  }
  if (purge) {
    return 'undefined';
  }
}

module.exports = replace;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1569356870727);
})()
//# sourceMappingURL=index.js.map
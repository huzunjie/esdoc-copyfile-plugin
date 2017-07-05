const fs = require('fs');
let option;
exports.onStart = function(ev) {
  option = ev.data.option;
};
exports.onComplete = function(ev) {
  if(!option){
    throw new Error('esdoc-copyfile-plugin option is undefined!');
    return;
  }
  // 使用doc目录中自定义样式替换esdoc默认样式
  const src = option.src;
  const dst = option.dst;
  if(!src || !dst){
    throw new Error('esdoc-copyfile-plugin options [src or dst] is undefined!');
    return;
  }
  copy(src, dst);
};

// 复制src目录下的文件及文件夹到dst目录
function copy(src, dst){
  // 读取目录中的所有文件/目录
  fs.readdir( src, ( err, paths ) => {
    if(err){
      throw err;
    }
    paths.forEach(path => {
      const _src = src + '/' + path;
      const _dst = dst + '/' + path;
      fs.stat( _src, ( err, st ) => {
        if(err){
          throw err;
        }
        if( st.isFile() ){
          fs.createReadStream( _src ).pipe( fs.createWriteStream( _dst ) );
        }
        // 如果是目录则递归复制
        else if( st.isDirectory() ){
          repairDir(_dst, () => copy( _src, _dst));
        }
      });
    });
  });
}
// 判断目录dst是否存在，不存在则创建
function repairDir(dst, callback ){
  fs.exists( dst, exists => {
    exists ? callback() : fs.mkdir(dst, callback);
  });
};
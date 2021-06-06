
export default {
  install(Vue, options) {
    // 挂载echarts
    Vue.prototype.setChart = function (dom, data) {
      let myChart = this.$echarts.init(dom)
      myChart.setOption(data)
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      return myChart
    }


    // 循环设置Id
    Vue.prototype.setId = function (dom, name) {
      let arr = []
      for (let i = 0; i < dom.length; i++) {
        dom[i].setAttribute('id', `${name}${i + 1}`)
        arr.push(document.getElementById(`${name}${i + 1}`))
      }
      return arr
    }
    //三位数逗号分隔
    Vue.prototype.formatNumber = function (n) {
      var b = parseInt(n).toString();
      var len = b.length;
      if (len <= 3) { return b; }
      var r = len % 3;
      return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
    }
    // 四舍五入取小数
    Vue.prototype.getPercent = function (num, all) {
      return Math.round(((num / all) * 100) * 100) / 100
    }
    //js读取本地文件
    Vue.prototype.readFile=function(filePath) {
      // 创建一个新的xhr对象
      let xhr = null
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
      } else {
        // eslint-disable-next-line
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
      }
      const okStatus = document.location.protocol === 'file' ? 0 : 200
      xhr.open('GET', filePath, false)
      xhr.overrideMimeType('text;charset=utf-8')
      xhr.send(null)
      xhr.status === okStatus ? xhr.responseText : null
      return xhr.status === okStatus ? xhr.responseText : null
    }

    Vue.prototype.jsfso = function(){
      var fso, tf;
      fso = new ActiveXObject("Scripting.FileSystemObject");
      tf = fso.CreateTextFile("d:\\ja.txt", true);
      tf.WriteLine(document.getElementById('content').innerHTML) ;
      tf.Close();
    }

    Vue.prototype.parseDom = function (arg,data) {
      let objE = document.createElement("div");
      let arr = []
      const {text,show,articleId,type,title} = arg
      if (title){
        data.push(arg)
        return {updated:true}
      }else {
        objE.innerHTML = text;
        const aDom = objE.getElementsByClassName('news-header')
        const textDom = objE.getElementsByClassName('news-main')
        const date = objE.getElementsByClassName('date')
        for (let i = 0;i < aDom.length;i++){
          //获取文章标题和链接以及发布事件
          let obj = {}
          obj.title = aDom[i].childNodes[0].innerText
          obj.text = textDom[i].innerText
          obj.url = aDom[i].children[0].href
          // const start = obj.url.indexOf('article/')+8 //slice截取是从开始位置截取，这里要减去article/的长度
          // const end = obj.url.indexOf('.html')
          obj.articleId = articleId
          obj.date = date[i].innerText
          obj.type = type
          obj.show = show
          data.push(obj)
        }
      }
    }
      Vue.prototype.getUnique = function () {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
    Vue.prototype.typeOfData = function (data) {
      return Object.prototype.toString.call(data).slice(8, -1)
    }
  }

}
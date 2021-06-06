<template>
 <div class="container-article">
   <div class="editor">
     <div id="details"></div>
   </div>
   <div class="button-submit" v-if="show">
     <div class="button-clear" @click="goback">返回</div>
     <div class="button-enter button-base" @click="submitEditor">提交</div>
   </div>
 </div>
</template>

<script>
  import E from 'wangeditor'
  import {getArticleDetails,upload,showArticleDetails ,updateArticle,getPersonalArticle,deletePersonalArticle} from "../request/api";
  import {Message, MessageBox} from "element-ui";
  export default {
    name: "ArticleDetails",
    data(){
      return{
        id:'',
        secondCity:'',
        cities:[],
        show:false,
        editor:new E('#details'),
        content:{},
        h1:'',
        align:'',
        type:1,
        editorContent:''
      }
    },
    methods:{
      //回退
      goback(){
        this.$router.go(-1)
      },
      async insertData(){
        let result
      if (this.$route.params.type*1===2 || this.$route.params.type*1===0 || this.$route.params.type*1===1){
         getArticleDetails({
          ...this.$route.params
        }).then(async res=>{
          result = res.content
               this.content = this.typeOfData(res.content) ==='Array' ? res.content[0] : res.content
               let {textHeader,textContent,textDate,img} = this.content
           console.log(this.content)
           if (img){
             textContent.unshift(
               `<p>${img}</p>`
             )
             console.log(textContent,'1')
             await this.setEditor(textHeader,textContent,textDate)
           }else {
             console.log(textContent,'2')
             await this.setEditor(textHeader,textContent,textDate)
           }

        })
          .catch(async (e)=>{
            console.log('catch',e)
          })
        // if (result){
        //   await showArticleDetails({unique:this.$route.params.articleId}).then(async res=>{
        //     console.log(res,'showArticleDetails')
        //   })
        // }
      }
      else if (this.$route.params.type*1===4){

      }else if (this.$route.params.type*1===3){
        getPersonalArticle({
          unique:this.$route.params.unique
        }).then(res=>{
          if (res.content.textContent.length==0){
            let str = localStorage.getItem(res.content.unique)
            document.getElementById('details').innerHTML = str
          }else {
            document.getElementById('details').innerHTML = res.content.textContent[0]
          }
        })
      }else if (this.$route.params.change){
        console.log('123')

      }
      },
      async getText(){
        let s = await this.readFile('gbx2021.json')
        //根据文章类型和是否为管理员来判断是否允许修改其内容
        if (this.$route.params.type*1===3 && sessionStorage.getItem('type')===0){
          this.editor.config.height = document.body.offsetHeight*0.78
          this.editor.config.uploadImgShowBase64 = true
          this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
          this.editor.config.uploadImgMaxLength = 5 // 一次最多上传 5 个图片

          this.editor.create()
          this.editor.txt.html(s)
          this.show=true
        }else if (this.$route.params.type*1===4){
          //this.$route.params.type为4表示新增
          this.editor.config.height = document.body.offsetHeight*0.78
          this.editor.config.uploadImgShowBase64 = true
          //  /upload
          this.editor.config.debug = true
          //this.editor.config.uploadImgServer = ' http://localhost:3000/upload'
          this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
          this.editor.config.uploadImgMaxLength = 5 // 一次最多上传 5 个图片
          //this.editor.config.uploadFileName = 'myFileName'
          this.editor.config.onchange = (html)=>{
            this.editorContent = html
          }
          // this.editor.config.uploadImgHeaders = {
          //   'authorization': 'Bearer'+this.getUnique(),
          //   'enctype':'multipart/form-data'
          // }
          this.editor.config.uploadFileName = 'mypic'
          this.editor.config.uploadImgHeaders = {
            'authorization': 'author ',//+sessionStorage.getItem('userName'),
            'enctype':'multipart/form-data'
          }
          //解决超时
          this.editor.config.uploadTimeout = 100000000;
          this.editor.config.uploadImgHooks = {
            success: function (xhr, editor, result) {
              console.log('图片上传并返回结果,图片插入成功')
            },
            fail: function (xhr, editor, result) {
              console.log('图片上传并返回结果，但图片插入错误')
            },
            error: function (xhr, editor) {
              console.log('图片上传出错')
            },
            timeout: function (xhr, editor) {
              console.log('图片上传超时')
            },
            customInsert: function (insertImg, result, editor) {
              // 上传成功 result为后台处理函数返回的数据
              var url = result.data[0].imgPath
              insertImg(url) //根据返回的图片路径，将图片插入到页面中，回显
            }
          }
          this.editor.create()
          this.show=true
          this.editor.txt.html(s)
          this.setEditor('请输入标题',['请输入正文'],'')
          this.h1 = document.getElementsByClassName('article-title')[0]
          this.align = document.getElementsByClassName('article-content')[0].firstChild
          //防止一开始找不到元素，定时器延时
            if (this.h1){
              this.h1.style.cssText = 'text-align: center;\n' +
                '    color: #cccccc;'
              this.h1.onclick = ()=>{
                if (this.h1.innerHTML==='请输入标题'){
                  //this.h1.innerHTML = ''
                }
                this.h1.style.cssText = 'color:black;text-align: center;'}
            }
            if (this.align.style){
              this.align.style.cssText = 'color: #cccccc;'
              this.align.onclick = ()=>{
                if (this.align.innerHTML==='请输入正文'){
                  //this.align.innerHTML = ''
                }
                this.align.style.cssText = 'color:black;'}
            }

            //为5表示编辑
        }else if (this.$route.params.change){
          getPersonalArticle({
            unique:this.$route.params.unique
          }).then(res=>{
            console.log(res,'===')
            this.editor.config.height = document.body.offsetHeight*0.78
            this.editor.config.uploadImgShowBase64 = true
            this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
            this.editor.config.uploadImgMaxLength = 5 // 一次最多上传 5 个图片
            this.editor.create()
            this.editor.txt.html(res.content.textContent[0])
            this.show=true
          })
        }
        else {
          document.getElementById('details').innerHTML=s
        }
      },
      submitEditor(){
        this.h1 = document.getElementsByClassName('article-title')[0]
        this.align = document.getElementsByClassName('article-content')[0].firstChild
       let docs = document.getElementsByTagName('img')
        //获取当前时间
        let d = new Date();
        let str = d.getFullYear()+"/"+
          ((d.getMonth()+1)<=9 ? '0'+ (d.getMonth()+1) : (d.getMonth()+1))+"/"
          +(d.getDate()<=9 ? '0'+ d.getDate() : d.getDate())+
          " "
          +(d.getHours()<=9 ? '0'+ d.getHours() : d.getHours())+":"
          +(d.getMinutes()<=9 ? '0'+ d.getMinutes() : d.getMinutes());
        let obj = {}
        //拼接字符串
        obj.date = str
        obj.url = '---'
        obj.title = this.h1.innerHTML
        obj.text = this.align.innerText
        obj.unique = this.getUnique()+this.getUnique()
        obj.textHeader = this.h1.innerText
        obj.textDate = str
        if (docs.length>2){
          obj.textContent = []
          localStorage.setItem(obj.unique,this.editor.txt.html())
        }else {
          obj.textContent = [this.editor.txt.html()]
        }

        obj.author = sessionStorage.getItem('userName')
        obj.show = false
        obj.type = 3
        // 0 待审核 1 已审核通过 2 审核未通过
        obj.status = 0
        if (this.$route.params.change){
          deletePersonalArticle({unique:this.$route.params.unique}).then(res=>{

          })
        }
        updateArticle(obj).then(res=>{
          console.log(res,'res')
          if (res.content.msg){
            this.$message({
              message: '提交成功!',
              type: 'success'
            });
            this.$router.go(-1)
          }else {
            this.$message.error('提交失败，请稍后再试！')
          }
        })
      },

      setEditor(textHeader,textContent,textDate){
      let h1 = document.getElementsByClassName('article-title')
        let date = document.getElementsByClassName('date')
        let content = document.getElementsByClassName('article-content')
        let img = document.getElementsByClassName('img-focus')
          let container = document.getElementsByClassName('main-container')
        container[0].style.width='100%'
        h1[0].innerHTML = textHeader
        date[0].innerHTML = textDate.substring(0,textDate.length-5)

        let contain = textContent.map(item=>`<p>${item}</p>`)
       for (let i=0;i<contain.length;i++){
         content[0].innerHTML += contain[i]

       }
      }
    },
    mounted() {
      this.insertData()
      this.getText()
      this.type = sessionStorage.getItem('type')
    },
    // beforeRouteLeave (to, from, next) {
    //  if (this.$route.params.type*1===4){
    //    let r=confirm("你还有数据未保存，是否退出？")
    //    if (r===true){
    //      next()
    //      this.editor.destroy()
    //      this.show=false
    //    }else {
    //      return false
    //    }
    //  }else {
    //    next()
    //  }
    // },
  }
</script>

<style scoped>
  .container-article{
    width: 100%;
    background: #EEF2F4;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    min-height: 800px;
  }
  .editor{
    width: 85%;
    height: 88%;
    margin: 0 auto;
    position: relative;
    min-height: 800px;
  }
  #details{
  margin: 50px auto;
    padding: 50px;
    box-sizing: border-box;
  width: 100%;
  background: #fff;
    min-height: 800px;
}
  .annex-over{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    background: #FFFFFF;
    box-shadow: 0px 0px 107px 13px rgba(128, 128, 128, 0.1);
    border-radius: 40px 40px 0px 0px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding: 10px 200px;
  }
  .button-submit{
    margin: 50px 30px 0 0;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .button-base{
    margin-top: 30px;
  }
  .annex{
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
  }
  .annex img{
    width: 25px;
    height: 25px;
  }
  .annex-text{
    margin-left: 21px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #999999;
    line-height: 30px;
    text-align: center;
  }
  .content-list{
  background-color: #fff;
  }

</style>
<style>
  .ant-select-selection{
    border: none;
    transform: rotate(180deg);
  }
</style>
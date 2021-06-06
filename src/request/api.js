/**   
 * api接口统一管理
 */
import { get, post } from './http'

// API示例
// export const apiAddress = p => post('api/v1/users/my_address/address_edit_before', p);



// 调用示例
// import { apiAddress } from '@/request/api';// 导入我们的api接口
// export default {        
//     name: 'Address',    
//     created () {
//         this.onLoad();
//     },
//     methods: {            
//         // 获取数据            
//         onLoad() {
//             // 调用api接口，并且提供了两个参数                
//             apiAddress({                    
//                 type: 0,                    
//                 sort: 1                
//             }).then(res => {
//                 // 获取数据成功后的其他操作
//                 ………………                
//             })            
//         }        
//     }
// }
//精确查询疫情数据
export const getAllData = p => get('/area/case',p)
//爬取消息数据
export const getArticleData = p => get('/spiderArticle',p)
export const getArticleDetails = p => get('/articleDetails',p)
export const showArticleDetails = p => get('/article',p)
export const register = p => get('/register',p)
export const login = p => get('/login',p)
export const report = p => get('/report',p)

//删除文章
export const deleteArticle = p => get('/delete',p)
//新增文章
export const updateArticle = p => post('/article/user',p)
//查询个人文章
export const getPersonalArticle = p => get('/article/personal',p)
//删除个人文章
export const deletePersonalArticle = p => get('/delete/personal',p)
//审核个人文章
export const reviewPersonalArticle = p => get('/update/personal',p)

//显示隐藏系统文章
export const setSystemArticle = p => get('/show/system',p)

//修改个人信息
 export const updateUserInfo = p => get('/update/user',p)
//获取用户列表
export const getUserList = p => get('/user',p)
//删除用户
export const deleteUser = p => get('/delete/user',p)
//设置管理员身份
export const setUserAdmin = p => get('/user/admin',p)

//获取最新增加确诊地区
export const newAddDanger = p => get('/dangerCity/newAdd',p)
//获取最新增加确诊地区
export const topOversea = p => get('/dangerCity/oversea',p)

//获取信息填报记录
export const getReportRecord = p => get('/report/user',p)

//查询高危人员
export const getDangerUser = p => get('/danger/user',p)

//更新所有爬虫数据
export const updateAllArticle = p => post('/update/article',p)
//清库
export const clearAllArticle = p => get('/clear/article',p)
//上传图片
export const upload = p => post('/upload',p)


//模糊查询
export const fuzzyArticle = p => get('/fuzzy/spider',p)
export const fuzzyPersonArticle = p => get('/fuzzy/article',p)
export const fuzzyUserInfo = p => get('/fuzzy/report',p)

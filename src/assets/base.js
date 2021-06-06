// 数字每三个字符加个逗号
export function exchangeNum(num){
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
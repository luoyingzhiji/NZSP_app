/**
 * wxPromisify
 * @fn 传入的函数，如wx.request、wx.download
 */

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)//执行函数，obj为传入函数的参数
    })
  }
}



module.exports = {
  wxPromisify: wxPromisify
}
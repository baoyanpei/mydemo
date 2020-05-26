function loadJs(url) {
  return new Promise((resolve, reject) => {
    $.getScript(url).done(() => {
      console.log('load js success...');
      resolve()
    })
  })

}
export default loadJs

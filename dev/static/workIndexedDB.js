self.onmessage = (msg) => {
  let modelData = msg.data
  //   let modelDB1
  let request = indexedDB.open("tbbim", 1)
  request.onerror = (event) => {
    console.log('indexedDB error!')
  }
  request.onsuccess = (event) => {
    // console.log('request', request)
    let db = request.result
    let request1 = db.transaction(['model'], 'readwrite')
      .objectStore('model')
      .add(modelData)
    request1.onsuccess = (event) => {
    //   console.log('数据写入成功', modelData)
      postMessage('OK');
    }
  }
}

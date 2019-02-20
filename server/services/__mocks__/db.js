module.exports = {
    query(text, params){
      return new Promise((resolve, reject) => {
        console.log("calling mock")
        resolve({rows: []})
      })
    }
}
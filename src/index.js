import GitHub from 'github';
import fs from 'fs';

const github = (options) => {
  let defaultOptions = {
    // optional
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    headers: {
      "user-agent": "PHP-CPM's GitHub-Rank Spider" // GitHub is happy with a unique user agent
    },
    Promise: Promise,
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
  }
  let runOptions = Object.assign({}, defaultOptions, options)
  
  return new GitHub(runOptions);
}
const searchUser = async(options) => {
  
  try {
    
    let data = await github().search.users(options)
    if (data && data.items && data.total_count) {
      return data
    }
  } catch (e) {
    console.log(e)
  }
  return {
    items: [],
    total_count: 0,
  }
}
const job = async() => {

 let result= await searchUser({
    q: 'followers:>1000'
  })
  //console.log(result.items.length)
  fs.writeFileSync('./rank/data.json',result)
}

job()

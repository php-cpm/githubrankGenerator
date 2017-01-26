import GitHub from 'github';

const job = async() => {

// unauthenticated client
  const github = new GitHub(
    {
      // optional
      debug: true,
      protocol: "https",
      host: "api.github.com", // should be api.github.com for GitHub
      pathPrefix: "/api/v3", // for some GHEs; none for GitHub
      headers: {
        "user-agent": "PHP-CPM's GitHub-Rank Spider" // GitHub is happy with a unique user agent
      },
      Promise: Promise,
      followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
      timeout: 5000
    }
  );
  let data ;
  try {
  
    data = await github.search.users({
      q: 'followers:>1000'
    })
  } catch (e) {
    console.log(e)
  }
  
  console.log(data)
  
}

job()
import GitHub from 'github';

const job = async() => {

// unauthenticated client
  const github = new GitHub(
    {
      // optional
      debug: true,
      protocol: "https",
    }
  );
  let data ;
  try {
  
    data = await github.search.users({
      q: 'followers:>1000'
    })
  }catch (e) {
    console.log(e)
  }
  
  console.log(data)
  
}

job()
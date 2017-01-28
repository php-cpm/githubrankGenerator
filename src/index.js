import GitHub from 'github';
import fs from 'fs';
import Repo from 'git-repository';
import mkdirp from 'mkdirp';
import cp from 'child_process';

const exec = (command, args, options) => new Promise((resolve, reject) => {
  let out = '';
  let err = '';
  const p = cp.spawn(command, args, options);
  p.stdout.on('data', data => out += data);
  p.stderr.on('data', data => err += data);
  p.on('error', reject);
  p.on('close', (code) => {
    out = out.trim();
    err = err.trim();
    resolve({code, out, err})
  });
});

async function createEmptyBranch(branchName, cwd) {
  await exec('git', ['checkout', '--orphan', branchName], {cwd, encoding: 'utf8'});
  await exec('git', ['rm', '--catch', '-r'], {cwd, encoding: 'utf8'});
};

async function gotoBranch(branchName, cwd) {
  await exec('git', ['checkout', branchName], {cwd, encoding: 'utf8'});
}
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

const saveData = async(data, type = 'master') => {
  
  try{
  
    let remote = {
      path: './rank',
      url: 'git@github.com:php-cpm/githubrank.git',
      name: 'origin',
      type: type,
    }
    mkdirp.sync(remote.path)
    let repo = await Repo.open(remote.path, {init: true});

    await repo.setRemote(remote.name, remote.url);
    // Fetch the remote repository if it exists
    if ((await repo.hasRef(remote.url, remote.type))) {

      await repo.fetch(remote.type);
      await gotoBranch(remote.type, remote.path);
      await repo.reset(`${remote.name}/${remote.type}`, {hard: true});
      await repo.clean({force: true});
    } else {
    
      // 没有远程分支, 创建一个
      await createEmptyBranch(remote.type, remote.path);
    }
    fs.writeFileSync(`${remote.path}/data.json`, JSON.stringify(data))
  
    await repo.add('--all .');
    
    await repo.commit(`add ${type} data`);
    await repo.push('origin', type, {force: true});
  }catch (e) {
    console.log(e)
  }
}
const job = async() => {
  
  let result = await searchUser({
    q: 'followers:>1000'
  })
  await saveData(result, 'user')
}


job()

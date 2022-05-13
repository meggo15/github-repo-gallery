const overview = document.querySelector(".overview");
const username = "meggo15";
const repoList = document.querySelector (".repo-list");
const repoInfo = document.querySelector (".repos")
const repoData = document.querySelector (".repo-data")

const gitUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  displayUserInfo(data);
};

gitUserInfo();

const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
  `;
  overview.append(div);
  gitRepos ();
};

const gitRepos = async function () {
    const fetchRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepos.json ();
    displayRepos (repoData);
};

const displayRepos = function (repos) {
    for (const repo of repos) {
        const repoItem = document.createElement ("li");
        repoItem.classList.add ("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append (repoItem);
    } 
};

repoList.addEventListener ("click", function(e){
    if (e.target.matches("h3")) {
        const repoName = repoList.innerText.value;
        specificRepoInfo (repoName);
    }
});

const specificRepoInfo = async function (repoName) {
    const specificRepo = await fetch (`https://api.github.com/users/${username}/${repo}`);
    const repoInfo = await specificRepo.json ();
    repoInfo ();
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
    languageData ();
    const languages = [];
    for (let languages in languageData) {
        languages.push (languageData)
    };
    displaySpecificRepoInfo (repoInfo, languages);
};

const displaySpecificRepoInfo = function (repoInfo, languages) {
    repoData.innerHTML = "";
    const div2 = document.createElement ("div");
    div2.innerHTML = `
    <h3>Name: ${languages.name}</h3>
        <p>Description: ${languages.description}</p>
        <p>Default Branch: ${languages.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${languages.homepage}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`
 div2.append (repoData);
 repoData.classList.remove ("hide");
 repoInfo.classList.add ("hide");
};

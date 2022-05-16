const overview = document.querySelector(".overview");
const username = "meggo15";
const repoList = document.querySelector (".repo-list");
const allRepos = document.querySelector (".repos")
const repoData = document.querySelector (".repo-data")
const backToRepoButton = document.querySelector (".view-repos");
const filterInput = document.querySelector (".filter-repos");

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
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement ("li");
        repoItem.classList.add ("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append (repoItem);
    } 
};

repoList.addEventListener ("click", function(e){
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        specificRepoInfo (repoName);
    }
});

const specificRepoInfo = async function (repoName) {
    const specificRepo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    //console.log (repoInfo);
    const repoInfo = await specificRepo.json ();

    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    const languages = [];
    for (let language in languageData) {
        languages.push (language);
    };
    displaySpecificRepoInfo (repoInfo, languages);
};

const displaySpecificRepoInfo = function (repoInfo, languages) {
  backToRepoButton.classList.remove ("hide");
    repoData.innerHTML = "";
    repoData.classList.remove ("hide");
    allRepos.classList.add ("hide");
    const div2 = document.createElement ("div");
    div2.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.homepage}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`
 repoData.append (div2);
};

backToRepoButton.addEventListener ("click", function (){
    allRepos.classList.remove ("hide");
    repoData.classList.add ("hide");
    backToRepoButton.classList.add ("hide");
});

filterInput.addEventListener ("input", function (e){
  const searchText = e.target.value;
  const repos = document.querySelectorAll (".repo");
  const searchLowerText = searchText.toLowerCase ();

  for (let repo of repos) {
    const repoLowerText = repo.innerText.toLowerCase();
  if (repoLowerText.includes (searchLowerText)) {
    repo.classList.remove ("hide");
  } else { repo.classList.add ("hide")
}
}
});

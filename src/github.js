// import _ from "lodash";
// import { Octokit } from "https://esm.sh/octokit";

// function initOctokit(personalAccessToken) {
//   return new Octokit({ auth: personalAccessToken, userAgent: "gitd" }).rest;
// }

// const GH_PAT_LS_KEY = "githubPersonalAccessToken";

// let octokit = initOctokit(localStorage.getItem(GH_PAT_LS_KEY)),
//   auth = {},
//   users = {},
//   repos = {},
//   refs = {},
//   content = {};

// // only supporting personal access tokens for now
// export async function signIn({ personalAccessToken }) {
//   if (personalAccessToken) {
//     localStorage.setItem(GH_PAT_LS_KEY, personalAccessToken);
//     auth = { personalAccessToken };
//     octokit = initOctokit(personalAccessToken);

//     let { data: authenticated } = await octokit.users.getAuthenticated();

//     users.authenticated = authenticated;
//   }
// }

// export async function signOut() {
//   localStorage.removeItem(GH_PAT_LS_KEY);
//   auth = {};
//   octokit = initOctokit();
//   delete users.authenticated;
// }

// export async function fetchContent({ owner, repo, ref, path }) {
//   let ret = _.get(content, [owner, repo, ref, path]);

//   if (_.isNil(ret)) {
//     ret = atob(
//       (
//         await octokit.repos.getContent({
//           owner,
//           repo,
//           ref,
//           path,
//         })
//       ).data.content,
//     );

//     _.set(content, [owner, repo, ref, path], ret);
//   }

//   return ret;
// }

// export async function fetchRepo({ owner, repo }) {
//   let ret = _.get(repos, [owner, repo]);

//   if (_.isNil(ret)) {
//     ret = (await octokit.repos.get({ owner, repo })).data;

//     _.set(repos, [owner, repo], ret);
//   }

//   return ret;
// }

// export async function fetchRef({ owner, repo, ref }) {
//   let ret = _.get(refs, [owner, repo, ref]);

//   if (_.isNil(ret)) {
//     ret = (
//       await octokit.git.getRef({
//         owner,
//         repo,
//         ref,
//       })
//     ).data;

//     _.set(refs, [owner, repo, ref], ret);
//   }

//   return ret;
// }

// export async function fetchEmojis() {
//   // Get all the emojis available to use on GitHub.
//   const res = await octokit.emojis.get();
//   /*
//    * {
//    *   ...
//    *   "heart": "https://...",
//    *   ...
//    *   "tada": "https://...",
//    *   ...
//    * }
//    */
//   return res.data;
// }

// export async function fetch(url) {
//   let [owner, repo, treeOrBlob, ref, ...path] = url.pathname
//     .substring(1)
//     .split("/");

//   let theRepo = await fetchRepo({ owner, repo });

//   if (!ref) {
//     ref = theRepo.default_branch;
//   }

//   return fetchContent({
//     owner,
//     repo,
//     ref,
//     path: "/" + path.join("/"),
//   });
// }

/**
 * For use when running on a GH pages site. Fetches the text of repo content.
 *
 * @param {string} path - The path to the content in the repo.
 * @param {AbortSignal} signal - The AbortSignal to use for the fetch.
 *
 * @returns {Promise<string>} Promise object represents the text of specified repo content.
 */
export const fetchPagesContentAsText = async (path, signal) => {
  const response = await fetch(path, {
    signal,
  });

  if (response.status === 200) {
    return response.text();
  } else {
    throw response.text();
  }
};

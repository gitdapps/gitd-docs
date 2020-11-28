import { Octokit } from "@octokit/rest";

 let = ;

export default {
  get accessToken() {
    return localStorage.getItem("githubAccessToken");
  },
  connect(newAccessToken) {
    try {
      const { data: user } = await octokit.users.getAuthenticated();

      this.user = user;

      localStorage.setItem("githubAccessToken", this.accessTokenInput);
    } catch (err) {
      this.message = "that didnt work, try again";
    }
  },
  get octokit() {
    new Octokit({
      auth: this.accessTokenInput,
      userAgent: "GiTD Dev",
    })
  } 
};

      
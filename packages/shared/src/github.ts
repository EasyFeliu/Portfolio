/** Usuario por defecto cuando no se configura por entorno. */
export const DEFAULT_GITHUB_USER = "EasyFeliu";

export function githubProfileUrl(user: string): string {
  return `https://github.com/${user}`;
}

export function githubRepoUrl(user: string, repo: string): string {
  return `${githubProfileUrl(user)}/${repo}`;
}

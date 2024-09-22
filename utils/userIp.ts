export async function getUserIp() {
  let userIp: string | null = null;

  await getIpFromIpify().then((ip) => {
    userIp = ip;
  });

  if (!userIp) {
    throw new Error("No ip founded");
  }

  return userIp;
}

export function getIpFromIpify() {
  return fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((response) => {
      return response.ip;
    });
}

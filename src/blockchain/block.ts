const generateBlock = () => {
  
};

//hash签名
const calculateHash = async (
  index: number,
  timestamp: string,
  previousHash: string,
  events: string[]
) => {
  const toHash = index + timestamp + previousHash + JSON.stringify(events);
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(toHash)
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

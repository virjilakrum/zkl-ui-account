{`import { create } from 'ipfs-http-client';

const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET;

if (!projectId || !projectSecret) {
  throw new Error('IPFS credentials are not set in environment variables');
}

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

export const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Add file to IPFS
    const result = await ipfsClient.add({
      path: file.name,
      content: buffer,
    }, {
      progress: (prog) => console.log(\`Upload progress: \${prog}\`),
    });

    return result.cid.toString();
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}`}
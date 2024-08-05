import wallet from "./wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        //2. Convert image to generic file.
        //3. Upload image

        const image = await readFile("./cluster1/assets/images2.jpeg");
        // const image = ???

        const imageGenericFile = createGenericFile(image, "images2.jpeg", {
            contentType: "image/jpeg",
        })
        // const [myUri] = ??? 
        // console.log("Your image URI: ", myUri);

        const [myUri] = await umi.uploader.upload([imageGenericFile])
        console.log("Your image URL: ", myUri);
    }
    
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
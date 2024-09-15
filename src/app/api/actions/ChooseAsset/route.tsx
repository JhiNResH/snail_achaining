// src/api/actions/ChooseAsset.ts

import {
    ActionPostResponse,
    createPostResponse,
    MEMO_PROGRAM_ID,
    ActionGetResponse,
    ActionPostRequest,
    createActionHeaders,
    ActionError,
  } from "@solana/actions";
  import {
    clusterApiUrl,
    ComputeBudgetProgram,
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
  } from "@solana/web3.js";
  
  // 創建標準的 headers（包括 CORS）
  const headers = createActionHeaders({
    chainId: "devnet",
  });
  
  export const GET = async (req: Request) => {
    const payload: ActionGetResponse = {
      title: "Snail Finance",
      icon: new URL("/snail.png", new URL(req.url).origin).toString(),
      description: "Grow your wealth with Snail Finance",
      label: "Get Started",
      links: {
        actions: [
          {
            href: "/api/actions/ChooseAsset",
            label: "Confirm",
            parameters: [
              {
                name: "asset",
                label: "Select an asset",
                type: "select",
                options: [
                  { label: "LSTSOL", value: "LSTSOL" },
                  { label: "Stablecoin", value: "Stablecoin" },
                ],
                },
                {
                    name: "asset",
                    label: "Select a stablecoin",
                    type: "select",
                    options: [
                        { label: "PYUSD", value: "PYUSD" },
                        { label: "USDC", value: "USDC" },
                      ],
                  },
                {
                    name: "amount",
                    label: "Enter amount",
                    type: "number",
                  },
                ],
          },
        ],
      },
    };
    return Response.json(payload, {
      headers,
    });
  };
  
  // 處理 CORS 的 OPTIONS 方法
  export const OPTIONS = async () => Response.json(null, { headers });
  
  export const POST = async (req: Request) => {
    try {
      const body: ActionPostRequest<{ memo: string }> & {
        params: ActionPostRequest<{ memo: string }>["data"];
      } = await req.json();
  
      console.log("body:", body);
  
      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
      } catch (err) {
        throw 'Invalid "account" provided';
      }
  
      const connection = new Connection(
        process.env.SOLANA_RPC! || clusterApiUrl("devnet"),
      );
  
      const transaction = new Transaction().add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 1000,
        }),
        new TransactionInstruction({
          programId: new PublicKey(MEMO_PROGRAM_ID),
          keys: [],
        }),
      );
  
      transaction.feePayer = account;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
  
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          links: {
            next: {
              type: "post",
              href: "/api/actions/ChooseAsset/next-action",
            },
          },
        },
      });
  
      return Response.json(payload, {
        headers,
      });
    } catch (err) {
      console.log(err);
      let actionError: ActionError = { message: "An unknown error occurred" };
      return Response.json(actionError, { headers });
    }
  };
  
// src/api/actions/ChooseAsset/next-action.ts

import {
    ActionPostResponse,
    createPostResponse,
    ActionError,
    ActionPostRequest,
    createActionHeaders,
  } from "@solana/actions";
  import { Connection, clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
  
  // 創建標準的 headers（包括 CORS）
  const headers = createActionHeaders({
    chainId: "devnet",
  });
  
  export const POST = async (req: Request) => {
    try {
      const body: ActionPostRequest = await req.json();
  
      console.log("Next action body:", body);
    
      // 驗證簽名或執行其他操作
      // 這裡假設簽名已經被確認
  
      // 創建下一個 transaction 或其他操作
      const connection = new Connection(
        process.env.SOLANA_RPC! || clusterApiUrl("devnet"),
      );
  
      const nextTransaction = new Transaction().add(
        // 添加更多的指令
      );
  
      nextTransaction.feePayer = new PublicKey(body.account);
      nextTransaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
  
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction: nextTransaction,
          links: {
            next: {
              type: "post",
              href: "/api/actions/FinalStep", // 下一個步驟的 API 端點
            },
          },
        },
      });
  
      return Response.json(payload, { headers });
    } catch (err) {
      console.log(err);
      let actionError: ActionError = { message: "An error occurred in the next action" };
      return Response.json(actionError, { headers });
    }
  };
  
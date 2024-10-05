import { createHash } from "node:crypto";
import { $LedgerEvent, add } from "../models/ledger.ts";

// 创建创世区块
export const createGenesisBlock = (userId: number): Block => {
  const block = new Block(`${userId}`, Date.now(), [{
    amount: "0",
    class: "Genesis Block",
    event: Date.now().toString(),
  }]);
  // 添加到数据库
  add(userId, JSON.stringify(block.data), block.previousHash, block.hash);
  return block;
};

// 定义区块结构
export class Block {
  previousHash: string; // 前一个区块的哈希
  timestamp: number; // 区块创建时间
  data: $LedgerEvent[]; // 区块中的事件数据
  hash: string; // 当前区块的哈希

  constructor(
    previousHash: string,
    timestamp: number,
    data: $LedgerEvent[],
  ) {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
  }

  // 计算区块的哈希值
  calculateHash = () => {
    const blockData = this.timestamp + this.previousHash +
      JSON.stringify(this.data);
    return createHash("sha256").update(blockData).digest("hex");
  };

  saveBlock(userId: number) {
    add(userId, JSON.stringify(this.data), this.previousHash, this.hash);
  }
}

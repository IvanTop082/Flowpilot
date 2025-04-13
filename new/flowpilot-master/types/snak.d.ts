declare module 'snak' {
  export function buildCall(options: {
    contractAddress: string;
    entrypoint: string;
    calldata: any[];
  }): Promise<any>;
}

declare module 'snak/types' {
  export interface CallObject {
    contractAddress: string;
    entrypoint: string;
    calldata: any[];
  }
} 
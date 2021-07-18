/**
 * 交换机
 */
 export class Exchange {
  constructor(public flow: (news: any) => string | string[]) {}
}
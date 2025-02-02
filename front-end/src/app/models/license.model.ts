import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { CID } from 'ipfs-http-client';
import LicenseArtifact from "../../../../shared/artifacts/contracts/License.sol/License.json";
import { IpfsUtil } from '../utils/ipfs.util';
import { ContractModel } from './contract.model';

export enum TokenStateEnum { INACTIVE, ACTIVE, SALE, EXPIRED }

export class TokenModel {
  constructor(
    public tokenId: number,
    public expiresOn: Date,
    public registerOn: Date,
    public owner: string,
    public price: number,
    public state: TokenStateEnum,) {
  }

  public static parseTokenStateEnum(tokenState: TokenStateEnum) {
    if (tokenState === TokenStateEnum.INACTIVE) {
      return 'Inactive';
    } else if (tokenState === TokenStateEnum.ACTIVE) {
      return 'Active';
    } else if (tokenState === TokenStateEnum.SALE) {
      return 'Sale';
    } else if (tokenState === TokenStateEnum.EXPIRED) {
      return 'Expired';
    }

    return 'Unknown';
  }
}

export class LicenseModel extends ContractModel {

  public name: string;
  public symbol: string;
  public cid: CID;
  public price: number;
  public tokens: TokenModel[];

  // TODO: update metadata to ipfs
  public description: string = 'Description of the license. Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
    'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ';
  public updateOn: Date = new Date();
  public ownerAddress: string = '0xOwnerAddress';

  constructor(
    public override signer: Signer,
    public override address: string,
    data?: { name: string, symbol: string, cid: CID, price: number }
  ) {
    super(signer, LicenseArtifact, address);

    if (data) {
      const price = data.price
      console.log(`New license price:L ${price}`)
      this.name = data.name;
      this.symbol = data.symbol;
      this.cid = data.cid;
      this.price = price;
      this.tokens = []
    }
  }

  private bigNumberToEthers(n: BigNumber) {
    return parseFloat(ethers.utils.formatEther(n))
  }

  private bigNumberToDateTime(n: BigNumber) {
    return new Date(n.toNumber() * 1000)
  }

  public async init() {
    if (!this.contract) throw new Error('Deployed address not defined!')

    this.name = await this.contract.name();
    this.symbol = await this.contract.symbol();
    this.price = this.bigNumberToEthers(await this.contract.price())
    this.cid = IpfsUtil.parseToCid(await this.contract.cid());

    const total = await this.contract.totalSupply()
    this.tokens = []
    for (let i = 0; i < total; i++) {
      const data = await this.contract.tokensMapping(i)
      const token = new TokenModel(i, this.bigNumberToDateTime(data['expiresOn']), this.bigNumberToDateTime(data['registeredOn']), data['owner'],
        this.bigNumberToEthers(data['price']),
        data['state'])
      this.tokens.push(token)
    }

    console.log(this.tokens)
  }

  public override async deploy(): Promise<Contract> {
    return super.deploy();
  }

  public override toJson() {
    return {
      name: this.name,
      symbol: this.symbol,
      price: this.price,
      cid: this.cid,
      link: IpfsUtil.cidToLink(this.cid)
    }
  }

  public override toDeployJson(): object {
    const price = ethers.utils.formatUnits(ethers.utils.parseEther(this.price.toString()), 'wei')
    return {
      name: this.name,
      symbol: this.symbol,
      price: price,
      cid: this.cid.toV1().multihash.digest
    }
  }

  public toUpdateJson(): object {
    return this.toDeployJson()
  }

  public async buyToken(price: number) {
    const response = await this.contract.buyLicense({ value: ethers.utils.parseEther(`${price}`) })
  }

  public async withdraw() {
    // Owner of License only, otherwise error
    await this.contract.withdraw()
  }

  public async activate(tokenId: number) {
    // Owner of Token only, otherwise error
    await this.contract.activate(tokenId)
  }

  public verify(tokenId: number): boolean {
    if (tokenId >= this.tokens.length) {
      return false
    }
    return this.tokens[tokenId].state != TokenStateEnum.EXPIRED
  }



}

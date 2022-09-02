const { InfuraProvider } = require("@ethersproject/providers");
const BN = require("ethers").BigNumber;
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MasterChefTesting", () => {
  let owner,a,b,c,d;

  beforeEach(async () => {
    [owner,a, b,c,d] = await ethers.getSigners();

    TOKEN1 = await ethers.getContractFactory("Token1");
    Token1 = await TOKEN1.connect(owner).deploy("LP Token1","LP1",BN.from("2000").mul(BN.from("10").pow("18")));
    // console.log("Token1 Address",Token1.address);

    TOKEN2 = await ethers.getContractFactory("Token2");
    Token2 = await TOKEN2.connect(owner).deploy("LP Token2","LP2",BN.from("3000").mul(BN.from("10").pow("18")));
    // console.log("Token2 Address",Token2.address);

    TOKEN3 = await ethers.getContractFactory("Token3");
    Token3 = await TOKEN3.connect(owner).deploy("LP Token3","LP3",BN.from("4000").mul(BN.from("10").pow("18")));
    // console.log("Token3 Address",Token3.address);
    
    CAKETOKEN = await ethers.getContractFactory("CakeToken");
    CakeToken = await CAKETOKEN.connect(owner).deploy();
    // console.log("CakeToken Address",CakeToken.address);

    SYRUPBAR = await ethers.getContractFactory("SyrupBar");
    SyrupBar = await SYRUPBAR.connect(owner).deploy(CakeToken.address);
    // console.log("SyrupBar Address",SyrupBar.address);

    MASTERCHEF = await ethers.getContractFactory("MasterChef");
    MasterChef = await MASTERCHEF.connect(owner).deploy(CakeToken.address,SyrupBar.address,owner.address,BN.from("30").mul(BN.from("10").pow("18")),1);
    // console.log("MasterChef Address",MasterChef.address);
    
    // Transfering The Ownership to MasterChef
    await CakeToken.connect(owner).transferOwnership(MasterChef.address) ;
    await SyrupBar.connect(owner).transferOwnership(MasterChef.address) ;
    
    // console.log("Owner Address",owner.address);

    await MasterChef.connect(owner).add(50,Token1.address,true);
    await MasterChef.connect(owner).add(30,Token2.address,true);
    await MasterChef.connect(owner).add(20,Token3.address,true);

    // console.log("POOL INFO1",await MasterChef.poolInfo(1));
    // console.log("POOL INFO2",await MasterChef.poolInfo(2));
    // console.log("POOL INFO3",await MasterChef.poolInfo(3));

})
describe("Deployment", () => {

    it("Should test the function 'add'", async() => {
        await MasterChef.connect(owner).add(50,Token1.address,true);
        await MasterChef.connect(owner).add(30,Token2.address,true);
        await MasterChef.connect(owner).add(20,Token3.address,true);

        console.log("POOL INFO1",await MasterChef.poolInfo(1));
        console.log("POOL INFO2",await MasterChef.poolInfo(2));
        console.log("POOL INFO3",await MasterChef.poolInfo(3));
    
    })
    it("Should Check the Function'poolInfo'", async()=>{
    
        console.log("POOL INFO1",await MasterChef.poolInfo(1));
        console.log("POOL INFO2",await MasterChef.poolInfo(2));
        console.log("POOL INFO3",await MasterChef.poolInfo(3));

    })

    it("Should Check the Function'poolLength'", async()=>{
        PoolLength = await MasterChef.poolLength();
        expect(PoolLength).to.equal(4);
    })

    it("Should check the Function 'set'", async()=>{
        await MasterChef.set(1,60,true);
        console.log("POOL INFO1",await MasterChef.poolInfo(1));
    })

    it("Should Test the Function 'deposit'",async()=>{

        await Token1.connect(owner).mint(a.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token2.connect(owner).mint(b.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(a).approve(MasterChef.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token2.connect(b).approve(MasterChef.address,BN.from("100").mul(BN.from("10").pow("18")));
        
        console.log("A Balance Before" , Number(await Token1.balanceOf(a.address)));
        console.log("B Balance before" , Number(await Token2.balanceOf(b.address)));

        console.log("Bal of Token1 Masterchef Before", Number(await Token1.balanceOf(MasterChef.address)))
        console.log("Bal of Token2 Masterchef Before", Number(await Token2.balanceOf(MasterChef.address)))

        await MasterChef.connect(a).deposit(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(b).deposit(2,BN.from("100").mul(BN.from("10").pow("18")));
        
        console.log("Token1 Balance" , Number(await Token1.balanceOf(owner.address)));
        console.log("Token2 Balance" , Number(await Token2.balanceOf(owner.address)));

        console.log("Bal of Token1 Masterchef After", Number(await Token1.balanceOf(MasterChef.address)))
        console.log("Bal of Token2 Masterchef After", Number(await Token2.balanceOf(MasterChef.address)))

        console.log("A Balance After" , Number(await Token1.balanceOf(a.address)));
        console.log("B Balance After" , Number(await Token2.balanceOf(b.address)));

    })

    it("Should Test the function 'withdraw'",async()=>{

        await Token1.connect(owner).mint(a.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(b.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(c.address,BN.from("300").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(d.address,BN.from("400").mul(BN.from("10").pow("18")));

        await Token1.connect(a).approve(MasterChef.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(b).approve(MasterChef.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(c).approve(MasterChef.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(d).approve(MasterChef.address,BN.from("100").mul(BN.from("10").pow("18")));

        await MasterChef.connect(a).deposit(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(b).deposit(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).deposit(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).deposit(1,BN.from("100").mul(BN.from("10").pow("18")));

        console.log("A Balance Before" , Number(await Token1.balanceOf(a.address)));
        console.log("B Balance Before" , Number(await Token1.balanceOf(b.address)));
        console.log("C Balance Before" , Number(await Token1.balanceOf(c.address)));
        console.log("D Balance Before" , Number(await Token1.balanceOf(d.address)));

        console.log("Bal of Token1 Masterchef Before", Number(await Token1.balanceOf(MasterChef.address)))

        await MasterChef.connect(a).withdraw(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(b).withdraw(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).withdraw(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).withdraw(1,BN.from("100").mul(BN.from("10").pow("18")));

        console.log("Bal of Token1 Masterchef After", Number(await Token1.balanceOf(MasterChef.address)))
       
        console.log("A Balance After" , Number(await Token1.balanceOf(a.address)));
        console.log("B Balance After" , Number(await Token1.balanceOf(b.address)));
        console.log("C Balance After" , Number(await Token1.balanceOf(c.address)));
        console.log("D Balance After" , Number(await Token1.balanceOf(d.address)));

        console.log("A Cake Token", Number(await CakeToken.balanceOf(a.address)));
        console.log("B Cake Token", Number(await CakeToken.balanceOf(b.address)));
        console.log("C Cake Token", Number(await CakeToken.balanceOf(c.address)));
        console.log("D Cake Token", Number(await CakeToken.balanceOf(d.address)));

    })

    it("Should Test The Function 'emergencyWithdraw'", async()=>{

        await Token1.connect(owner).mint(a.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(b.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(c.address,BN.from("300").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(d.address,BN.from("400").mul(BN.from("10").pow("18")));

        await Token1.connect(a).approve(MasterChef.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(b).approve(MasterChef.address,BN.from("100").mul(BN.from("10").pow("18")));
        await Token1.connect(c).approve(MasterChef.address,BN.from("300").mul(BN.from("10").pow("18")));
        await Token1.connect(d).approve(MasterChef.address,BN.from("400").mul(BN.from("10").pow("18")));

        await MasterChef.connect(a).deposit(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(b).deposit(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).deposit(1,BN.from("300").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).deposit(1,BN.from("400").mul(BN.from("10").pow("18")));

        await MasterChef.connect(a).emergencyWithdraw(1);
        await MasterChef.connect(b).emergencyWithdraw(1);
        await MasterChef.connect(c).emergencyWithdraw(1);
        await MasterChef.connect(d).emergencyWithdraw(1);

        console.log("A Balance After" , Number(await Token1.balanceOf(a.address)));
        console.log("B Balance After" , Number(await Token1.balanceOf(b.address)));
        console.log("C Balance After" , Number(await Token1.balanceOf(c.address)));
        console.log("D Balance After" , Number(await Token1.balanceOf(d.address)));

        console.log("A Cake Token", Number(await CakeToken.balanceOf(a.address)));
        console.log("B Cake Token", Number(await CakeToken.balanceOf(b.address)));
        console.log("C Cake Token", Number(await CakeToken.balanceOf(c.address)));
        console.log("D Cake Token", Number(await CakeToken.balanceOf(d.address)));

    })

    it("Should Test the function 'enterStaking'",async()=>{

        await Token1.connect(owner).mint(a.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(b.address,BN.from("2000").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(c.address,BN.from("3000").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(d.address,BN.from("4000").mul(BN.from("10").pow("18")));

        await Token1.connect(a).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await Token1.connect(b).approve(MasterChef.address,BN.from("2000").mul(BN.from("10").pow("18")));
        await Token1.connect(c).approve(MasterChef.address,BN.from("3000").mul(BN.from("10").pow("18")));
        await Token1.connect(d).approve(MasterChef.address,BN.from("4000").mul(BN.from("10").pow("18")));

        await MasterChef.connect(a).deposit(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(b).deposit(1,BN.from("200").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).deposit(1,BN.from("300").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).deposit(1,BN.from("400").mul(BN.from("10").pow("18")));
                                                                                                
        await MasterChef.connect(a).withdraw(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(b).withdraw(1,BN.from("200").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).withdraw(1,BN.from("300").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).withdraw(1,BN.from("400").mul(BN.from("10").pow("18")));

        console.log("A Cake Token Before", Number(await CakeToken.balanceOf(a.address)));
        console.log("B Cake Token Before", Number(await CakeToken.balanceOf(b.address)));
        console.log("C Cake Token Before", Number(await CakeToken.balanceOf(c.address)));
        console.log("D Cake Token Before", Number(await CakeToken.balanceOf(d.address)));

        await CakeToken.connect(a).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await CakeToken.connect(b).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await CakeToken.connect(c).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await CakeToken.connect(d).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));

        await MasterChef.connect(a).enterStaking(BN.from("18").mul(BN.from("10").pow("18")));
        await MasterChef.connect(b).enterStaking(BN.from("16").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).enterStaking(BN.from("17").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).enterStaking(BN.from("27").mul(BN.from("10").pow("18")));

        console.log("A Cake Token After", Number(await CakeToken.balanceOf(a.address)));
        console.log("B Cake Token After", Number(await CakeToken.balanceOf(b.address)));
        console.log("C Cake Token After", Number(await CakeToken.balanceOf(c.address)));
        console.log("D Cake Token After", Number(await CakeToken.balanceOf(d.address)));

    })

    it("Should Test the function 'leaveStaking'",async()=>{

        await Token1.connect(owner).mint(a.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(b.address,BN.from("2000").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(c.address,BN.from("3000").mul(BN.from("10").pow("18")));
        await Token1.connect(owner).mint(d.address,BN.from("4000").mul(BN.from("10").pow("18")));

        await Token1.connect(a).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await Token1.connect(b).approve(MasterChef.address,BN.from("2000").mul(BN.from("10").pow("18")));
        await Token1.connect(c).approve(MasterChef.address,BN.from("3000").mul(BN.from("10").pow("18")));
        await Token1.connect(d).approve(MasterChef.address,BN.from("4000").mul(BN.from("10").pow("18")));

        await MasterChef.connect(a).deposit(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(b).deposit(1,BN.from("200").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).deposit(1,BN.from("300").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).deposit(1,BN.from("400").mul(BN.from("10").pow("18")));
                                                                                                
        await MasterChef.connect(a).withdraw(1,BN.from("100").mul(BN.from("10").pow("18")));
        await MasterChef.connect(b).withdraw(1,BN.from("200").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).withdraw(1,BN.from("300").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).withdraw(1,BN.from("400").mul(BN.from("10").pow("18")));

        console.log("A Cake Token", Number(await CakeToken.balanceOf(a.address)));
        console.log("B Cake Token", Number(await CakeToken.balanceOf(b.address)));
        console.log("C Cake Token", Number(await CakeToken.balanceOf(c.address)));
        console.log("D Cake Token", Number(await CakeToken.balanceOf(d.address)));

        await CakeToken.connect(a).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await CakeToken.connect(b).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await CakeToken.connect(c).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));
        await CakeToken.connect(d).approve(MasterChef.address,BN.from("1000").mul(BN.from("10").pow("18")));

        console.log("Block 1",await MasterChef.connect(a).enterStaking(BN.from("18").mul(BN.from("10").pow("18"))));
        await MasterChef.connect(b).enterStaking(BN.from("16").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).enterStaking(BN.from("17").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).enterStaking(BN.from("27").mul(BN.from("10").pow("18")));

        console.log("A Cake Token Before", Number(await CakeToken.balanceOf(a.address)));
        console.log("B Cake Token Before", Number(await CakeToken.balanceOf(b.address)));
        console.log("C Cake Token Before", Number(await CakeToken.balanceOf(c.address)));
        console.log("D Cake Token Before", Number(await CakeToken.balanceOf(d.address)));

        console.log("Block 2",await MasterChef.connect(a).leaveStaking(BN.from("18").mul(BN.from("10").pow("18"))));

        await MasterChef.connect(b).leaveStaking(BN.from("16").mul(BN.from("10").pow("18")));
        await MasterChef.connect(c).leaveStaking(BN.from("17").mul(BN.from("10").pow("18")));
        await MasterChef.connect(d).leaveStaking(BN.from("27").mul(BN.from("10").pow("18")));

        console.log("A Cake Token After", Number(await CakeToken.balanceOf(a.address)));
        console.log("B Cake Token After", Number(await CakeToken.balanceOf(b.address)));
        console.log("C Cake Token After", Number(await CakeToken.balanceOf(c.address)));
        console.log("D Cake Token After", Number(await CakeToken.balanceOf(d.address)));
        
    })
  })
})
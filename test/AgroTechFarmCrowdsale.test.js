/* node.js 8 or later is required */

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
.should();

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};

  
const AgroTechFarmToken = artifacts.require("./AgroTechFarmToken.sol")
const AgroTechFarmCrowdsale = artifacts.require("./AgroTechFarmCrowdsaleMock.sol");
const IcoStartDate = Math.round(new Date('2018-06-02').getTime() / 1000);

contract('AgroTechFarm', function (accounts) {
  let holderReserveTokens = accounts[1];
  let holderMarketingTokens = accounts[2];
  let holderTeamTokens = accounts[3];
  let holderReferalTokens = accounts[4];
  let holderAdvisorsTokens = accounts[5];
  let holderPartnershipsTokens = accounts[6];
  let holderBountyTokens = accounts[7];
  let multisig = accounts[8];

  beforeEach(async function () {
    this.token = await AgroTechFarmToken.new();
    this.crowdsale = await AgroTechFarmCrowdsale.new(multisig,  
    this.token.address,holderReserveTokens,holderMarketingTokens,
    holderTeamTokens,holderReferalTokens,holderAdvisorsTokens,
    holderPartnershipsTokens,holderBountyTokens);  
    await this.token.setSaleAgent(this.crowdsale.address,true);   
  });

	
	it('should pass if contract is deployed', async function() {
		let nameToken = await this.token.name.call();
		assert.strictEqual(nameToken, 'AgroTechFarm');
	});    
   
	it('maximum permissible to emission of tokens', async function() {
		let tokenCap = await this.token.cap.call();
		tokenCap = web3.toWei(tokenCap.toNumber(),'wei'); 
		assert.strictEqual(tokenCap, '5000000000000000000000000');
	});   

	it('should not accept payments before start date', async function() {	
	   await this.crowdsale.setCurrentTime(Math.round(new Date('2018-05-31').getTime() / 1000));    
	   try {
	       await this.crowdsale.send(ether(20));
	       assert.fail('Expected reject not received');
	   } catch (error) {
	      assert(error.message.search('revert') > 0, 'Wrong error message received: ' + error.message);     
	   }           
	});
	
    it('should not accept payments after end date', async function () {
      await this.crowdsale.setCurrentTime(Math.round(new Date('2018-08-02').getTime() / 1000));
      try {
          await this.crowdsale.send(ether(20));
          assert.fail('Expected reject not received');
      } catch (error) {
        assert(error.message.search('revert') > 0, 'Wrong error message received: ' + error.message);
      }
    });
    
    it('should accept payments during ico time', async function () {
      await this.crowdsale.setCurrentTime(IcoStartDate);
      await this.crowdsale.send(ether(1)).should.be.fulfilled;
    });
    
    
	it('initial distribution of tokens by commands', async function () {
		await this.crowdsale.setCurrentTime(IcoStartDate);        
		await this.crowdsale.spreadTokens();   
		let tokenSpread = await this.crowdsale.tokenSpread.call();
		assert.strictEqual(tokenSpread, true);     
	});
    
	it('re-distribution of tokens by commands is prohibited.', async function () {
		await this.crowdsale.setCurrentTime(IcoStartDate);        
		await this.crowdsale.spreadTokens();   
		let tokenSpread = await this.crowdsale.tokenSpread.call(); 
		assert.strictEqual(tokenSpread, true);         
	});
        
	it('purchase tokens with 20% bonus', async function () { 
		await this.crowdsale.setCurrentTime(IcoStartDate);    	
		await this.crowdsale.sendTransaction({from: accounts[9], value: ether(1)});
		let balanceOf = await this.token.balanceOf(accounts[9]);
		balanceOf = web3.toWei(balanceOf.toNumber(),'wei');
		assert.strictEqual(balanceOf, '99999999999600000000')	
	});

	it('purchase tokens with 10% bonus', async function () { 
		await this.crowdsale.setCurrentTime(IcoStartDate + duration.days(10));	
		await this.crowdsale.sendTransaction({from: accounts[9], value: ether(1)});
		let balanceOf = await this.token.balanceOf(accounts[9]);
		balanceOf = web3.toWei(balanceOf.toNumber(),'wei');
		assert.strictEqual(balanceOf, '91666666666300000000')
	});

	it('purchase tokens with 5% bonus', async function () { 
		await this.crowdsale.setCurrentTime(IcoStartDate + duration.days(25));	
		await this.crowdsale.sendTransaction({from: accounts[9], value: ether(1)});
		let balanceOf = await this.token.balanceOf(accounts[9]);
		balanceOf = web3.toWei(balanceOf.toNumber(),'wei');
		assert.strictEqual(balanceOf, '87499999999650000000')
	});

	it('purchase tokens without bonus', async function () { 
		await this.crowdsale.setCurrentTime(IcoStartDate + duration.days(40));	
		await this.crowdsale.sendTransaction({from: accounts[9], value: ether(1)});
		let balanceOf = await this.token.balanceOf(accounts[9]);
		balanceOf = web3.toWei(balanceOf.toNumber(),'wei');
		assert.strictEqual(balanceOf, '83333333333000000000')
	});

});


function ether (n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'));
}


 

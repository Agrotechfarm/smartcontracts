pragma solidity ^0.4.23;

import './../../contracts/AgroTechFarmCrowdsale.sol';

contract AgroTechFarmCrowdsaleMock is AgroTechFarmCrowdsale {

  uint256 private currentTime;
  address public holderReserveTokens;
  address public holderMarketingTokens;
  address public holderTeamTokens;
  address public holderReferalTokens;
  address public holderAdvisorsTokens;
  address public holderPartnershipsTokens;
  address public holderBountyTokens; 
  

  function AgroTechFarmCrowdsaleMock(address 
  _multisig,AgroTechFarmToken _token,address 
  _holderReserveTokens,address _holderMarketingTokens,address 
  _holderTeamTokens,address _holderReferalTokens,address 
  _holderAdvisorsTokens,address _holderPartnershipsTokens,address _holderBountyTokens) public
    AgroTechFarmCrowdsale(_multisig, _token) {
   
   holderReserveTokens = _holderReserveTokens;
   holderMarketingTokens = _holderMarketingTokens;
   holderTeamTokens = _holderTeamTokens;
   holderReferalTokens = _holderReferalTokens;
   holderAdvisorsTokens = _holderAdvisorsTokens;
   holderPartnershipsTokens = _holderPartnershipsTokens;
   holderBountyTokens = _holderBountyTokens;   
  }
  

  function setCurrentTime(uint256 _currentTime) public {
    currentTime = _currentTime;
  }

  function _getTime() internal view returns (uint256) {
    return currentTime;
  }
}

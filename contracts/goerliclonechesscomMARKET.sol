// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./chess_APIgetwinner.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChessMarket is Ownable{

   // notcreated is default 0, 
   // created when first user createsMatch, 
   // accepted is when second user accepts the invite, 
   // withdrawn changed to when winner withdraws.
   enum Game {notcreated, created, accepted, createrCancelled, accepterCancelled, rewardWithdrawn}

   struct Match {
     address against;
     uint  betvalue;
     Game gamestatus;
     bytes creater_username;     // chessdotcom usernames
     bytes accepter_username;
   }

   mapping (address => Match[]) public matches_ofuser;


   event Created(address indexed creater, bytes indexed creater_username, uint matchescreated, uint betvalue);
   event Accepted(address indexed accepter, address indexed creater, bytes indexed accepter_username, bytes creater_username, uint matchIndex);

   receive() external payable {}

   function createMatch(bytes calldata my_username) external payable{
     require(msg.value > 0,"cant bet for 0 ETH");
     Match memory newmatch = Match(address(0), msg.value, Game.created, my_username, bytes(''));

     Match[] storage _matches_ofuser = matches_ofuser[msg.sender];
     _matches_ofuser.push(newmatch);

     emit Created(msg.sender, my_username, _matches_ofuser.length + 1, msg.value);
   }

   function acceptInvite(address _creater, uint _indexAt, bytes calldata _creater_username, bytes calldata _accepter_username) external payable {
     Match[] storage _matches_ofuser = matches_ofuser[_creater];
     Game  _gamestatus = _matches_ofuser[_indexAt].gamestatus;

     require(_gamestatus == Game.created || _gamestatus == Game.accepterCancelled, "this match hasn't been created yet");
     require(keccak256(_matches_ofuser[_indexAt].creater_username) == keccak256(_creater_username), "wrong creater username");
     require(msg.value == _matches_ofuser[_indexAt].betvalue, "send the correct bet value");

     _matches_ofuser[_indexAt].against = msg.sender;
     _matches_ofuser[_indexAt].gamestatus = Game.accepted;
     _matches_ofuser[_indexAt].accepter_username = _accepter_username;

     emit Accepted(msg.sender, _creater, _accepter_username, _creater_username, _indexAt);

   }

   function cancel_CreatedMatch(uint _indexAt)  external {
     Match[] storage _matches_ofuser = matches_ofuser[msg.sender];
     Game  _gamestatus = _matches_ofuser[_indexAt].gamestatus;
    
     require( _gamestatus == Game.created || _gamestatus == Game.accepterCancelled,"this match is not created or its already been accepted or withdrawn already");
     _matches_ofuser[_indexAt].gamestatus = Game.createrCancelled;

     payable(msg.sender).transfer(_matches_ofuser[_indexAt].betvalue);
   }
   

   function cancel_AcceptedMatch(address _creater, uint _indexAt)  external {
     Match[] storage _matches_ofuser = matches_ofuser[_creater];
     require(_matches_ofuser[_indexAt].against == msg.sender, "you didnt accept this match");

     Game  _gamestatus = _matches_ofuser[_indexAt].gamestatus;
     require( _gamestatus == Game.accepted ,"this match is not created or its already been accepted or withdrawn already");
    
     _matches_ofuser[_indexAt].gamestatus = Game.accepterCancelled;
    
     payable(msg.sender).transfer(_matches_ofuser[_indexAt].betvalue);
   }

   function withdrawInitiate ( string calldata _apiurl)  external {
    
    GenericLargeResponse(0x1d006e57D178d6F50E774e985c2B4Ac65E47E321).requestBytes(_apiurl);

    GenericLargeResponse(0xf395417C1E98e3e9346b4f6d669f2CFEd9DDbA9d).requestBytes(_apiurl);

    GenericLargeResponse(0x1E2d0B340bB90D62fAA554fB43Fb9a11C5769858).requestBytes(_apiurl);

    GenericLargeResponse(0xA5A02b008BEB2f9658E2b39Ae0De9bd677Eaf4fe).requestBytes(_apiurl);
    
   }

   function withdrawComplete(address _creater,  uint _indexAt)  external  {

    Match[] storage _matches_ofuser = matches_ofuser[_creater];
    require(_matches_ofuser[_indexAt].gamestatus == Game.accepted,"this match is not accepted or cancelled");
        bytes memory _winnercolour = GenericLargeResponse(0x1d006e57D178d6F50E774e985c2B4Ac65E47E321).data();
        bytes memory _username = GenericLargeResponse(0xf395417C1E98e3e9346b4f6d669f2CFEd9DDbA9d).data();
        bytes memory _usercolour = GenericLargeResponse(0x1E2d0B340bB90D62fAA554fB43Fb9a11C5769858).data();
        bytes memory _bottomuser = GenericLargeResponse(0xA5A02b008BEB2f9658E2b39Ae0De9bd677Eaf4fe).data(); 

        (address _winningAddress, bool iswon) = _iswon(_matches_ofuser[_indexAt], _creater, msg.sender, _winnercolour, _username, _usercolour, _bottomuser);
     
    if (iswon) {
        _matches_ofuser[_indexAt].gamestatus = Game.rewardWithdrawn;
        payable(_winningAddress).transfer(_matches_ofuser[_indexAt].betvalue * 180 / 100);        // 10% fee from each user.
    }
   }


   function _iswon(Match memory _match, address _creater, address _withdrawer, bytes memory _winnercolour,
    bytes memory _username, bytes memory _usercolour, bytes memory _bottomuser)  internal view returns (address, bool) {
    
    if (keccak256(_winnercolour) == keccak256(_usercolour)) {
       
        if (keccak256(_username) == keccak256(_match.creater_username)) {
            return (_creater, true);
        }
        if (keccak256(_username) == keccak256(_match.accepter_username)) {
            if(_withdrawer == _match.against){
                return (_withdrawer, true);
            }
        }else {
            return (address(this),false);
        }


    }else {
        
        if (keccak256(_bottomuser) == keccak256(_match.creater_username)) {
            return (_creater, true);
        }
        if (keccak256(_bottomuser) == keccak256(_match.accepter_username)) {
            if(_withdrawer == _match.against){
                return (_withdrawer, true);
            }
        }else {
            return (address(this),false);
        }
    }
   }

   function withdrawETH(address _target,uint _amount) external onlyOwner {
    require(_amount > 0);
    payable(_target).transfer(_amount);
   }


}

// 0x79373a3E098494364a19ac9eC4D7FbE4213fB63C
// final 0x7eb735624992283d8699C8CaC3e56A3AE612dEB1
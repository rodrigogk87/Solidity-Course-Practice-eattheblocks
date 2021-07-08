pragma solidity 0.8.0;

contract Wallet{
    address[] public approvers;
    uint public quorum;
    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }
    Transfer[] public transfers;
    mapping(address => mapping(uint=>bool)) public approvals;
     
    constructor(address[] memory _approvers, uint _quorum) {
        approvers = _approvers;
        quorum = _quorum;
    }
    

    function getApprovers() external view returns(address[] memory){
         return approvers;
     }
     
    function getTransfers() external view returns(Transfer[] memory){
         return transfers;
     }
     
     
    //añade transferencia a aprobar por multifirmas a partir de amount y direccion destino
    function createTransfer(uint amount, address payable to) external onlyApprover(){
        transfers.push(Transfer(
          transfers.length,
          amount,
          to,
          0,
          false
        ));
    }
    
    //aprueba transferencia si se llego al quorum para dicha transferencia y la transfiere a direccion destino
    function approveTransfer(uint id) external onlyApprover(){
        require(transfers[id].sent == false, 'transfer has already been sent');
        require(approvals[msg.sender][id] == false, 'already approved');
        
        approvals[msg.sender][id] = true;
        transfers[id].approvals++;
        if(transfers[id].approvals >= quorum){
            transfers[id].sent = true;
            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount);
        }
    }
    
    //recibe ethereum
    receive() external payable {}
    
    modifier onlyApprover(){
        bool approved = false;
        for(uint i=0;i<approvers.length;i++){
            if(approvers[i]==msg.sender){
                approved=true;
            }
        }
        require(approved==true,"not authorized");
        _;
    }
    
}
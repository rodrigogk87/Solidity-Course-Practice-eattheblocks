import React from 'react';

function Header ({approvers,quorum}){
    return (
        <header>
            <ul>
                <li>Approvers</li>

                {approvers.map((approvers) => (
                    <li> { approvers }</li>
                ))}
                <li>Quorum: { quorum }</li>
            </ul>
        </header>
    )
}

export default Header;
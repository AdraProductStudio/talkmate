import React from 'react'

const CustomButton = ({
    className,
    buttonName,
    onClick,
    title
}) => {


    return (
        <button className={className} onClick={onClick} title={title}>
            {buttonName}
        </button>
    )
}

export default CustomButton

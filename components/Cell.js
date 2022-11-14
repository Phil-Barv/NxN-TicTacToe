import { useEffect, useState } from "react";

const Cell = (pos) => {

    const [value, setValue] = useState("");

    useEffect(()=> {
        setValue(pos)
    }, [pos])

    return (
        <>
           {/* <div 
                style={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    width:"50px", 
                    height:"50px", 
                    border:"1px solid black",
                    padding:"0px",
                    margin:"5px"
                }}> */}
                <h1>{value['pos']}</h1>
           {/* </div> */}
        </>
    )
}

export default Cell;